'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { backendAPI, ChatMessage, NewsArticle } from '@/services/BackendAPIService';
import Button from '@/components/ui/Button';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [articleContext, setArticleContext] = useState<NewsArticle | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load article context from localStorage
  useEffect(() => {
    const storedContext = localStorage.getItem('chatArticleContext');
    if (storedContext) {
      try {
        const articleData = JSON.parse(storedContext);
        setArticleContext(articleData);
        
        // Add initial message about the article context
        setMessages(prev => [...prev, {
          type: 'bot_response',
          content: `I have context about the article: "${articleData.title}".`
        }]);
        
        // Clear the stored context after loading
        localStorage.removeItem('chatArticleContext');
      } catch (error) {
        console.error('Error parsing article context from localStorage:', error);
        localStorage.removeItem('chatArticleContext');
      }
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    const ws = backendAPI.createChatWebSocket();
    if (!ws) {
      console.error('Failed to create WebSocket connection');
      return;
    }

    websocketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setMessages(prev => [...prev, {
        type: 'bot_response',
        content: 'Connected to TechPulse AI. Ask me anything about the latest tech news!'
      }]);
    };

    ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data);
        
        // Ensure message has required fields
        if (!message.type) {
          console.error('Invalid message format: missing type');
          return;
        }
        
        // Ensure content is a string
        if (message.content !== undefined && message.content !== null) {
          message.content = String(message.content);
        }
        if (message.message !== undefined && message.message !== null) {
          message.message = String(message.message);
        }
        
        setMessages(prev => [...prev, message]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        // Add error message to chat
        setMessages(prev => [...prev, {
          type: 'error',
          content: 'Error processing message from server'
        }]);
        setIsLoading(false);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsLoading(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      setIsLoading(false);
      // Add error message to chat
      setMessages(prev => [...prev, {
        type: 'error',
        content: 'Connection error. Please try reconnecting.'
      }]);
    };
  }, []);

  const sendMessage = useCallback(() => {
    if (!inputMessage.trim() || !websocketRef.current || !isConnected) return;

    // Create message structure with only current message and article context as string
    const messageData = {
      type: 'user_message',
      content: inputMessage,
      selected_news_article: articleContext ? JSON.stringify(articleContext) : null
    };

    // Add user message to local state
    const userMessage: ChatMessage = {
      type: 'user_message',
      content: inputMessage,
      selected_news_article: articleContext
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    websocketRef.current.send(JSON.stringify(messageData));
    setInputMessage('');
  }, [inputMessage, isConnected, articleContext]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const getMessageClassName = (type: string) => {
    const baseClasses = 'max-w-xs lg:max-w-md px-4 py-2 rounded-lg';
    switch (type) {
      case 'user_message':
        return `${baseClasses} bg-blue-600 text-white`;
      case 'error':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white`;
    }
  };

  const getMessageContent = (message: ChatMessage) => {
    const content = message.content || message.message || 'No message content available';
    
    // For bot responses, ensure proper line breaks for markdown
    if (message.type !== 'user_message') {
      return content;
    }
    
    return content;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              TechPulse AI Chat
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {!isConnected && (
                <Button onClick={connectWebSocket} size="sm" variant="secondary">
                  Connect
                </Button>
              )}
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user_message' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={getMessageClassName(message.type)}>
                  {message.type === 'user_message' ? (
                    <p className="text-sm whitespace-pre-wrap">
                      {getMessageContent(message)}
                    </p>
                  ) : (
                    <MarkdownRenderer 
                      content={getMessageContent(message)}
                      className="text-sm"
                    />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Article Context Attachment */}
          {articleContext && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Article Context
                    </h4>
                    <button
                      onClick={() => {
                        setArticleContext(null);
                        // Also clear any stored context from localStorage
                        localStorage.removeItem('chatArticleContext');
                      }}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mt-1">
                    {articleContext.title}
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {articleContext.summary}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {new Date(articleContext.published_at).toLocaleDateString()}
                    </span>
                    <a
                      href={articleContext.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Article →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={articleContext ? "Ask about this article or any tech news..." : "Ask about the latest tech news..."}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={!isConnected}
              />
              <Button onClick={sendMessage} disabled={!isConnected || !inputMessage.trim()}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
