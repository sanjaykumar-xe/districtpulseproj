'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from './header';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Landmark, Newspaper, Megaphone, AlertTriangle, BarChart3, Settings, Home, User as UserIcon, LogIn, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileHeaderOptions } from './mobile-header-options';
import { Separator } from '../ui/separator';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { useUser } from '@/firebase';
import { useEffect } from 'react';

const menuItems = [
    { href: '/', labelKey: 'home', icon: Home, tooltipKey: 'home' },
    { href: '/news', labelKey: 'liveNewsFeed', icon: Newspaper, tooltipKey: 'liveNewsFeed' },
    { href: '/alerts', labelKey: 'alerts', icon: AlertTriangle, tooltipKey: 'alerts' },
    { href: '/reports', labelKey: 'citizenReport', icon: Megaphone, tooltipKey: 'citizenReport' },
    { href: '/trends', labelKey: 'trendAnalysis', icon: BarChart3, tooltipKey: 'trendAnalysis' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isMobileView = useIsMobile();
  const { t } = useTranslation();
  const { user, isUserLoading } = useUser();
  const router = useRouter();


  useEffect(() => {
    if (!isUserLoading && !user) {
      if (pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading || (!user && pathname !== '/login' && pathname !== '/signup')) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <>{children}</>
  }


  const handleLinkClick = () => {
    if (isMobileView) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={handleLinkClick}>
                 <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex items-center gap-2"
                  >
                    <Landmark className={cn("text-primary", state === 'collapsed' ? 'size-7' : 'size-8')}/>
                    <AnimatePresence>
                    {state === 'expanded' && (
                        <motion.h1
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn("text-xl font-bold font-headline")}
                        >
                            DistrictPulse
                        </motion.h1>
                    )}
                    </AnimatePresence>
                </motion.div>
            </Link>
            <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          {isMobile && (
            <>
              <div className="p-2">
                <MobileHeaderOptions />
              </div>
              <Separator className="my-2" />
            </>
          )}
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
              >
              <SidebarMenuItem>
                <Link href={item.href} passHref onClick={handleLinkClick}>
                  <SidebarMenuButton
                    asChild
                    tooltip={t(item.tooltipKey)}
                    isActive={pathname === item.href}
                  >
                    <motion.div 
                      className="flex items-center gap-3"
                      whileHover={{ x: state === 'expanded' ? 3 : 0 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <item.icon />
                      <span className="group-data-[state=collapsed]:hidden">{t(item.labelKey)}</span>
                    </motion.div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              </motion.div>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
               <SidebarMenuItem>
                <Link href={user ? "/profile" : "/login"} passHref onClick={handleLinkClick}>
                  <SidebarMenuButton
                    asChild
                    tooltip={user ? 'Profile' : 'Login'}
                    isActive={pathname === '/profile' || pathname === '/login'}
                  >
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: state === 'expanded' ? 3 : 0 }}
                        whileTap={{ scale: 0.95 }}
                      >
                      {user ? <UserIcon /> : <LogIn />}
                      <span className="group-data-[state=collapsed]:hidden">{user ? 'Profile' : 'Login'}</span>
                    </motion.div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/settings" passHref onClick={handleLinkClick}>
                  <SidebarMenuButton
                    asChild
                    tooltip={t('settings')}
                    isActive={pathname === '/settings'}
                  >
                    <motion.div 
                        className="flex items-center gap-3"
                        whileHover={{ x: state === 'expanded' ? 3 : 0 }}
                        whileTap={{ scale: 0.95 }}
                      >
                      <Settings/>
                      <span className="group-data-[state=collapsed]:hidden">{t('settings')}</span>
                    </motion.div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </SidebarInset>
    </>
  );
}
