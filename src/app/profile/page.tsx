'use client';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/context/theme-provider';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  // This check is still useful for direct URL access to this page
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // The loading state will be handled by the AppShell now.
  if (isUserLoading || !user) {
    return null; 
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return <UserIcon className="h-5 w-5" />;
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppShell>
          <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <Card className="w-full max-w-md">
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback className="text-4xl">{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl">{user.displayName || 'Welcome!'}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleLogout} className="w-full" variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </main>
        </AppShell>
      </SidebarProvider>
    </ThemeProvider>
  );
}
