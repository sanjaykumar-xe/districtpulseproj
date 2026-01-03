import { config } from 'dotenv';
config();

import '@/ai/flows/identify-recurring-issues.ts';
import '@/ai/flows/answer-civic-queries-via-voice.ts';
import '@/ai/flows/categorize-citizen-reports.ts';
import '@/ai/flows/summarize-local-news.ts';
import '@/ai/flows/classify-citizen-reports.ts';
import '@/ai/flows/generate-news-feed.ts';
import '@/ai/flows/get-weather-alert.ts';
