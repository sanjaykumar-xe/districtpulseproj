'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Landmark, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#trust', label: 'Trust' },
  { href: '#', label: 'Help' },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled ? 'bg-background/80 shadow-md backdrop-blur-sm' : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline">DistrictPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild>
              <Link href="/login">Login / Signup</Link>
            </Button>
          </div>
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={isMobileMenuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
        >
          <div className="border-t border-border bg-background/95 backdrop-blur-sm pb-4">
              <div className="flex flex-col items-center gap-6 px-6 pt-6">
              {navLinks.map((link) => (
                  <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-medium text-foreground transition-colors hover:text-primary"
                  >
                  {link.label}
                  </Link>
              ))}
              <Button asChild className="w-full">
                  <Link href="/login">Login / Signup</Link>
              </Button>
              </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
