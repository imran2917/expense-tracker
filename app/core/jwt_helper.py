from datetime import datetime, timedelta, timezone
from jose import jwt
from fastapi import HTTPException, status

# Three Valirabe 
SECRET_KEY = "lkasdhfudepajdfenkdoeakpdfy"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_TIME = 30


# Create Access Token

def create_access_token(data: dict, expires_dalta: timedelta | None = None):
    to_encode = data.copy()
    if expires_dalta:
        expire = datetime.now(timezone.utc) + expires_dalta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRE_TIME)

    to_encode.update({
        "exp" : expire 
    })

    encoded_token = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM, )
    return encoded_token

def verify_token_access(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        return payload
    except jwt.JWTError:
        print("Invalid Token")
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid Token"
        )

if __name__ == "__main__":
    print("This is the Main Module ", __name__)
    token = create_access_token({"name" : "imran"})

    payload = verify_token_access(token)
    print("Token Verified Successfully")
    print(payload)
    print(token)
