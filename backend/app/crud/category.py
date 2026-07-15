from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def create_category(db: Session, category: CategoryCreate):
    db_category = Category(name=category.name)

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


def get_categories(db: Session):
    return db.query(Category).all()


def get_category_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()


def update_category(db: Session, category_id: int, category: CategoryUpdate):
    db_category = get_category_by_id(db, category_id)

    if db_category is None:
        return None

    db_category.name = category.name

    db.commit()
    db.refresh(db_category)

    return db_category


def delete_category(db: Session, category_id: int):
    db_category = get_category_by_id(db, category_id)

    if db_category is None:
        return None

    db.delete(db_category)
    db.commit()

    return db_category
