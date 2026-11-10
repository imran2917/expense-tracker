from fastapi import APIRouter, Depends, HTTPException, status 
from sqlalchemy.orm import Session


from core.db import get_db
from models.user import User
from schemas.user import UserCreateDto, UserLoginDto, UserResponseDto
from schemas.api_response import ApiResponse
from core.security import hash_password, verify_password

user_router = APIRouter(
    prefix = "/user",
    tags = ["user"]
)

#CreateUser Endpoint
@user_router.post("/signup", response_model = ApiResponse, status_code = status.HTTP_201_CREATED)
def register_user(user_request : UserCreateDto, db: Session = Depends(get_db)):
    # Check if the email already existed in the database
    existing_user_by_email = db.query(User).filter(User.email ==  user_request.email).first()
    if existing_user_by_email:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "User with this email already Existed"
        )

    # check existing user by username
    existing_user_by_username = db.query(User).filter(User.username == user_request.username).first()
    if existing_user_by_username:
        raise HTTPException(
            status_code = status.HTTP_400_BAD_REQUEST,
            detail = "User with Username already exist"
        )


    # Hashed the Plain password
    secure_hashed_password = hash_password(user_request.password)

    # create a new user model instance

    new_user_model = User(
        name = user_request.name,
        username = user_request.username,
        email = user_request.email,
        hashed_password = secure_hashed_password,
    )

    # save the user in the database

    db.add(new_user_model)
    db.commit()
    db.refresh(new_user_model)


    # Convert SqlAlchemy model to pydantic response 
    user_response_dto = UserResponseDto.model_validate(new_user_model)

    # Returnr the Response 

    return ApiResponse(
        status = "Success",
        message = "User Created Successfully",
        data = {
            "user" : user_response_dto.model_dump()
        }
    )



# Loging Endpoing 

@user_router.post("/login", response_model = ApiResponse, status_code = status.HTTP_200_OK)
def login_user(login_request : UserLoginDto, db : Session = Depends(get_db)):

    #find the user with email 
    user_model = db.query(User).filter(User.email == login_request.email).first()

    #exception 
    if not user_model:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid Email or Password"
        )

    # check the password valid or not
    is_password_valid = verify_password(login_request.password, user_model.hashed_password)

    if not is_password_valid:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Unauthorized Password or Invalid Password"
        )


    user_response_dto = UserResponseDto.model_validate(user_model)

    return ApiResponse(
        status = "Success",
        message = "Loging Successful",
        data = {
            "user": user_response_dto.model_dump()
        }
    )

# Get user by id 


    

