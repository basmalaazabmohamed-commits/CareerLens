# CareerLens — AI-Powered Career Intelligence

**See Beyond Your CV.**

CareerLens is a Retrieval-Augmented Generation (RAG) project designed to connect candidate profiles with real-world job opportunities. It combines job retrieval, candidate skill extraction, job requirement analysis, and evidence-based skill gap assessment to help candidates better understand their alignment with a target role.

> **Current Status:** Backend and core AI/RAG components are under development. The frontend has not been implemented yet.

## 🎯 Project Objective

Traditional job searching often relies on keyword matching, while CV evaluation can overlook relevant experience described in different words.

CareerLens aims to bridge this gap by building a modular pipeline that retrieves relevant job information, analyzes candidate evidence, identifies matching and missing skills, and supports more informed career decisions.

## ✨ Implemented Components

### 1. Job Data Ingestion and Processing
- Load and process a multi-ATS job postings dataset.
- Clean job records and prepare structured data for downstream processing.
- Split job descriptions into smaller chunks suitable for retrieval.
- Prepare processed job data and metadata for indexing.

### 2. Hybrid Information Retrieval
CareerLens combines complementary retrieval methods:

- **Semantic Search:** Retrieves job-related content based on semantic similarity.
- **BM25 Retrieval:** Finds relevant content using lexical term matching.
- **Reciprocal Rank Fusion (RRF):** Combines ranked results from multiple retrievers.
- **Reranking:** Provides a separate stage for refining candidate retrieval results.

This architecture is intended to improve retrieval relevance compared with relying on a single retrieval method.

### 3. Candidate Profile and CV Analysis
- Represent candidate skills, projects, and supporting evidence in a structured profile.
- Extract and normalize skill information.
- Associate candidate evidence with relevant skills and projects.
- Support candidate-to-job comparison.

### 4. Job Requirement Extraction
- Extract structured requirements from a job description.
- Identify required skills for a target role.
- Normalize skill names to support more consistent comparisons with candidate profiles.

### 5. Skill Gap Analysis
The skill gap pipeline compares extracted job requirements with candidate profile evidence and classifies requirements into matching and missing skills.

The analysis includes:
- Required skill count.
- Matched required skill count.
- Required skill coverage.
- Evidence associated with detected matches.
- Skills that were not found in the candidate profile.

**Important:** A skill not found in the available CV evidence is not necessarily a skill the candidate does not possess. Extraction quality, terminology differences, and incomplete evidence can affect matching results.

### 6. LLM-Assisted Structured Extraction
CareerLens integrates the Google Gemini API for structured extraction tasks. Pydantic schemas are used to validate structured model outputs, and a local cache helps reuse successful results for identical requests.

### 7. FastAPI Backend
The project includes a modular FastAPI backend with API routes for chat and related career-assistant functionality.

The API exposes a health-check endpoint and is designed to connect the retrieval and candidate-analysis components.

### 8. Testing and Evaluation
The repository includes automated tests for core components, alongside evaluation utilities for retrieval and candidate-evidence analysis.

Run the tests locally with:

```bash
python -m pytest tests -v
```

## 🏗️ Architecture

```text
Job Postings Dataset
        |
        v
Ingestion & Cleaning
        |
        v
Job Chunking
        |
        v
Embeddings / Vector Index
        |
        +-----------------------+
        |                       |
        v                       v
   Semantic Search          BM25 Search
        |                       |
        +-----------+-----------+
                    |
                    v
        Reciprocal Rank Fusion
                    |
                    v
             Reranking
                    |
                    v
             Job Retrieval


Candidate CV / Profile
        |
        v
Skill Extraction & Normalization
        |
        +---------------------------+
                                    |
Job Description                    |
        |                           |
        v                           |
Requirement Extraction              |
        |                           |
        +-------------+-------------+
                      |
                      v
                Skill Gap Analysis
                      |
                      v
        Matched Skills / Missing Skills
        / Coverage / Supporting Evidence
```

The FastAPI layer exposes backend functionality. The frontend and end-user interface are planned future work.

## 🛠️ Technology Stack

- **Language:** Python
- **API:** FastAPI, Pydantic, Uvicorn
- **Data Processing:** Pandas, NumPy, PyArrow
- **Retrieval:** BM25, semantic search, Reciprocal Rank Fusion
- **Embeddings and Vector Search:** Sentence Transformers, FAISS
- **LLM Integration:** Google Gemini API
- **Configuration:** Environment variables and `python-dotenv`
- **Testing:** Pytest

## 📁 Project Structure

```text
CareerLens/
├── api/
│   ├── routes/
│   │   ├── chat.py
│   │   ├── cv.py
│   │   └── jobs.py
│   ├── main.py
│   └── models.py
├── candidate_profile/
│   ├── candidate_profile.py
│   ├── gemini_client.py
│   ├── job_requirements_extractor.py
│   ├── pipeline.py
│   ├── skill_extraction.py
│   ├── skill_gap.py
│   └── skill_normalization.py
├── config/
├── embeddings/
├── evaluation/
├── generation/
├── ingestion/
├── notebooks/
├── retrieval/
├── routing/
├── tests/
├── vector_store/
├── download_data.py
├── requirements.txt
└── README.md
```

Generated datasets, embeddings, vector indexes, and other local artifacts are not included in the Git repository because of their size. They must be prepared locally before running components that depend on them.

## 🚀 Getting Started

### Prerequisites
- Python 3.11
- Git
- A valid Google Gemini API key for Gemini-powered functionality
- The project dataset and generated retrieval artifacts for data-dependent features

### 1. Clone the Repository

```bash
git clone https://github.com/basmalaazabmohamed-commits/CareerLens.git
cd CareerLens
```

### 2. Create a Virtual Environment

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
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Replace the placeholder with your own API key. Never commit `.env` or expose API keys publicly.

### 5. Start the API

From the project root, with the virtual environment activated:

```bash
uvicorn api.main:app --reload
```

Open the interactive API documentation at:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

Some endpoints and retrieval operations may require local data files and generated artifacts before they can run successfully.

### 6. Run Tests

```bash
python -m pytest tests -v
```

## 🗺️ Roadmap

- [x] Job data processing and chunking components
- [x] Semantic and BM25 retrieval components
- [x] Reciprocal Rank Fusion
- [x] Candidate skill extraction and normalization components
- [x] Job requirement extraction and skill gap analysis
- [x] FastAPI backend foundation
- [ ] Validate and document end-to-end API workflows
- [ ] Improve evidence-grounded matching and reduce false negatives
- [ ] Complete retrieval and skill-gap evaluation
- [ ] Build the frontend
- [ ] Add end-to-end demonstrations and screenshots
- [ ] Improve deployment and production readiness

## ⚠️ Current Limitations

- The frontend is not available yet.
- Large datasets, embeddings, and vector indexes are not bundled with the repository.
- Skill matching depends on the quality and completeness of extracted CV evidence.
- End-to-end execution requires the appropriate local data artifacts and environment configuration.

## 👩‍💻 Author

Developed as an AI engineering portfolio project focused on RAG, information retrieval, NLP, structured extraction, and evidence-based career intelligence.
