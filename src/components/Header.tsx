import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">TechPulse AI</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Home
          </Link>
          <Link 
            href="/blog" 
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
