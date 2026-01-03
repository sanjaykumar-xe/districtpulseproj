'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Newspaper, AlertTriangle, Megaphone, BarChart3, ArrowRight, Loader2 } from 'lucide-react';
import { useAppState } from '@/context/app-state-provider';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { AppShell } from '@/components/layout/app-shell';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ThemeProvider } from '@/context/theme-provider';
import { useUser } from '@/firebase';
import { LandingPage } from '@/components/landing/landing-page';

const featureCards = [
  {
    href: '/news',
    key: 'liveNewsFeed',
    descriptionKey: 'liveNewsFeedDescription',
    icon: Newspaper,
    color: 'text-blue-500',
  },
  {
    href: '/alerts',
    key: 'alertsAndAdvisories',
    descriptionKey: 'alertsAndAdvisoriesDescription',
    icon: AlertTriangle,
    color: 'text-red-500',
  },
  {
    href: '/reports',
    key: 'citizenReport',
    descriptionKey: 'citizenReportDescription',
    icon: Megaphone,
    color: 'text-yellow-500',
  },
  {
    href: '/trends',
    key: 'trendAnalysis',
    descriptionKey: 'trendAnalysisDescription',
    icon: BarChart3,
    color: 'text-green-500',
  },
];

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
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

function AppDashboard() {
  const { selectedDistrict } = useAppState();
  const { t } = useTranslation();

  return (
    <AppShell>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">{t('welcomeToDistrictPulse')}</CardTitle>
              <CardDescription className="text-lg">
                {t('welcomeDescription')} {selectedDistrict || t('yourDistrict')}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {t('welcomeSubtext')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {featureCards.map((feature) => (
            <motion.div key={feature.href} variants={itemVariants}>
              <Card className="h-full flex flex-col group overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex-row items-center gap-4 space-y-0">
                  <feature.icon className={`h-10 w-10 shrink-0 ${feature.color}`} />
                  <div className="space-y-1">
                      <CardTitle className="font-headline text-xl">{t(feature.key)}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground flex-1">{t(feature.descriptionKey)}</p>
                   <Button asChild className="mt-4 w-full">
                    <Link href={feature.href}>
                      {t('goTo')} {t(feature.key)}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </AppShell>
  );
}


export default function Home() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {user ? (
        <SidebarProvider>
          <AppDashboard />
        </SidebarProvider>
      ) : (
        <LandingPage />
      )}
    </ThemeProvider>
  );
}
