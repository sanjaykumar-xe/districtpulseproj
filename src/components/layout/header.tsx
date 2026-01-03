'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VoiceQuery } from '../voice/voice-query';
import { useAppState } from '@/context/app-state-provider';
import { states, districtsByState } from '@/lib/india-data';
import { SidebarTrigger } from '../ui/sidebar';
import { ThemeToggle } from '../ui/theme-toggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserButton } from '../auth/user-button';

export function Header() {
  const { 
    selectedState, 
    setSelectedState, 
    selectedDistrict, 
    setSelectedDistrict,
  } = useAppState();
  const isMobile = useIsMobile();
  
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const firstDistrict = districtsByState[state]?.[0];
    if(firstDistrict) {
      setSelectedDistrict(firstDistrict);
    } else {
      setSelectedDistrict('');
    }
  }
  
  const districts = districtsByState[selectedState] || [];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
       <div className="flex items-center gap-3">
        {isMobile && <SidebarTrigger />}
      </div>
      <div className="flex-1">
        {isMobile && (
             <Link href="/" className="flex items-center gap-2">
                <Landmark className={cn("text-primary size-7")}/>
                <h1 className={cn("text-xl font-bold font-headline" )}>DistrictPulse</h1>
            </Link>
        )}
      </div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center gap-2 md:gap-4"
      >
        {isMobile ? (
          <>
            <VoiceQuery />
            <ThemeToggle />
            <UserButton />
          </>
        ) : (
          <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="w-[150px] md:w-[200px]">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={!districts.length}>
              <SelectTrigger className="w-[150px] md:w-[200px]">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
            >
              <VoiceQuery />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
            <UserButton />
          </>
        )}
      </motion.div>
    </header>
  );
}
