'use client';

import { motion } from 'framer-motion';
import { LandingHeader } from './landing-header';
import { LandingHero } from './landing-hero';
import { LandingFeature, LandingFeatureProps } from './landing-feature';
import { LandingFooter } from './landing-footer';
import { ShieldCheck, Database, Lightbulb } from 'lucide-react';

const features: LandingFeatureProps[] = [
  {
    title: 'Stay Informed with a Localized News Feed',
    description: 'DistrictPulse aggregates news from multiple sources, providing a single, reliable feed for your district. Our AI summarizes articles, so you get the key information in seconds, keeping you connected to your community.',
    image: {
      src: "https://images.unsplash.com/photo-1758876200754-17a09a6c2728?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8c2VlaW5nJTIwbW9iaWxlfGVufDB8fHx8MTc2NzI1OTc1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Phone showing a news feed",
      width: 600,
      height: 400,
      "data-ai-hint": "smartphone newsfeed",
    },
    imagePosition: 'right',
  },
  {
    title: 'Your Voice Matters: Report Civic Issues',
    description: 'See a pothole, a broken streetlight, or a sanitation problem? Report it instantly using text, voice, or an image. DistrictPulse uses AI to categorize and route your report to the right department, ensuring your concerns are heard.',
    image: {
      src: "https://images.unsplash.com/photo-1714366449821-6ffe48e42355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0YWtpbmclMjBwaG90byUyMHBob25lJTIwb3V0ZG9vcnxlbnwwfHx8fDE3NjcyNjAyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "A person taking a photo of a civic issue with their phone.",
       width: 600,
      height: 400,
      "data-ai-hint": "pothole street",
    },
    imagePosition: 'left',
  },
  {
    title: 'Ask Questions, Get AI-Powered Answers',
    description: 'Have a question about local services, public transport, or government schemes? Our AI-powered chatbot provides instant, accurate answers in multiple languages, making civic information accessible to everyone.',
    image: {
      src: "https://images.unsplash.com/photo-1764664281863-f736f2d942bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGF0dGluZyUyMHdpdGglMjBhaSUyMHxlbnwwfHx8fDE3NjcyNjA1OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Person using a chatbot on their phone",
      width: 600,
      height: 400,
      "data-ai-hint": "chatbot phone",
    },
    imagePosition: 'right',
  },
  {
    title: 'Transparency and Trust Through Trend Analysis',
    description: 'We analyze citizen reports and news articles to identify recurring issues in your district. This data-driven approach promotes transparency and helps officials prioritize the most pressing problems in your community.',
    image: {
      src: "https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx0cnVzdHxlbnwwfHx8fDE3NjcyNjA5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "A dashboard showing data analytics and charts",
      width: 600,
      height: 400,
      "data-ai-hint": "analytics dashboard",
    },
    imagePosition: 'left',
  },
];


const trustFeatures = [
    {
        icon: ShieldCheck,
        title: "Secure & Private",
        description: "Your data is protected with industry-standard security protocols. We value your privacy."
    },
    {
        icon: Lightbulb,
        title: "AI-Powered Verification",
        description: "Our AI helps verify and categorize reports, ensuring credibility and efficient processing."
    },
    {
        icon: Database,
        title: "Data-Backed Insights",
        description: "We use aggregated, anonymized data to generate insights that help improve your community."
    }
];


export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <LandingHeader />
      <main>
        <LandingHero />
        <div id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                    <h2 className="text-base font-semibold leading-7 text-primary">Your Community, Connected</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Everything you need to engage with your district
                    </p>
                    <p className="mt-6 text-lg leading-8 text-muted-foreground">
                        From critical news updates to reporting local problems, DistrictPulse brings civic engagement to your fingertips.
                    </p>
                </motion.div>
            </div>
             <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                <div className="space-y-20">
                    {features.map((feature, index) => (
                    <LandingFeature key={index} {...feature} />
                    ))}
                </div>
            </div>
          </div>
        </div>
        
        <div id="trust" className="bg-muted/50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                 <div className="mx-auto max-w-2xl lg:text-center">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        >
                        <h2 className="text-base font-semibold leading-7 text-primary">Built for Trust</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                           Transparency and Credibility First
                        </p>
                        <p className="mt-6 text-lg leading-8 text-muted-foreground">
                           We are committed to building a platform that is secure, transparent, and reliable for all users.
                        </p>
                    </motion.div>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <motion.div 
                        className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ staggerChildren: 0.2 }}
                    >
                         {trustFeatures.map((feature) => (
                             <motion.div 
                                key={feature.title}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                className="relative pl-16"
                            >
                                <div className="text-base font-semibold leading-7 text-foreground">
                                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    {feature.title}
                                </div>
                                <div className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>

      </main>
      <LandingFooter />
    </div>
  );
}
