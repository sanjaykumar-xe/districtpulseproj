'use client';
import Link from "next/link";
import { Landmark } from "lucide-react";

const footerLinks = [
    { href: '#features', label: 'Features' },
    { href: '#trust', label: 'Trust' },
    { href: '#', label: 'Help' },
    { href: '#', label: 'Privacy' },
    { href: '#', label: 'Terms' },
];

export function LandingFooter() {
  return (
    <footer className="bg-muted/40 border-t" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
                <Landmark className="h-7 w-7 text-primary" />
                <span className="text-lg font-bold font-headline">DistrictPulse</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:order-2">
                {footerLinks.map((link) => (
                    <Link key={link.label} href={link.href} className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                        {link.label}
                    </Link>
                ))}
            </div>
            <p className="mt-4 md:mt-0 text-center text-xs leading-5 text-muted-foreground md:order-1">
                &copy; 2024 DistrictPulse. All rights reserved.
            </p>
        </div>
      </div>
    </footer>
  );
}
