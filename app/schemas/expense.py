
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class ExpenseRequestDto(BaseModel):
    title: str = Field(
        ...,
        description="Enter the title of the expense",
        min_length=1,
        max_length=50
    )

    amount: float = Field(
        ...,
        description="Enter the expense amount",
        gt=0
    )

    description: str = Field(
        ...,
        description="Enter the expense description",
        min_length=1,
        max_length=500
    )

    show: bool = True


class ExpenseResponseDto(BaseModel):

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    amount: float
    description: str
    show: bool
    created_at: datetime | None = None
