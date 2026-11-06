from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

# Password Haser

ph = PasswordHasher()


# password 

def hash_password(password : str) -> str:
    """ Hash a Password Using argon2 id """
    return ph.hash(password)

def verify_password(hashed_password : str, plain_password : str) -> bool:
    """ Verify password Against Argon2 Hashed"""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    
    except (VerifyMismatchError, InvalidHash):
        return False