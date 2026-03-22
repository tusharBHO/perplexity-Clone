# 🤖 Curiosity – AI-Powered Search Assistant

🔗 Live Demo: https://curiosityoftb.vercel.app  

---

## 🚀 Overview

Curiosity is a full-stack AI-powered search assistant inspired by platforms like Perplexity and ChatGPT.  
It delivers **real-time, context-aware answers with citations**, making information retrieval more reliable and transparent.

Built with a focus on **scalability, performance, and clean user experience**, the platform integrates multiple LLM APIs and handles complex workflows using background job orchestration.

---

## ✨ Features

- 🔍 Ask questions with a clean, intuitive UI  
- 🤖 Real-time AI responses using multiple LLM APIs  
- 🔄 Background job handling using Inngest  
- 🔐 Secure authentication with Clerk  
- ⚡ Fast, responsive UI with modern design  

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)  
- React.js  
- Tailwind CSS  
- shadcn/ui  

**Backend**
- Node.js  
- RESTful APIs  

**AI & Workflow**
- LLM APIs (Gemini, OpenAI)  
- Inngest (background job orchestration)  

**Auth & Deployment**
- Clerk (Authentication)  
- Vercel (Deployment)  

---

## 🧠 How It Works

1. User submits a query  
2. Request is processed and sent to backend  
3. Inngest manages background workflows:
   - Query processing  
   - LLM API calls  
   - Response generation  
4. System returns:
   - AI-generated answer  
   - Supporting citations  

---

## 📸 Screenshots

<!-- Add your screenshots here -->
![Home](./screenshots/home.png)
![Response](./screenshots/response.png)

---

## ⚙️ Setup & Installation

```bash
git clone https://github.com/tusharBHO/ai-platform.git
cd ai-platform
npm install
npm run dev
npx inngest-cli@latest dev
