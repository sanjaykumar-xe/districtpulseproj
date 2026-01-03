'use client';
import { useState, useEffect, useCallback } from 'react';
import { generateNewsFeed, type NewsItem } from '@/ai/flows/generate-news-feed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Newspaper, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/app-state-provider';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const SkeletonLoader = () => (
    <div className="p-6 pt-0 space-y-4">
        {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
                <div className="flex items-center gap-4">
                    <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-3/4 bg-muted rounded-md animate-pulse" />
                </div>
                <div className="h-4 w-full bg-muted rounded-md animate-pulse ml-4"/>
                <div className="h-4 w-1/2 bg-muted rounded-md animate-pulse ml-4"/>
                {index < 4 && <hr className="mt-4" />}
            </div>
        ))}
    </div>
);


export function NewsAnalysis() {
  const [feed, setFeed] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, NewsItem[]>>({});
  const { toast } = useToast();
  const { selectedDistrict, selectedState, language } = useAppState();

  const fetchNews = useCallback(async (forceRefresh = false) => {
    if (!selectedDistrict || !selectedState) return;

    const cacheKey = `${selectedState}-${selectedDistrict}-${language}`;
    if (!forceRefresh && cache[cacheKey]) {
      setFeed(cache[cacheKey]);
      return;
    }

    setIsLoading(true);
    setFeed(null);
    try {
      const result = await generateNewsFeed({ district: selectedDistrict, state: selectedState, language });
      setFeed(result.newsFeed);
      setCache((prevCache) => ({ ...prevCache, [cacheKey]: result.newsFeed }));
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Fetch News',
        description: e.message || 'Could not generate the news feed. Please try again.',
      });
      console.error(e);
    }
    setIsLoading(false);
  }, [selectedDistrict, selectedState, language, cache, toast]);

  useEffect(() => {
    const cacheKey = `${selectedState}-${selectedDistrict}-${language}`;
    if (!cache[cacheKey]) {
      fetchNews();
    } else {
      setFeed(cache[cacheKey]);
    }
  }, [selectedDistrict, selectedState, language, cache, fetchNews]);

  const getCategoryBadge = (category: string) => {
    const variants: {[key: string]: 'default' | 'secondary' | 'destructive' | 'outline'} = {
        'Infrastructure': 'default',
        'Politics': 'secondary',
        'Weather': 'outline',
        'Health': 'destructive',
        'Community': 'default',
        'Business': 'secondary'
    };
    return <Badge variant={variants[category] || 'default'} className="rounded-full">{category}</Badge>;
  }

  return (
    <Card className="shadow-lg rounded-2xl h-full flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center">
             <div className="grid gap-2">
                <CardTitle className="font-headline flex items-center"><Newspaper className="mr-2 h-5 w-5"/> Live News Feed for {selectedDistrict}</CardTitle>
                <CardDescription>AI-generated news updates for your selected district.</CardDescription>
            </div>
            <Button onClick={() => fetchNews(true)} disabled={isLoading} size="sm" className="ml-auto gap-1">
                <motion.div
                    animate={{ rotate: isLoading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0, ease: 'linear' }}
                >
                    <RefreshCw className='h-4 w-4' />
                </motion.div>
                Refresh
            </Button>
        </CardHeader>
        <CardContent className="flex-1 p-0 relative">
            <ScrollArea className="h-[calc(100vh-220px)]">
                {isLoading && !feed && <SkeletonLoader />}

                {!isLoading && feed && (
                    <motion.div 
                        className="grid gap-6 p-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {feed.map((item, index) => (
                            <motion.div 
                                key={index} 
                                variants={itemVariants}
                                className="group"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.02,
                                    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }} 
                                    className="grid items-start gap-4 p-4 rounded-2xl transition-shadow"
                                >
                                     <div className="flex items-center gap-4">
                                        {getCategoryBadge(item.category)}
                                        <h3 className="font-semibold font-headline text-base">{item.headline}</h3>
                                     </div>
                                    <p className="text-sm text-muted-foreground ml-4 -mt-2">{item.summary}</p>
                                </motion.div>
                                {index < feed.length - 1 && <hr className="mt-4"/>}
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!isLoading && !feed && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex min-h-[400px] items-center justify-center rounded-lg"
                    >
                        <div className="text-center text-muted-foreground space-y-2">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Newspaper className="h-12 w-12 mx-auto" />
                            </motion.div>
                            <p className="mt-4">No news to display. Select a district or try refreshing.</p>
                        </div>
                    </motion.div>
                )}
            </ScrollArea>
        </CardContent>
    </Card>
  );
}
