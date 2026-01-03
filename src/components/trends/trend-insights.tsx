'use client';
import { useState } from 'react';
import { identifyRecurringIssues, type IdentifyRecurringIssuesOutput } from '@/ai/flows/identify-recurring-issues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, BarChart2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/app-state-provider';
import { motion, AnimatePresence } from 'framer-motion';

export function TrendInsights() {
  const [result, setResult] = useState<IdentifyRecurringIssuesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedDistrict } = useAppState();
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!selectedDistrict) {
        toast({
            variant: 'destructive',
            title: 'No District Selected',
            description: 'Please select a district to analyze trends.',
        });
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await identifyRecurringIssues({ district: selectedDistrict });
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not generate trend insights. Please try again later.',
      });
    }
    setIsLoading(false);
  };

  return (
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Trend Insights</CardTitle>
          <CardDescription>Analyze recurring issues in {selectedDistrict || 'your district'}.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleAnalysis} disabled={isLoading || !selectedDistrict} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart2 className="mr-2 h-4 w-4" />}
              Analyze Trends
            </Button>
          </motion.div>
          <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y:10 }}
                  animate={{ opacity: 1, y:0 }}
                  exit={{ opacity: 0, y:-10 }}
                  className="flex flex-col items-center justify-center pt-8 space-y-2"
                >
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">AI is crunching the data for {selectedDistrict}...</p>
                </motion.div>
            ) : !result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-2 text-muted-foreground pt-8"
                >
                    <motion.div
                      animate={{ y: [0, -5, 0], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Lightbulb className="h-10 w-10 mx-auto" />
                    </motion.div>
                    <p className="text-sm pt-2">Click "Analyze Trends" to see AI-powered insights.</p>
                </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 space-y-3"
              >
                  <h3 className="font-headline font-semibold text-lg">Recurring Issues in {selectedDistrict}</h3>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground border p-4 rounded-lg bg-muted/50">{result.summary}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
  );
}
