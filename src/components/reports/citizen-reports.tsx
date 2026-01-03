'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { classifyCitizenReport, type ClassifyCitizenReportOutput } from '@/ai/flows/classify-citizen-reports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Mic, Image as ImageIcon, Send, Bot, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
  text: z.string().optional(),
  voice: z.any().optional(),
  image: z.any().optional(),
}).refine(data => data.text || data.voice || data.image, {
  message: "Please provide a report through text, voice, or image.",
  path: ["text"],
});

type InputType = 'text' | 'voice' | 'image';

export function CitizenReports() {
  const [result, setResult] = useState<ClassifyCitizenReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [inputType, setInputType] = useState<InputType>('text');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleStartRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], "recording.webm", { type: 'audio/webm' });
            form.setValue('voice', audioFile);
            audioChunksRef.current = [];
            toast({ title: 'Recording finished', description: 'Audio captured and ready for submission.'});
        };
        audioChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        toast({ variant: 'destructive', title: 'Microphone Error', description: 'Could not access microphone.'});
    }
  };
  
  const handleStopRecording = () => {
      if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setIsSubmitted(false);
    try {
      let voiceDataUri, imageDataUri;
      if (values.voice instanceof File) {
        voiceDataUri = await fileToDataUri(values.voice);
      }
      
      if (values.image && values.image.length > 0) {
        imageDataUri = await fileToDataUri(values.image[0]);
      }

      const reportResult = await classifyCitizenReport({
        text: values.text,
        voiceDataUri,
        imageDataUri,
      });
      setResult(reportResult);
      form.reset({ text: '', voice: null, image: null });
      toast({ title: 'Report Submitted', description: 'AI classification complete.' });
      setIsSubmitted(true);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'Could not classify the report. Please try again.',
      });
      console.error(e);
    }
    setIsLoading(false);
  }

  return (
    <Card className="shadow-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Submit a Citizen Report</CardTitle>
          <CardDescription>Report an issue. Use text, voice, or an image. AI will categorize it.</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
          {isSubmitted && result ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-4 py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <CheckCircle className="h-16 w-16 mx-auto text-success" />
                </motion.div>
                <h3 className="text-xl font-headline font-semibold">Report Submitted Successfully!</h3>
                <p className="text-muted-foreground">Thank you for your contribution.</p>
                <Button onClick={() => { setIsSubmitted(false); setResult(null); }}>Submit Another Report</Button>
              </motion.div>
          ) : (
            <motion.div key="form">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs value={inputType} onValueChange={(v) => setInputType(v as InputType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="text"><FileText className="mr-2 h-4 w-4"/>Text</TabsTrigger>
                      <TabsTrigger value="voice"><Mic className="mr-2 h-4 w-4"/>Voice</TabsTrigger>
                      <TabsTrigger value="image"><ImageIcon className="mr-2 h-4 w-4"/>Image</TabsTrigger>
                    </TabsList>
                    <AnimatePresence mode="wait">
                      <motion.div
                          key={inputType}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                      >
                        <TabsContent value="text" className="pt-4">
                          <FormField control={form.control} name="text" render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea className="focus-visible:ring-2 focus-visible:ring-primary/50" placeholder="e.g., There is a large pothole on Main Street..." {...field} rows={3} />
                              </FormControl>
                            </FormItem>
                          )} />
                        </TabsContent>
                        <TabsContent value="voice" className="pt-4">
                            <FormItem>
                                <FormControl>
                                    <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-2xl min-h-[90px]">
                                        {isRecording ? (
                                            <Button type="button" onClick={handleStopRecording} variant="destructive">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    Stop Recording
                                                </motion.div>
                                            </Button>
                                        ) : (
                                            <Button type="button" onClick={handleStartRecording}>
                                                <Mic className="mr-2 h-4 w-4" /> Start Recording
                                            </Button>
                                        )}
                                        {form.watch('voice') && !isRecording && <p className="text-sm text-muted-foreground mt-2">Audio captured.</p>}
                                    </div>
                                </FormControl>
                            </FormItem>
                        </TabsContent>
                        <TabsContent value="image" className="pt-4">
                          <FormField control={form.control} name="image" render={({ field: { onChange, value, ...rest } }) => (
                            <FormItem>
                              <FormControl>
                                <Input className="file:text-primary file:font-semibold" type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} />
                              </FormControl>
                            </FormItem>
                          )} />
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </Tabs>
                  <FormMessage>{form.formState.errors.root?.message || form.formState.errors.text?.message}</FormMessage>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Submit Report
                    </Button>
                  </motion.div>
                </form>
              </Form>

              {isLoading && (
                  <div className="mt-4 flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">AI is analyzing your report...</p>
                  </div>
              )}
            
              {result && !isLoading && !isSubmitted &&(
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 space-y-4"
                >
                    <h3 className="font-headline font-semibold flex items-center"><Bot className="mr-2"/>AI Classification Result</h3>
                    <div>
                        <p className="font-semibold text-sm">Category</p>
                        <Badge variant="secondary" className="text-base mt-1">{result.category}</Badge>
                    </div>
                    <div>
                        <p className="font-semibold text-sm">Confidence</p>
                        <div className="flex items-center gap-2 mt-1">
                            <Progress value={result.confidence * 100} className="w-full" />
                            <span className="font-mono text-sm font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                        <div>
                        <p className="font-semibold text-sm">AI Summary</p>
                        <p className="text-muted-foreground text-sm mt-1 border p-3 rounded-lg bg-muted/50">{result.summary}</p>
                    </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </CardContent>
      </Card>
  );
}
