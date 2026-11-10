
from core.db import BASE
from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship


class Expense(BASE):
    __tablename__ = "expense"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    title = Column(String(50), nullable=False)

    description = Column(String(500), nullable=True)

    show = Column(Boolean, default=True)

    amount = Column(Float, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable = False
    )

    user = relationship("User", back_populates = "expenses")
