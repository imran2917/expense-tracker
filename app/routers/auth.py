from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.db import get_db
from models.user import User
from core.security import verify_password
from core.jwt_helper import create_access_token
from schemas.user import UserResponseDto
from schemas.auth import LoginResponse, LoginRequest
from core.security import hash_password

# from models.user import User

auth_router = APIRouter(
    prefix = "/auth",
    tags = ["Authentication"]
)



# @auth_router.post("/", response_model = LoginResponse)
# def login_user(login_request: LoginRequest, db : Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == login_request.email).first()
#     if not user or not verify_password(login_request.password, user.hashed_password):
#         raise HTTPException(
#             status_code = 401,
#             detail = "Invalid Password"
#         )
#     access_token = create_access_token(data = {
#         "user_id" : user.id,
#         "email" : user.email
#     })

#     return LoginResponse(
#         access_token = access_token,
#         user = UserResponseDto.model_validate(user)

#     ) 

@auth_router.post("/", response_model=LoginResponse)
def login_user(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_request.email).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid Credentials")
        
    
    try:
        is_valid = verify_password(login_request.password, user.hashed_password)
        print(f"✅ Passwords Match Result: {is_valid}")
    except Exception as e:
        print(f"❌ Verify Password Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Hashing error: {str(e)}")
        
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid Password")
        
    access_token = create_access_token(data={"user_id": user.id, "email": user.email})

    return LoginResponse(
        access_token=access_token,
        user=UserResponseDto.model_validate(user)
    )