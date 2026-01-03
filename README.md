# DistrictPulse 🏙️📊

DistrictPulse is an AI-powered civic intelligence web application designed to enhance transparency, citizen engagement, and data-driven governance at the district level.  
It aggregates local news, analyzes citizen-reported issues, identifies recurring trends, and enables voice-based civic queries using Google’s Gemini AI.

---

## 🚀 Features

- **AI-Powered News Aggregation**
  - Collects and summarizes district-level news.
  - Highlights key points for quick understanding.

- **Citizen Issue Reporting**
  - Users can submit issues via text or voice.
  - Reports are automatically categorized using AI.
  - Duplicate and recurring issues are identified.

- **Trend & Insight Analysis**
  - Detects frequently reported problems.
  - Provides trend-based insights for better decision-making.

- **Voice-Based Civic Queries**
  - Ask questions using voice input.
  - AI generates accurate responses.
  - Answers are read aloud using Text-to-Speech.

- **User Authentication**
  - Secure login using Firebase Authentication.
  - Supports email/password and anonymous login.

---

## 🧠 AI & Intelligence Layer

DistrictPulse uses **Google Gemini models** via **Genkit** to power all intelligent features:

- **Gemini 2.5 Flash**
  - News summarization
  - Issue classification
  - Trend detection
  - Civic question answering

- **Gemini Text-to-Speech**
  - Converts AI-generated responses into natural voice output

All AI workflows are implemented using Genkit flows for scalability and maintainability.

---

## 🏗️ System Architecture (High Level)

Frontend (Next.js + React)
|
Backend Logic (Node.js + TypeScript)
|
AI Layer (Gemini Models via Genkit)
|
Database (Firebase Firestore)
|
Authentication (Firebase Auth)


---

## 🛠️ Tech Stack

### Google & Firebase
- **Firebase Authentication**
- **Cloud Firestore**
- **Firebase App Hosting**
- **Google Gemini AI**
- **Genkit**

### Frontend
- **Next.js**
- **React**
- **Tailwind CSS**
- **ShadCN UI**

### Backend & Utilities
- **Node.js**
- **TypeScript**
- **Zod (Schema Validation)**

---

## 📂 Project Structure (Simplified)

src/
├── ai/ # Genkit AI flows and configuration
├── app/ # Next.js pages (App Router)
├── components/ # UI and feature components
├── firebase/ # Firebase config & helpers
├── services/ # Data analysis services
├── context/ # Global state providers
└── hooks/ # Custom React hooks


---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Firebase project
- Google AI (Gemini) API access

### Installation

```bash
git clone https://github.com/sanjaykumar-xe/districtpulse.git
cd districtpulse
npm install

Run the app locally:
npm run dev

🔐 Environment Variables

Configure Firebase and AI keys in your environment:

FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
GOOGLE_AI_API_KEY=

🎯 Use Cases

Citizens reporting local infrastructure or civic issues

Authorities monitoring recurring district-level problems

Students demonstrating AI-powered civic-tech solutions

Smart governance and public transparency initiatives

📌 Future Enhancements

Admin dashboard for officials

Role-based access control

Advanced data visualization

Multi-language voice support

Mobile application version

👨‍💻 Author

Sanjay Kumar M
GitHub: sanjaykumar-xe

📄 License

This project is created for educational and prototype purposes.


---

## ✅ Next Step (Recommended)
After pasting this into `README.md`, run:

```bash
git add README.md
git commit -m "Add professional README for DistrictPulse"
git push


