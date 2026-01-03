'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ZapOff, ShieldAlert, Sun, CloudRain, Cloud, Snowflake, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { useAppState } from '@/context/app-state-provider';
import { getWeatherAlert, type WeatherAlert } from '@/ai/flows/get-weather-alert';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut',
    },
  }),
};

const WeatherIcon = ({ condition, className }: { condition: string, className?: string }) => {
    switch (condition.toLowerCase()) {
        case 'sunny': return <Sun className={className} />;
        case 'rainy': return <CloudRain className={className} />;
        case 'cloudy': return <Cloud className={className} />;
        case 'snowy': return <Snowflake className={className} />;
        case 'windy': return <Wind className={className} />;
        case 'thunderstorm': return <CloudRain className={className} />;
        default: return <Thermometer className={className} />;
    }
};

export function Alerts() {
  const { selectedDistrict } = useAppState();
  const [weatherAlert, setWeatherAlert] = useState<WeatherAlert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchWeather = async () => {
    if (!selectedDistrict) return;
    setIsLoading(true);
    try {
      const alert = await getWeatherAlert({ district: selectedDistrict });
      setWeatherAlert(alert);
    } catch(e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Weather Error',
        description: 'Could not fetch weather information.'
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedDistrict]);

  const severityGlow: { [key: string]: string } = {
    Weather: 'shadow-blue-500/50',
    'Weather Alert': 'shadow-red-500/50',
    'Power Outage': 'shadow-yellow-500/50',
    'Health Advisory': 'shadow-green-500/50',
  };
  
  const staticAlerts = [
      {
          title: "Power Outage",
          icon: ZapOff,
          severity: "Medium",
          value: "Medium",
          description: "Sector 5, 10 AM - 2 PM tomorrow"
      },
      {
          title: "Health Advisory",
          icon: ShieldAlert,
          severity: "Low",
          value: "Low",
          description: "Free vaccination camp on Sunday"
      }
  ];

  if (!isClient || isLoading) {
      return (
          <>
            {[...Array(4)].map((_, i) => (
                <Card key={i} className="rounded-2xl">
                    <CardHeader>
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-6 w-1/2 bg-muted rounded-md animate-pulse mt-2"/>
                        <div className="h-4 w-3/4 bg-muted rounded-md animate-pulse mt-1"/>
                    </CardContent>
                </Card>
            ))}
          </>
      );
  }
  
  if (!weatherAlert) {
       return (
          <Card className="rounded-2xl col-span-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weather Alert</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Could not load weather information. Please select a district.
                </div>
              </CardContent>
          </Card>
      );
  }

  const allAlerts = [
      {
          title: "Weather",
          icon: WeatherIcon,
          iconProp: weatherAlert.condition,
          severity: weatherAlert.severity,
          value: `${weatherAlert.temperature}°C`,
          description: `${weatherAlert.condition} (${weatherAlert.humidity}% humidity)`
      },
      {
          title: "Weather Alert",
          icon: AlertTriangle,
          iconProp: weatherAlert.severity,
          severity: weatherAlert.severity,
          value: `${weatherAlert.severity} Severity`,
          description: weatherAlert.alert
      },
      ...staticAlerts
  ]

  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-destructive';
      case 'Medium': return 'text-warning-foreground';
      case 'Low': return 'text-success';
      default: return '';
    }
  }

  return (
    <>
      <AnimatePresence>
        {allAlerts.map((alert, i) => (
          <motion.div
            key={alert.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            className="h-full"
          >
            <Card className={cn(
                "rounded-2xl h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl", 
                `shadow-lg ${severityGlow[alert.title]}`
            )}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{alert.title}</CardTitle>
                  <alert.icon condition={alert.iconProp} severity={alert.severity} className={cn("h-5 w-5 text-muted-foreground", getSeverityClasses(alert.severity))} />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{alert.value}</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
