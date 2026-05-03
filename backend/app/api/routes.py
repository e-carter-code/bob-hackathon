from fastapi import APIRouter

from app.schemas.frontend_contracts import ModernizeSuggestRequest, ModernizeSuggestResponse
from app.services.watsonx_modernization import suggest_modern_code

router = APIRouter()


@router.post(
    "/modernize/suggest",
    response_model=ModernizeSuggestResponse,
    summary="AI-assisted modernization (watsonx.ai)",
)
async def modernize_suggest(body: ModernizeSuggestRequest) -> ModernizeSuggestResponse:
    return await suggest_modern_code(body)
