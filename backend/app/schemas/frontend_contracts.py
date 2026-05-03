from typing import Literal

from pydantic import BaseModel, Field


class ModernizeSuggestRequest(BaseModel):
    """Payload the SPA sends when asking for AI-assisted modernization."""

    cobol_source: str = Field(..., description="COBOL fragment or full program text")
    target_language: Literal["java", "typescript", "csharp"] = "java"
    file_hint: str | None = Field(
        default=None,
        description="Optional path or name hint (e.g. LNRULES.cbl) for model context",
    )
    editor_notes: str | None = Field(
        default=None,
        description="Optional human notes from the rule editor step",
    )


class ModernizeSuggestResponse(BaseModel):
    """Response the SPA consumes for modernization preview."""

    suggested_code: str
    rationale: str | None = None
    model_id: str | None = Field(
        default=None,
        description="watsonx deployment or model identifier when inference ran",
    )
    watsonx_configured: bool = False
    message: str | None = Field(
        default=None,
        description="Setup or error detail when inference was skipped",
    )
