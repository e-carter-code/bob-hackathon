"""
IBM watsonx.ai integration for legacy (COBOL) → modern code suggestions.

Set at least:
  IBM_CLOUD_API_KEY   — IBM Cloud API key with watsonx access
  WATSONX_PROJECT_ID  — watsonx project / space id for inference

Optional:
  WATSONX_URL         — regional inference URL (default IBM Cloud Dallas)
  WATSONX_MODEL_ID    — model or deployment id (product-specific)

When credentials are missing, the API still returns 200 with a stub body so
the SPA can branch on ``watsonx_configured``.

Implementation note: wire the official watsonx Python SDK or REST
(text generation / chat) here; see https://www.ibm.com/products/watsonx-ai
"""

from __future__ import annotations

import os

from app.schemas.frontend_contracts import ModernizeSuggestRequest, ModernizeSuggestResponse

_DEFAULT_MODEL = os.environ.get("WATSONX_MODEL_ID", "ibm/granite-3-8b-instruct")


def _watsonx_ready() -> bool:
    return bool(os.environ.get("IBM_CLOUD_API_KEY") and os.environ.get("WATSONX_PROJECT_ID"))


async def suggest_modern_code(req: ModernizeSuggestRequest) -> ModernizeSuggestResponse:
    if not _watsonx_ready():
        return ModernizeSuggestResponse(
            suggested_code=(
                f"// Set IBM_CLOUD_API_KEY and WATSONX_PROJECT_ID to enable watsonx.ai.\n"
                f"// Target: {req.target_language}\n"
                f"// COBOL length: {len(req.cobol_source)} chars\n"
            ),
            rationale=None,
            model_id=_DEFAULT_MODEL,
            watsonx_configured=False,
            message=(
                "watsonx.ai is not configured. Add IBM_CLOUD_API_KEY and WATSONX_PROJECT_ID, "
                "then implement inference in watsonx_modernization.suggest_modern_code."
            ),
        )

    # Placeholder: replace with ModelInference API / SDK call using req.cobol_source.
    return ModernizeSuggestResponse(
        suggested_code=(
            "// watsonx credentials present; implement ModelInference call to return real output.\n"
        ),
        rationale="Implement watsonx text generation with COBOL→" + req.target_language + " prompt.",
        model_id=_DEFAULT_MODEL,
        watsonx_configured=True,
        message="Credentials detected; connect SDK or REST in watsonx_modernization.py.",
    )
