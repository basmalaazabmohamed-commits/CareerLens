# CareerLens — AI-Powered Career Intelligence

**See Beyond Your CV.**

CareerLens is a complete, end-to-end Retrieval-Augmented Generation (RAG) platform that connects candidate profiles with real-world job opportunities. It combines intelligent job retrieval, candidate skill extraction, job requirement analysis, evidence-based skill gap assessment, and an interactive AI career assistant with a modern, responsive web application.

> **Status:** ✅ **Full-Stack Application Complete.** Backend, AI/RAG engine, and modern React frontend are fully integrated and functional.

---

## 🎬 Demo Video & Platform Preview

Explore the full application demo and walkthrough:

- **Repository:** [https://github.com/basmalaazabmohamed-commits/CareerLens](https://github.com/basmalaazabmohamed-commits/CareerLens)
- **Demo Video:** [Watch Platform Walkthrough & Demonstration Video](https://drive.google.com/file/d/13ZD6AGK0WK-53tNBTGMQnI833CLe9P5B/view?usp=sharing) 

---

## 🎯 Project Objective

Traditional job searches often rely on keyword matching, and CV evaluations can overlook valuable candidate experience described with different phrasing.

CareerLens bridges this gap by providing an evidence-grounded AI pipeline that:
- Analyzes candidate CVs deeply to extract structured skills and real project experience.
- Matches candidates against real multi-ATS job listings using advanced hybrid retrieval.
- Computes exact skill coverage and identifies matched vs. missing skills with supporting evidence.
- Offers personalized career guidance and interactive CV/Job Q&A through an AI chatbot.

---

## ✨ Features & Implemented Components

### 1. 📄 Candidate CV Analysis & Profile Generation
- **CV Parsing & Extraction:** Upload candidate CVs (PDF or plain text) and extract structured skills, experiences, and projects using LLM-assisted extraction.
- **Skill Normalization:** Map varied skill representations into canonical forms to ensure accurate, fair matching.
- **Candidate Profile Page:** A dedicated visual profile dashboard displaying extracted technical skills, soft skills, projects, and CV details.

### 2. 🔍 Hybrid Information Retrieval & Job Discovery
CareerLens utilizes a multi-stage hybrid retrieval architecture:
- **Semantic Search:** Dense vector search using Sentence Transformers and FAISS index.
- **BM25 Search:** Lexical keyword matching to capture precise terminology and domain keywords.
- **Reciprocal Rank Fusion (RRF):** Merges dense and sparse rankings to produce robust result sets.
- **Cross-Encoder Reranking:** Re-scores top candidates to maximize contextual relevance.

### 3. 🎯 Evidence-Based Skill Gap Analysis & Recommendations
- **Job Requirement Extraction:** Extracts core technical requirements and soft skills from target job descriptions.
- **Gap Calculation:** Categorizes skills into **Matched Skills** and **Missing Skills**, computing exact **Coverage Percentages**.
- **Evidence Grounding:** Provides concrete snippets from the candidate's CV as proof for matched competencies.
- **Targeted Recommendations:** Recommends actionable upskilling steps to bridge identified skill gaps.

### 4. 💬 Interactive AI Career Assistant (Chatbot)
- Multi-turn conversational interface powered by Google Gemini.
- Grounded context: Can answer questions about the candidate's CV, offer interview preparation, discuss specific job postings in the dataset, or provide general industry advice.
- Suggested prompt pills and dynamic conversation history.

### 5. 🛠️ Job Description Analyzer & Explorer
- Dedicated tool to paste any custom job description and run instant requirement extraction and skill-gap matching against the uploaded candidate profile.
- Job cards with match score badges, skill breakdowns, and quick action buttons.

### 6. 🌐 Unified Frontend & Backend Architecture
- **Modern Web UI:** Built with React 18, TypeScript, and modern responsive CSS with glassmorphism, animations, and custom illustrations.
- **FastAPI Backend:** Modular REST API endpoints for CV upload, job search, skill gap analysis, and streaming chat.
- **Single-Command Launch:** Backend serves both the API and the pre-built frontend SPA simultaneously.

---

## 🏗️ Architecture

```text
       Candidate CV (PDF/Text)                   Job Postings Dataset
                 │                                        │
                 ▼                                        ▼
   Extraction & Normalization                 Ingestion, Cleaning & Chunking
                 │                                        │
                 ▼                                        ▼
      Structured Profile                Embeddings (FAISS) & BM25 Index
                 │                                        │
                 │                      ┌─────────────────┴─────────────────┐
                 │                      ▼                                   ▼
                 │               Semantic Search                       BM25 Search
                 │                      └─────────────────┬─────────────────┘
                 │                                        ▼
                 │                             Reciprocal Rank Fusion (RRF)
                 │                                        ▼
                 │                                    Reranking
                 │                                        │
                 ├────────────────────────────────────────┤
                 │                                        ▼
                 ▼                                Top Matching Jobs
    Requirement & Skill Gap Analysis                      │
                 │                                        │
                 ▼                                        ▼
      Matched / Missing Skills                Interactive Recommendations
                 │                                        │
                 └──────────────────┬─────────────────────┘
                                    ▼
                 Unified Web Application (React UI + FastAPI)
                                    │
                                    ▼
                AI Career Assistant & Profile Dashboard
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 18, TypeScript, Vite, Modern Vanilla CSS, Lucide Icons |
| **Backend API** | FastAPI, Pydantic, Uvicorn, Python 3.11 |
| **LLM & Extraction** | Google Gemini API (`gemini-2.5-flash`), Pydantic Schemas, Local Cache |
| **Vector & Lexical Search** | FAISS CPU, Sentence Transformers, Rank-BM25 |
| **Data Processing** | Pandas, NumPy, PyArrow |
| **Testing** | Pytest |

---

## 📁 Project Structure

```text
CareerLens/
├── api/                               # FastAPI Application
│   ├── routes/
│   │   ├── chat.py                    # Career chat endpoints
│   │   ├── cv.py                      # CV upload, parsing & skill-gap endpoints
│   │   └── jobs.py                    # Job retrieval & search endpoints
│   ├── main.py                        # App entry point & static SPA mount
│   └── models.py                      # Pydantic request/response schemas
├── candidate_profile/                 # Candidate & CV Analysis Pipeline
│   ├── candidate_profile.py           # Profile dataclasses & structures
│   ├── gemini_client.py               # Gemini client wrapper & cache
│   ├── job_requirements_extractor.py  # Structured job requirements parser
│   ├── pipeline.py                    # End-to-end CV-to-job analysis
│   ├── skill_extraction.py            # Skill identification logic
│   ├── skill_gap.py                   # Evidence-grounded gap analysis
│   └── skill_normalization.py         # Skill alias canonicalization
├── frontend/                          # React + TypeScript + Vite Web App
│   ├── public/                        # Static assets & icons
│   ├── src/
│   │   ├── api/                       # API client connecting to backend
│   │   ├── components/                # Reusable UI components & illustrations
│   │   ├── context/                   # Global application state (CV, jobs, chat)
│   │   ├── pages/                     # Application pages (Analyze, Profile, Chat, etc.)
│   │   ├── App.tsx                    # Main navigation shell
│   │   └── index.css                  # Modern design system & styling
│   ├── package.json
│   └── vite.config.ts
├── config/                            # Project paths & environment settings
├── embeddings/                        # Embedding generation utilities
├── evaluation/                        # Evaluation metrics for RAG retrieval
├── ingestion/                         # Job dataset cleaning & chunking
├── retrieval/                         # Hybrid retriever (BM25 + FAISS + RRF)
├── run_backend.py                     # Single-command unified application runner
├── start_careerlens.bat               # Windows one-click batch launcher
├── start_careerlens.ps1               # Windows PowerShell launcher
├── requirements.txt                   # Python dependencies
└── README.md
```

> **Note on Data and Artifacts:**  
> Large raw job datasets, generated embeddings, FAISS vector indexes, and processed caches are excluded from Git version control via `.gitignore` to keep the repository lightweight.

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.11+**
- **Git**
- **Google Gemini API Key** ([Get one from Google AI Studio](https://aistudio.google.com/))
- *(Optional for frontend development)*: **Node.js 18+** & **npm**

---

### 1. Clone the Repository

```bash
git clone https://github.com/basmalaazabmohamed-commits/CareerLens.git
cd CareerLens
```

### 2. Create and Activate Virtual Environment

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

---

### 5. Run the System

#### **Option A: Unified Full-Stack Launch (Recommended)**

Run the all-in-one runner which serves the backend API and the interactive web interface together, and automatically opens your browser:

```powershell
.\.venv\Scripts\python.exe run_backend.py
```

Or simply double-click **`start_careerlens.bat`** (or execute `.\start_careerlens.ps1`).

Access the application at:
- **Web Application:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive API Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **API Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

#### **Option B: Developer Mode (Separate Frontend & Backend)**

If you wish to modify the frontend with hot-module replacement (Vite):

1. **Start the FastAPI Backend:**
   ```powershell
   uvicorn api.main:app --reload --port 8000
   ```

2. **Start the Frontend Dev Server:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
   Open the dev server at [http://localhost:5173](http://localhost:5173).

---

### 6. Run Automated Tests

Execute the test suite to verify retrieval, candidate extraction, and API routing:

```bash
python -m pytest tests -v
```

---

## 🗺️ Roadmap & Completed Milestones

- [x] Job data ingestion, cleaning, and semantic chunking
- [x] Semantic (FAISS) & BM25 hybrid retrieval
- [x] Reciprocal Rank Fusion (RRF) & Cross-Encoder reranking
- [x] Candidate CV skill extraction and normalization pipeline
- [x] Job requirement extraction and evidence-grounded skill gap analysis
- [x] Modular FastAPI backend with CV, job, and chat endpoints
- [x] Full-featured React + TypeScript frontend with custom styling and animations
- [x] Interactive Candidate Profile dashboard with technical/soft skills visualization
- [x] Multi-turn conversational AI Career Assistant grounded in candidate CV & jobs
- [x] One-click unified application runner (`run_backend.py` / `start_careerlens.bat`)
- [x] Comprehensive automated test coverage

---

## 👩‍💻 Author

**Basmala Azab Mohamed**  
AI Engineering & Data Science  
- GitHub: [@basmalaazabmohamed-commits](https://github.com/basmalaazabmohamed-commits)
- Project Repository: [CareerLens on GitHub](https://github.com/basmalaazabmohamed-commits/CareerLens)
