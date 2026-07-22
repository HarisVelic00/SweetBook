from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routers import (
    users,
    auth,
    profile,
    recipe,
    comment,
    category,
    favorite,
    rating,
    ingredient,
    recipe_ingredient,
    recipe_image,
)

app = FastAPI()

import os

os.makedirs("uploads/recipes", exist_ok=True)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(profile.router)
app.include_router(category.router)
app.include_router(ingredient.router)
app.include_router(recipe.router)
app.include_router(recipe_ingredient.router)
app.include_router(recipe_image.router)
app.include_router(comment.router)
app.include_router(rating.router)
app.include_router(favorite.router)
