from fastapi import FastAPI
from core.db import BASE, engine
import models.user
import models.expense
app = FastAPI(title = "FastApi Backend")


from routers.expense import expense_router
app.include_router(expense_router)

from routers.user import user_router
app.include_router(user_router)

# Create Table
BASE.metadata.create_all(bind=engine)



@app.get("/")
def root():
    return " Hi From Fast API"
