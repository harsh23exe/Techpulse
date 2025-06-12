'use client';

import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  content: string;
}

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    // Extract headers from content
    const headers = content
      .split('\n')
      .filter(line => line.startsWith('#'))
      .map(line => {
        const level = line.match(/^#+/)?.[0].length || 1;
        const title = line.replace(/^#+\s/, '');
        const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { id, title, level };
      });

    setToc(headers);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length < 3) return null;

  return (
    <nav className="hidden xl:block sticky top-8 ml-8 w-64">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Table of Contents
      </h2>
      <ul className="space-y-3 text-sm">
        {toc.map(({ id, title, level }) => (
          <li
            key={id}
            style={{ paddingLeft: `${(level - 1) * 16}px` }}
          >
            <a
              href={`#${id}`}
              className={`block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                activeId === id ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
              }`}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
