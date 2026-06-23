# StudyGie AI | Career Advisor

StudyGie AI is an advanced, AI-powered career discovery and roadmap tool designed to help students architect their professional future. Using Gemini 1.5 and 2.5 models via Genkit, it analyzes user profiles to generate high-fit career suggestions, identifies skill gaps, and provides a structured 6-month learning roadmap.

## 🚀 Features

- **AI Career Profiler**: Analyzes your education, skills, and interests to suggest ideal career paths.
- **Voice-to-Profile**: Use voice input to describe your skills and interests (Speech-to-Text).
- **Comprehensive Reports**:
  - **Career Match Score**: A percentage-based assessment of profile alignment.
  - **Skill Gap Analysis**: Visualized comparison of current vs. required skills.
  - **Learning Roadmap**: A month-by-month activity plan for the next half-year.
  - **Resume Optimization**: Actionable tips for improving your professional documents.
- **Audible Summaries**: Listen to your career analysis summary using AI-generated Text-to-Speech (TTS).
- **Report Vault**: Locally persisted history of all generated career reports.
- **Professional Export**: Download your career report as a structured text document.
- **Demo Experience**: A simulated login flow for prototyping and demo purposes.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Genkit](https://firebase.google.com/docs/genkit) with Google Gemini Models
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Local Storage (Demo Mode)
- **Animations**: [Tailwind Animate](https://github.com/jamiebuilds/tailwind-animate) & Framer-like CSS glassmorphism

## 📁 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/ai`: Genkit flows for report generation, TTS, and transcription.
- `src/components`: Reusable UI components (Dashboard, Report Display, etc.).
- `src/lib`: Utility functions, storage logic, and placeholder data.
- `src/firebase`: Firebase configuration and client providers.

## 🚦 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- A `.env` file with `GOOGLE_GENAI_API_KEY` or `GEMINI_API_KEY`.

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🧪 Demo Mode
The application currently operates in **Demo Mode**. 
- **Login**: You can sign in using any email and password on the `/login` page to access the Dashboard. 
- **Storage**: All career reports and user sessions are stored in your browser's `localStorage`. No actual backend authentication is required for this demo.

## 📄 License
Designed for the Vibe Coding Challenge 2026.
