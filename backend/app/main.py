from fastapi import FastAPI
from app.core.database import Base, engine
from app.models.user import User
from app.routers import users, auth, profile


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profile.router)