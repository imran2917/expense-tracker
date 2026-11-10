from core.db import BASE
from datetime import datetime

from sqlalchemy import Boolean, Column, Integer, String, Float, Date, DateTime
from sqlalchemy.orm import relationship

class User(BASE):
    __tablename__= "users"

    id = Column(Integer, primary_key = True, index = True, autoincrement = True)
    name = Column(String(100), nullable = False)
    username = Column(String(50), nullable = False, unique = True )
    email = Column(String(100), nullable = False, unique = True)
    hashed_password = Column(String(250), nullable = False)
    created_at = Column(DateTime, nullable = False, default = datetime.utcnow)
    # id  = Column(Integer, primary_key = Trye, autoincrement = True, index= True)
    expenses = relationship("Expense", back_populates = "user")


