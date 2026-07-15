from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.crud import category as crud

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=CategoryResponse)
def create_category(category: CategoryCreate, db: Session = Depends(get_db)):
    db_category = crud.create_category(db, category)

    return db_category


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):

    return crud.get_categories(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: int, db: Session = Depends(get_db)):
    db_category = crud.get_category_by_id(db, category_id)

    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return db_category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int, category: CategoryUpdate, db: Session = Depends(get_db)
):
    db_category = crud.update_category(db, category_id, category)

    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return db_category


@router.delete("/{category_id}", response_model=CategoryResponse)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    db_category = crud.delete_category(db, category_id)

    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")

    return db_category
