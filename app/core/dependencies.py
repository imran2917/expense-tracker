from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from core.db import get_db
from core.jwt_helper import verify_token_access
from models.user import User


# To receive Beares Token Receive krna k liye

security = HTTPBearer(auto_error = False)


# current logged_in user find krne k lia 
def get_current_user(
    credentials : HTTPAuthorizationCredentials | None = Depends(security),
    db : Session = Depends(get_db)
):
    # token missing he to 
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            details = "Authentication Required",
            headers = {"WW-Authenticate " : "Beared"}
        )

    token = credentials.credentials


    # verify jwt and get payload

    payload = verify_token_access(token)

    # Get the user id from the token

    user_id = payload.get("user_id")

    if not isinstance(user_id , int) or isinstance(user_id, bool):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            details = "Invalid Payload Token"
        )

    # find the user from the database 
    current_user = db.query(User).filter(User.id == user_id).first()

    if current_user is None:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detaild = "User not found"
        )

    return current_user