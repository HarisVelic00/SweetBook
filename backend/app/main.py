from fastapi import FastAPI
from app.routers import users, auth, profile, recipe, comment


app = FastAPI()


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profile.router)
app.include_router(recipe.router)
app.include_router(comment.router)