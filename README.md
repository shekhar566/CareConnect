<div align="center">
  <br />
    <a href="https://care-connect-shekhar.vercel.app" target="_blank">
      <img src="public/images/CareConnect.jpeg" alt="CareConnect Logo">
    </a>
  <br />

  <h1 align="center">
     <img src="public/images/site-logo.svg" align="top" height="40" style="vertical-align:bottom;" alt="CareConnect Logo">
    CareConnect
  </h1>
 
  <p align="center">
    <strong>A Secure Clinical Consultation & Case Collaboration Platform</strong>
  </p>

  <p align="center">
    <a href="https://care-connect-shekhar.vercel.app">View Live Demo</a>
    ·
    <a href="https://github.com/shekhar566/CareConnect/issues">Report Bug</a>
    ·
    <a href="https://github.com/shekhar566/CareConnect/pulls">Request Feature</a>
  </p>
</div>

<div align="center"> 
  <img src="https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-API-F55036?style=for-the-badge&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
</div>


> **Note:** CareConnect is a pivot from a standard Q&A forum to a specialized medical tool. It introduces domain-specific schemas like **Urgency Levels**, **Patient Demographics**, and **Differential Diagnosis AI**.

---

## 🚀 About The Project

**CareConnect** is designed to bridge the gap between clinical uncertainty and expert consensus. Unlike generic forums, this platform allows medical professionals to share anonymized patient cases, request second opinions, and receive instant AI-assisted differential diagnoses.

### 🌟 Key Features

- **🩺 Clinical Case Management**: Structured case reporting including **Patient Age**, **Gender**, and **Urgency Status** (Low/Medium/Critical).
- **🤖 AI Chief Medical Officer**: An integrated AI agent that analyzes case details and suggests structured **Differential Diagnoses** and recommended next steps.
- **🚨 Visual Urgency System**: Dynamic UI badging (Red/Blue) to highlight critical cases immediately.
- **💼 Clinical Opportunities**: A dedicated job board for Physicians and Locum Tenens roles, powered by JSearch.
- **🔐 Secure Authentication**: Role-based access via Clerk to ensure community integrity.
- **🌍 Global Search**: Find similar cases by Symptoms, ICD-10 tags, or Specialty.
- **💎 Reputation System**: Gamified "Clinical Credibility" scores based on accepted opinions and community upvotes.

---

## 🏗️ System Architecture & Engineering

This platform was built to handle complex relational data and third-party API streams without blocking the main thread or causing UI jank.

- **Strict Data Mutations:** All database writes bypass standard API routes and are handled natively via **Next.js Server Actions**, ensuring secure, server-side execution.
- **Type-Safe Pipelines:** Implemented end-to-end type safety using **Zod schemas**. The client cannot submit, and the server will not process, any payload that fails strict validation.
- **Optimized Search Operations:** Engineered a custom React hook to **debounce search inputs by 300ms**, coupled with URL state management (`useSearchParams`), drastically reducing unnecessary database read queries.
- **AI Streaming UI:** Integrated LLM inference with custom frontend streaming, ensuring zero-latency perceived load times for users while the model generates differential diagnoses.
- Motion Engineering & UX: Leveraged GSAP (GreenSock Animation Platform) to handle complex UI transitions and high-performance image stacks. By utilizing GSAP’s timeline engine instead of standard CSS, I ensured smooth 60fps animations that do not trigger expensive React re-renders.

---

## ⚔️ Engineering Challenges & Solutions

**The Problem: Silent 500 Errors in Production**
During initial load testing, the original OpenAI API integration hit strict rate limits, causing silent 500 errors on the client side when users requested AI diagnoses.

**The Solution: High-Speed Inference Pivot**
Instead of just adding error toasts, I isolated the bottleneck, completely ripped out the OpenAI SDK, and hot-swapped the architecture to use the **Groq API** for hyper-fast inference. I updated the Server Actions, adjusted the streaming response handlers, and deployed the hotfix in under an hour, resulting in a 10x faster response time and zero rate-limit drops.

---

## 🛠️ Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS + ShadCN UI |
| **Database** | MongoDB + Mongoose |
| **Authentication** | Clerk (Social + Email) |
| Motion/Animations | GSAP (GreenSock) + Framer Motion |
| Styling | TailwindCSS + ShadCN UI |
| **AI Integration** | Groq API / Custom Streaming UI |
| **External APIs** | JSearch (RapidAPI) |

---

## ⚡ Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18+)
- npm or pnpm

### Installation

1. **Clone the repository**
 
   ```bash
   git clone [https://github.com/shekhar566/CareConnect.git](https://github.com/shekhar566/CareConnect.git)
   cd CareConnect

   Install dependencies

2. **Install dependencies**
   
   ```bash
   npm install
3. **Set up environment variables
   Create a .env.local file in the root directory and add your keys**:
   
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   MONGODB_URL=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_RAPID_API_KEY=your_rapidapi_key
   
4. **Run the development server**
   
   ```bash
   npm run dev

  **Open http://localhost:3000 to view it in the browser**

