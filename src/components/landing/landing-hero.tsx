'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

export function LandingHero() {
  return (
    <div className="relative isolate overflow-hidden pt-14 h-[100vh] flex items-center justify-center">
        <Image
            src="https://images.unsplash.com/photo-1568992688065-536aad8a12f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtZWV0dXB8ZW58MHx8fHwxNzY3MjU3MTEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Community meeting"
            width={1920}
            height={1080}
            data-ai-hint="community meeting"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
            priority
        />
        <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gray-900/60"
        />
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-headline">
                    Empowering Citizens, Improving Districts
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                    The AI-powered platform that connects you with your local community. Get live news, report issues, and stay informed.
                </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 flex items-center justify-center gap-x-6"
                >
                    <Button asChild size="lg" className="shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-0.5">
                        <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-2 border-white bg-transparent text-white transition-colors hover:bg-white hover:text-primary">
                        <Link href="#features">Learn More &rarr;</Link>
                    </Button>
                </motion.div>
            </div>
        </div>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <ChevronDown className="h-8 w-8 text-white/70"/>
            </motion.div>
        </motion.div>
    </div>
  )
}
