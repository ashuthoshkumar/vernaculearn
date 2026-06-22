# VernacuLearn 🎓
### Learn Coding in the Language You Think In

> Tech courses in Telugu, Hindi, Tamil and English — built for Tier 2 & Tier 3 India.

🌐 **Live:** [https://vernaculearn-teal.vercel.app](https://vernaculearn-teal.vercel.app)

---

## 🚀 The Problem

500M+ Indians speak little to no English. Yet 90% of tech education content is English-only. Students in Warangal, Nalgonda, and Karimnagar have the ambition to build tech careers — but are locked out because every major platform teaches in English first.

**Language shouldn't be a barrier to opportunity.**

---

## 💡 The Solution

VernacuLearn is a regional-language-first tech learning platform. Students learn Python, Web Development, Java, C Programming and Data Science in Telugu, Hindi, Tamil or English — whichever language they think in.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗣️ **Regional Language Courses** | Python, Web Dev, Java, C, Data Science in Telugu, Hindi, Tamil & English |
| 🤖 **AI Doubt Solver** | Ask doubts in your language, get instant AI answers |
| 🎤 **Voice Input + Output** | Speak your doubt, hear the AI answer back |
| 📊 **Progress Tracker** | Track lesson completion per course per user |
| 🔥 **Streaks & Badges** | Daily learning streaks and achievement badges |
| 🔍 **Course Search** | Search courses by name, subject or language |
| 👤 **Student Profiles** | Personal dashboard with learning stats |
| 🔐 **Authentication** | Secure email + password login via Supabase |
| 📱 **Mobile Friendly** | Works on low-end Android phones |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Styling
- **React Router** — Navigation
- **Supabase JS** — Auth & DB client

### Backend
- **Node.js** — Runtime
- **Express.js** — API server
- **Supabase** — PostgreSQL database
- **Groq API** — AI doubt solver (LLaMA 3.3)

### Infrastructure
- **Supabase** — Database + Auth (free tier)
- **Vercel** — Frontend hosting (free)
- **Render** — Backend hosting (free)
- **YouTube** — Video hosting (free, unlisted embed)

### Total Monthly Cost: ₹0

---

## 📁 Project Structure

```
vernaculearn/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # 2-step registration
│   │   │   ├── Courses.jsx       # Course listing with search & filter
│   │   │   ├── CoursePage.jsx    # Lesson player + AI doubt solver
│   │   │   └── Profile.jsx       # Student dashboard
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Global navbar with search
│   │   │   └── ProtectedRoute.jsx # Auth guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state
│   │   ├── services/
│   │   │   └── api.js            # All API calls
│   │   └── lib/
│   │       └── supabase.js       # Supabase client
│   └── package.json
│
└── backend/
    ├── src/
    │   └── routes/
    │       ├── courses.js        # GET courses
    │       ├── lessons.js        # GET lessons by course
    │       ├── progress.js       # GET/POST lesson progress
    │       ├── doubt.js          # POST AI doubt solver
    │       └── gamification.js   # GET/POST streaks & badges
    ├── index.js                  # Express server entry
    └── package.json
```

---

## 🗄️ Database Schema

```sql
users       → id, auth_id, full_name, date_of_birth, language, phone_number
courses     → id, title, description, language, thumbnail_url
lessons     → id, course_id, title, youtube_url, order_number, duration_mins
progress    → id, user_id, lesson_id, completed, completed_at
streaks     → id, user_id, current_streak, longest_streak, last_activity_date
badges      → id, user_id, badge_key, badge_name, badge_icon, earned_at
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Supabase account (free)
- Groq API key (free)

### 1. Clone the repo

```bash
git clone https://github.com/ashuthoshkumar/vernaculearn.git
cd vernaculearn
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

Start backend:

```bash
node index.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
```

Start frontend:

```bash
npm run dev
```

### 4. Setup Database

Run the SQL in `backend/schema.sql` in your Supabase SQL Editor.

---

## 📚 Courses Available

| Subject | Telugu | Hindi | Tamil | English |
|---|---|---|---|---|
| Python | ✅ | ✅ | ✅ | ✅ |
| Web Development | ✅ | ✅ | ✅ | ✅ |
| Java | ✅ | ✅ | ✅ | ✅ |
| C Programming | ✅ | ✅ | ✅ | ✅ |
| Data Science | ✅ | ✅ | ✅ | ✅ |

**20 courses · 200 lessons · 4 languages**

---

## 🏆 Gamification

| Badge | Condition |
|---|---|
| 🎯 First Step | Complete your first lesson |
| 🔥 On Fire | Complete 5 lessons |
| 📚 Scholar | Complete 10 lessons |
| 🏆 Course Champion | Complete a full course |

---

## 🗺️ Roadmap

- [ ] Mobile App (React Native)
- [ ] Certificate Generation
- [ ] Community Forums
- [ ] Payment Integration (Razorpay)
- [ ] Offline Support
- [ ] More Languages (Kannada, Malayalam, Marathi)
- [ ] More Subjects (DSA, React, Django)

---

## 👨‍💻 Built By

**Ashuthosh Kumar** — Built VernacuLearn from scratch as a real startup to solve the language barrier in tech education for Bharat.

- 🌐 Live: [vernaculearn-teal.vercel.app](https://vernaculearn-teal.vercel.app)
- 💻 GitHub: [github.com/ashuthoshkumar/vernaculearn](https://github.com/ashuthoshkumar/vernaculearn)

---

## 📄 License

MIT License — free to use, modify and distribute.

---

> *"Quality tech education in India is English-only, leaving 500 million regional-language speakers without a real path to the digital economy. VernacuLearn is changing that."*
