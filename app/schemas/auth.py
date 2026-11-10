from pydantic import BaseModel, ConfigDict, Field
from schemas.user import UserResponseDto
from schemas.user import UserResponseDto



class LoginRequest(BaseModel):
    email : str = Field(..., description = "Enter the email")
    password : str = Field(..., descritpion = "Enter the password")

class LoginResponse(BaseModel):
    access_token : str
    user : UserResponseDto
