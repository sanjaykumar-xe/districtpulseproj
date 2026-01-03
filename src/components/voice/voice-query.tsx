'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { Mic, MicOff, Volume2, Bot, User, Loader2, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { answerCivicQueriesViaVoice } from '@/ai/flows/answer-civic-queries-via-voice';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { useAppState } from '@/context/app-state-provider';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

type Message = {
  role: 'user' | 'bot';
  text: string;
  audio?: string;
};

const languageCodes: { [key: string]: string } = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Malayalam: 'ml-IN',
};

export function VoiceQuery() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const { toast } = useToast();
  const { language } = useAppState();
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = languageCodes[language] || 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          toast({
            variant: 'destructive',
            title: 'Speech Recognition Error',
            description: event.error,
          });
        }
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setMessages((prev) => [...prev, { role: 'user', text: transcript }]);
        await handleAiResponse(transcript);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [toast, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleAiResponse = async (question: string) => {
    setIsLoading(true);
    try {
      const result = await answerCivicQueriesViaVoice({ question, language });
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: result.answer, audio: result.audio },
      ]);
      playAudio(result.audio);
    } catch (error) {
      console.error('AI response error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to get a response from the AI.',
      });
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: textInput }]);
    await handleAiResponse(textInput);
    setTextInput('');
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        variant: 'destructive',
        title: 'Unsupported Browser',
        description: 'Speech recognition is not supported on this browser.',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };
  
  const playAudio = (audioDataUri: string) => {
    if (audioRef.current) {
        audioRef.current.pause();
    }
    const audio = new Audio(audioDataUri);
    audioRef.current = audio;
    audio.play().catch(e => console.error("Audio playback failed", e));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
             <Button variant="ghost" size="icon">
                <Mic className="h-5 w-5" />
                <span className="sr-only">Ask DistrictPulse</span>
            </Button>
        ) : (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" className="shadow-lg shadow-primary/50">
                <motion.div
                    animate={{ scale: [1, 1.1, 1]}}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Mic className="mr-2 h-4 w-4" />
                </motion.div>
                Ask DistrictPulse
            </Button>
        </motion.div>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] flex flex-col h-[70vh] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2"><Sparkles className="text-primary"/>Ask DistrictPulse</DialogTitle>
          <DialogDescription>
            Ask a question via voice or text and get an instant AI-powered response.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-6 p-4">
            {messages.map((msg, index) => (
                <motion.div 
                    key={index} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                    {msg.role === 'bot' && <Avatar><AvatarFallback><Bot /></AvatarFallback></Avatar>}
                    <div className={cn("rounded-xl px-4 py-2 max-w-[80%] shadow-md", msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border')}>
                        <p>{msg.text}</p>
                        {msg.role === 'bot' && msg.audio && (
                            <Button variant="ghost" size="icon" className="mt-2 h-7 w-7" onClick={() => playAudio(msg.audio)}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                     {msg.role === 'user' && <Avatar><AvatarFallback><User /></AvatarFallback></Avatar>}
                </motion.div>
            ))}
            {isLoading && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 justify-start"
                >
                    <Avatar><AvatarFallback><Bot /></AvatarFallback></Avatar>
                    <div className="rounded-lg px-4 py-2 bg-card flex items-center shadow-sm">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                    </div>
                </motion.div>
            )}
             <div ref={messagesEndRef} />
            </div>
        </ScrollArea>
        <DialogFooter className="flex-col gap-2">
            <form onSubmit={handleTextSubmit} className="flex w-full gap-2">
                <Input 
                    placeholder="Type your question..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !textInput.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
            <Button onClick={toggleListening} disabled={isLoading} size="lg" className="w-full">
            {isListening ? (
              <div className="flex items-center justify-center w-full">
                <div className="h-2 w-2 mr-2 rounded-full bg-red-500 animate-pulse"></div>
                Listening...
              </div>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Or Use Voice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
