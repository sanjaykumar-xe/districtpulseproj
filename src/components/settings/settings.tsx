'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useAppState } from '@/context/app-state-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Languages, Palette, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/use-translation';

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useAppState();
  const { t } = useTranslation();
  const { toast } = useToast();

  const [localLanguage, setLocalLanguage] = useState(language);
  const [localTheme, setLocalTheme] = useState(theme);

  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'];

  const handleSave = () => {
    setLanguage(localLanguage);
    setTheme(localTheme ?? 'system');
    toast({
      title: t('preferencesSaved'),
      description: t('preferencesSavedDescription'),
    });
  };

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <Card className="shadow-lg rounded-2xl">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{t('settings')}</CardTitle>
                <CardDescription>
                {t('managePreferences')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="space-y-4">
                    <h3 className="font-semibold font-headline flex items-center"><Languages className="mr-2 h-5 w-5 text-primary"/> {t('language')}</h3>
                    <RadioGroup
                        value={localLanguage}
                        onValueChange={setLocalLanguage}
                        className="grid grid-cols-2 gap-4 md:grid-cols-3"
                    >
                        {languages.map((lang) => (
                             <div key={lang}>
                                <RadioGroupItem value={lang} id={lang.toLowerCase()} className="peer sr-only" />
                                <Label
                                    htmlFor={lang.toLowerCase()}
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                    {lang}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                <div className="space-y-4">
                    <h3 className="font-semibold font-headline flex items-center"><Palette className="mr-2 h-5 w-5 text-primary"/> {t('theme')}</h3>
                    <RadioGroup
                        value={localTheme}
                        onValueChange={setLocalTheme}
                        className="grid grid-cols-3 gap-4"
                    >
                        <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label
                            htmlFor="light"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            {t('light')}
                        </Label>
                        </div>
                        <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label
                            htmlFor="dark"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            {t('dark')}
                        </Label>
                        </div>
                        <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label
                            htmlFor="system"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                            {t('system')}
                        </Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleSave} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    {t('savePreferences')}
                </Button>
            </CardFooter>
        </Card>
    </motion.div>
  );
}
