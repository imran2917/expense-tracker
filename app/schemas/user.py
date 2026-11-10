from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime

class UserCreateDto(BaseModel):
    name : str = Field(
        ...,
        description = "Enter User Name",
        min_length = 5,
        max_length = 50
    )
    email : EmailStr = Field(
        ...,
        description = "Enter the User Email"
    )
    password : str = Field(
        ...,
        description = "Must be alteat 8 characters",
        min_length = 8, 
        max_length = 50
    )
    username : str = Field(..., min_length = 3, max_length = 50 )

class UserLoginDto(BaseModel):
    email : EmailStr = Field(..., description = " Enter the Registered Email")
    password : str = Field(..., description = "Enter the Register Password ")

class UserResponseDto(BaseModel):
    id : int
    name : str
    email : EmailStr
    username : str
    created_at : datetime


    model_config = ConfigDict(from_attributes = True)
