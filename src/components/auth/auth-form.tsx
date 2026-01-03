'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/firebase';
import {
  initiateEmailSignUp,
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';
import { Loader2, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

interface AuthFormProps {
  view: 'login' | 'signup';
}

export function AuthForm({ view }: AuthFormProps) {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleAuthAction = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      if (view === 'signup') {
        await initiateEmailSignUp(auth, values.email, values.password);
      } else {
        await initiateEmailSignIn(auth, values.email, values.password);
      }
      // Redirection is handled by the page.
    } catch (e: any) {
      let friendlyMessage = 'An unexpected error occurred. Please try again.';
      if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        friendlyMessage = 'Invalid email or password. Please check your credentials.';
      } else if (e.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email address is already in use.';
      }
      setError(friendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = view === 'login';

  return (
    <Card className="bg-card/60 backdrop-blur-xl border-white/20 shadow-2xl shadow-black/10">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
        <CardDescription>
          {isLogin ? 'Access your DistrictPulse account.' : 'Join to stay informed about your community.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAuthAction)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                   <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    {isLogin && (
                      <Link href="#" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        {...field}
                      />
                    </FormControl>
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                      </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive text-center">
                {error}
              </p>
            )}
            <Button type="submit" disabled={isLoading} className="w-full shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/50 hover:-translate-y-0.5">
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-4">
        <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link href={isLogin ? "/signup" : "/login"} className="font-semibold text-primary hover:underline">
              {isLogin ? 'Sign up' : 'Login'}
            </Link>
        </p>
        <Button variant="link" asChild className="text-muted-foreground">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Go back to landing page</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
