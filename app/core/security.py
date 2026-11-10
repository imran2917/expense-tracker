from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

ph = PasswordHasher()


def hash_password(password : str) -> str:
    return ph.hash(password)



def verify_password(plain_password : str, hashed_password: str) ->bool:
    """Verify Plain password against the argon2"""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except (VerifyMismatchError, InvalidHash):
        return False