# Job Matcher - AI Resume Tailor

Job Matcher is an AI-powered tool that analyzes a job description and your PDF resume, then generates keyword-optimized bullet points tailored specifically for that role using the Gemini API.

## Features
- **PDF Resume Upload:** Directly upload your current PDF resume.
- **Job Description Parsing:** Paste any job link or description text.
- **AI Keyword Optimization:** Utilizes Google Gemini 1.5 Flash to rewrite bullet points.
- **Mobile-First Premium UI:** Built with Next.js App Router and CSS Modules.

## Getting Started Locally

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root of your project and add your Gemini API Key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(You can get a free key from Google AI Studio).*

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

### 4. Run Tests (TDD)
```bash
npm test
```

## Deployment to Railway & GitHub

To deploy this project to Railway, follow these steps:

### Step 1: Push to your GitHub
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Initial commit: Job Matcher AI Resume Tailor"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```
*(Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub details).*

### Step 2: Deploy on Railway
1. Go to [Railway.app](https://railway.app/) and log in with your GitHub account.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your newly created `Job Matcher` repository.
4. **Important:** Add the `GEMINI_API_KEY` in the Railway Variables section for the project so the AI works in production.
5. Railway will automatically detect it's a Next.js app, build it, and provide you with a live production URL!

## Firebase Config
The Firebase client config has been created in `src/lib/firebase/config.ts`. If you decide to add database storage later, simply replace the placeholder config in that file with your actual Firebase project settings.
