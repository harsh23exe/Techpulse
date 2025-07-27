'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { backendAPI, ChatMessage } from '@/services/BackendAPIService';
import Button from '@/components/ui/Button';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

    const userMessage: ChatMessage = {
      type: 'user_message',
      content: inputMessage,
      selected_news_article: null
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    websocketRef.current.send(JSON.stringify(userMessage));
    setInputMessage('');
  }, [inputMessage, isConnected]);

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
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content || message.message || 'No message content available'}
                  </p>
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

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the latest tech news..."
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
