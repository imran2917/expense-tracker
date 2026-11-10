from fastapi import FastAPI
from core.db import BASE, engine
# TO IMPOLETE THE CORS ( CROSS ORIGING RESOURCE SHARING ) to to get the communicated betweenf frontend and the backend 
from fastapi.middleware.cors import CORSMiddleware

import models.user
import models.expense
app = FastAPI(title = "FastApi Backend")


from routers.expense import expense_router
app.include_router(expense_router)

from routers.user import user_router
app.include_router(user_router)

# authentication api
from routers.auth import auth_router
app.include_router(auth_router)


# Create Table
BASE.metadata.create_all(bind=engine)



@app.get("/")
def root():
    return " Hi From Fast API"



# CORE Configurate 

app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)