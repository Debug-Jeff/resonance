'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { Heart, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Contact', href: '/contact' },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-purple-200/50 dark:border-purple-800/50 transition-opacity duration-300",
        mobileMenuOpen ? "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto" : "opacity-100"
      )}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Resonance
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-semibold leading-6 transition-colors hover:text-purple-600 dark:hover:text-purple-400",
                  pathname === item.href
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-900 dark:text-gray-100"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
            <ThemeToggle />
            <Link href="/auth/signin">
              <Button variant="ghost" className="text-sm font-semibold leading-6">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="gradient-primary hover:scale-105 transition-transform">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile menu modal */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md lg:hidden" 
            onClick={closeMobileMenu}
          />
          
          {/* Centered Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 lg:hidden">
            <div className="w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Resonance
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={closeMobileMenu}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="p-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-4 py-3 text-base font-semibold leading-7 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                      pathname === item.href
                        ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
                        : "text-gray-900 dark:text-gray-100"
                    )}
                    onClick={closeMobileMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 space-y-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="space-y-3">
                  <Link href="/auth/signin" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={closeMobileMenu}>
                    <Button className="w-full gradient-primary">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}