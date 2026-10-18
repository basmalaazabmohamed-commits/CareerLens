
from pydantic import BaseModel, Field


class SkillEvidence(BaseModel):
    name: str
    evidence: str = ""
    source_section: str = "unknown"


class Experience(BaseModel):
    role: str = ""
    company: str = ""
    duration: str = ""
    description: str = ""
    evidence: str = ""


class Education(BaseModel):
    degree: str = ""
    field_of_study: str = ""
    institution: str = ""
    graduation_date: str = ""
    evidence: str = ""


class Project(BaseModel):
    name: str = ""
    description: str = ""
    technologies: list[SkillEvidence] = Field(default_factory=list)
    evidence: str = ""


class Certification(BaseModel):
    name: str
    issuer: str = ""
    date: str = ""
    evidence: str = ""


class CandidateProfile(BaseModel):
    candidate_id: str
    skills: list[SkillEvidence] = Field(default_factory=list)
    experience: list[Experience] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    projects: list[Project] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)
    summary: str = ""
