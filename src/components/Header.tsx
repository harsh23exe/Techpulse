'use client';

import Link from "next/link";
import { useState } from "react";
import Icon from "./ui/Icon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "News Search" },
  { href: "/chat", label: "AI Chat" },
  { href: "/blog", label: "Blog" }
];

const linkClassName = "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="w-full py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">TechPulse AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClassName}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={handleMobileMenuToggle}
          aria-label="Toggle mobile menu"
        >
          <Icon 
            name={isMobileMenuOpen ? "close" : "menu"} 
            className="text-gray-600 dark:text-gray-300" 
          />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col space-y-3 pt-4">
            {navLinks.map(({ href, label }) => (
              <Link 
                key={href}
                href={href} 
                className={`${linkClassName} px-2 py-1`}
                onClick={closeMobileMenu}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
