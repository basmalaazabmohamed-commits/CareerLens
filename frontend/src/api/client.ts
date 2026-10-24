// API client — all communication with the CareerRAG backend

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ---- Types ----

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface JobCitation {
  job_id: string;
  title: string;
  company_name: string;
}

export interface ChatRequest {
  query: string;
  candidate_id?: string | null;
  job_description?: string | null;
  history?: ChatMessage[];
  retrieval_k?: number;
  rerank_k?: number;
}

export interface ChatResponse {
  answer: string;
  citations: JobCitation[];
  follow_up_questions: string[];
  retrieved_job_count: number;
  route: 'general_job_search' | 'candidate_job_search' | 'custom_job_gap';
  priority_improvements: string[];
  analysis: null | { jobs: JobAnalysis[] } | SkillGapAnalysis;
  requirements?: JobRequirementsData | null;
}

export interface SkillEntry {
  skill: string;
  status: 'matched_by_name' | 'matched_by_alias' | 'matched_by_evidence' | 'not_found_in_cv';
  candidate_evidence: string;
  job_evidence: string;
}

export interface JobAnalysis {
  job_id: string;
  title: string;
  company_name: string;
  requirements: JobRequirementsData;
  skill_gap: SkillGapAnalysis;
}

export interface SkillGapAnalysis {
  candidate_id: string;
  job_id: string;
  title: string;
  company_name: string;
  matched_required_skills: SkillEntry[];
  required_skills_not_found_in_cv: SkillEntry[];
  matched_preferred_skills: SkillEntry[];
  preferred_skills_not_found_in_cv: SkillEntry[];
  required_skill_count: number;
  matched_required_skill_count: number;
  required_skills_not_found_count: number;
  preferred_skill_count: number;
  matched_preferred_skill_count: number;
  preferred_skills_not_found_count: number;
  required_skill_coverage: number | null;
  preferred_skill_coverage: number | null;
  coverage_note: string;
}

export interface SkillEvidence {
  name: string;
  evidence: string;
  source_section: string;
}

export interface JobRequirementsData {
  job_id: string;
  title: string;
  company_name: string;
  required_skills: SkillEvidence[];
  preferred_skills: SkillEvidence[];
  experience_requirements: string[];
  education_requirements: string[];
  responsibilities: string[];
}

export interface CandidateSkill {
  name: string;
  evidence: string;
  source_section: string;
}

export interface CandidateExperience {
  role: string;
  company: string;
  duration: string;
  description: string;
  evidence: string;
}

export interface CandidateEducation {
  degree: string;
  field_of_study: string;
  institution: string;
  graduation_date: string;
  evidence: string;
}

export interface CandidateProject {
  name: string;
  description: string;
  technologies: CandidateSkill[];
  evidence: string;
}

export interface CandidateCertification {
  name: string;
  issuer: string;
  date: string;
  evidence: string;
}

export interface CandidateProfile {
  candidate_id: string;
  skills: CandidateSkill[];
  experience: CandidateExperience[];
  education: CandidateEducation[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  languages: string[];
  summary: string;
}

export interface CVUploadResponse {
  candidate_id: string;
  skill_count: number;
  project_count: number;
  experience_count: number;
  message: string;
}

export interface JobRecord {
  job_id: string;
  title: string;
  company_name: string;
  job_text: string;
}

// ---- API Helpers ----

class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.headers || {}),
      },
    });

    if (!res.ok) {
      let detail = `HTTP ${res.status}`;
      try {
        const body = await res.json();
        detail = body?.detail || body?.message || detail;
      } catch { /* ignore parse errors */ }
      throw new ApiError(res.status, detail);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, 'Unable to reach the CareerLens API. Is the backend running?');
  }
}

// ---- Exported API calls ----

export const api = {
  health(): Promise<{ status: string }> {
    return request('/health');
  },

  uploadCV(file: File): Promise<CVUploadResponse> {
    const form = new FormData();
    form.append('file', file);
    return request('/api/cv/upload', { method: 'POST', body: form });
  },

  getCandidateProfile(candidateId: string): Promise<CandidateProfile> {
    return request(`/api/cv/${encodeURIComponent(candidateId)}`);
  },

  chat(req: ChatRequest): Promise<ChatResponse> {
    return request('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
  },

  getJob(jobId: string): Promise<JobRecord> {
    return request(`/api/jobs/${encodeURIComponent(jobId)}`);
  },
};

export { ApiError };
