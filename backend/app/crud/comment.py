from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate


def create_comment(db: Session, comment: CommentCreate, user_id: int, recipe_id: int):
    db_comment = Comment(text=comment.text, user_id=user_id, recipe_id=recipe_id)

    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)

    return db_comment


def get_recipe_comments(db: Session, recipe_id: int):
    return (
        db.query(Comment)
        .filter(Comment.recipe_id == recipe_id)
        .all()
    )


def delete_comment(db: Session, comment_id: int, user_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()

    if not comment:
        return None

    if comment.user_id != user_id:
        return None

    db.delete(comment)
    db.commit()

    return comment
