'use client';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '../ui/card';


export interface LandingFeatureProps {
  title: string;
  description: string;
  image: ImageProps;
  imagePosition: 'left' | 'right';
}

export function LandingFeature({ title, description, image, imagePosition }: LandingFeatureProps) {
  const isImageLeft = imagePosition === 'left';

  const textVariants = {
    hidden: { opacity: 0, x: isImageLeft ? 50 : -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: isImageLeft ? -50 : 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };


  return (
    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
      <motion.div
        className={cn('order-1', isImageLeft ? 'lg:order-2' : 'lg:order-1')}
        variants={textVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">{title}</h3>
        <p className="mt-6 text-lg leading-8 text-muted-foreground">{description}</p>
      </motion.div>
      <motion.div
        className={cn('order-2', isImageLeft ? 'lg:order-1' : 'lg:order-2')}
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Card className="overflow-hidden shadow-2xl rounded-2xl transition-all duration-300 hover:shadow-primary/20 hover:scale-[1.02]">
            <Image
                {...image}
                className="w-full h-auto"
            />
        </Card>
      </motion.div>
    </div>
  );
}
