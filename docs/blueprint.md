# **App Name**: DistrictPulse: AI-Powered Civic Intelligence Platform

## Core Features:

- District News Aggregation & Summarization: Collect local news via URLs, summarize into bullet points, and assign credibility scores using Gemini API.
- Voice-First Civic Queries: Enable users to ask civic questions via voice, convert speech to text, generate AI responses, and read answers aloud with text-to-speech. Present text fallback.
- Citizen Report Submission: Allow citizens to report issues via text, voice, or image. Classify issue category with AI. Deduplicate similar reports. Geotag reports.
- Geo-Smart Alerting: Provide location-based notifications (e.g., flood warnings) using Firebase Cloud Messaging.  Filter the alerts according to relevance to the district.
- Trend Identification: Analyze citizen reports and news data from Firestore. Identify recurring issues and generate a summary with AI. Store findings in Firestore.
- Firestore Integration: Centralized data storage, persistence, and real-time updates powered by Firestore.
- Issue classification tool: Use the LLM as a tool to classify user submitted reports and determine their correct category for improved searchability

## Style Guidelines:

- Primary color: Deep sky blue (#4169E1), evokes trust and reliability.
- Background color: Light gray (#D3D3D3), provides a clean, accessible feel, suitable for long reading sessions.
- Accent color: Golden yellow (#FFD700), highlights important information and calls to action.
- Headline font: 'Poppins', a geometric sans-serif, for modern clarity; body font: 'PT Sans', a humanist sans-serif, for readability; use 'Poppins' for headlines and 'PT Sans' for body.
- Note: currently only Google Fonts are supported.
- Use simple, universal icons. Ensure icons are distinct for users with low literacy.
- Prioritize a clean, single-column layout for readability on all devices.
- Use subtle animations to guide users; avoid distracting animations.