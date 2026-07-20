from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.crud import comment as crud

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/recipes/{recipe_id}", response_model=CommentResponse)
def create_comment(
    recipe_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_comment = crud.create_comment(
        db=db, comment=comment, user_id=current_user.id, recipe_id=recipe_id
    )
    return new_comment


@router.get("/recipes/{recipe_id}", response_model=list[CommentResponse])
def get_comments(recipe_id: int, db: Session = Depends(get_db)):
    return crud.get_recipe_comments(db=db, recipe_id=recipe_id)


@router.delete("/{comment_id}", response_model=CommentResponse)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = crud.delete_comment(db=db, comment_id=comment_id, user_id=current_user.id)

    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or not owner")

    return comment
