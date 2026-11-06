from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
DATABASE_URL = "sqlite:///./expense.db"



# CREATE ENGINE 
engine = create_engine(
    DATABASE_URL,
    connect_args = {
        "check_same_thread" : False, 
    }
)
# SESSION
LocalSession = sessionmaker(
    autocommit = False,
    autoflush = False,
    bind = engine
)



# DEPENDECY 

# This function is used as fastAPI  dependency
# It's job is to make the session and accespt the api request and close when the requested ended up
def get_db():
    db = LocalSession()
    try:
        # This Give the session to the fastapi
        yield db
    finally:
        # weither database open or throws a session IT WILL(db) close
        db.close()



BASE = declarative_base()


