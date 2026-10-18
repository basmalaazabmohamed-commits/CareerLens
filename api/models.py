
from pydantic import BaseModel, Field
from typing import Literal


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=1500)


class ChatRequest(BaseModel):
    query: str = Field(min_length=1, max_length=3000)
    candidate_id: str | None = None
    job_description: str | None = Field(
        default=None,
        max_length=20000,
    )
    history: list[ChatMessage] = Field(default_factory=list)
    retrieval_k: int = Field(default=30, ge=5, le=100)
    rerank_k: int = Field(default=10, ge=1, le=30)


class JobCitation(BaseModel):
    job_id: str
    title: str
    company_name: str


class ChatResponse(BaseModel):
    answer: str
    citations: list[JobCitation] = Field(default_factory=list)
    follow_up_questions: list[str] = Field(default_factory=list)
    retrieved_job_count: int = 0
    route: str = "general_job_search"
    priority_improvements: list[str] = Field(default_factory=list)
    analysis: dict | None = None
    requirements: dict | None = None