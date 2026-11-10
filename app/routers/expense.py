
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# from schemas.expense import ExpenseRequestDto, ExpenseResponseDto
# from schemas.api_response import ApiResponse
# from core.db import get_db
# from models.expense import Expense

from core.db import get_db
from models.expense import Expense
from schemas.expense import ExpenseRequestDto, ExpenseResponseDto
from schemas.api_response import ApiResponse
from models.user import User
from core.dependencies import get_current_user

expense_router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)


# CREATE EXPENSE
@expense_router.post("/", response_model=ApiResponse)
def create_expense(
    expense_request_dto: ExpenseRequestDto,
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    new_expense = Expense(
        title=expense_request_dto.title,
        description=expense_request_dto.description,
        amount=expense_request_dto.amount,
        user_id = current_user.id
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    expense_response = ExpenseResponseDto.model_validate(new_expense)

    return ApiResponse(
        status="Success",
        message="Expense Created Successfully",
        data={
            "expense": expense_response.model_dump()
        }
    )

# GET ALL EXPENSES
@expense_router.get("/", response_model=ApiResponse)
def get_all_expenses(
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
    ):

    db_expenses = (
        db.query(Expense).filter(Expense.user_id == current_user.id).all()
    )
    expense_list = []


    for exp in db_expenses:
        validated_items = ExpenseResponseDto.model_validate(exp).model_dump()
        expense_list.append(validated_items)

    return ApiResponse(
        status="Success",
        message="Expenses retrieved successfully",
        data={
            "expenses" : expense_list
        }
    )


# GET EXPENSE BY ID
@expense_router.get("/{expense_id}", response_model=ApiResponse)
def get_expense_by_id(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user : User = Depends(get_current_user)

):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    expense_response = ExpenseResponseDto.model_validate(expense)

    return ApiResponse(
        status="Success",
        message="Expense Retrieved Successfully",
        data={
            "expense": expense_response.model_dump()
        }
    )

# UPDATE EXPENSE BY ID
@expense_router.put("/{expense_id}", response_model = ApiResponse)
def update_expense(
    expense_id : int,
    expense_request_dto : ExpenseRequestDto,
    db : Session = Depends(get_db),
    current_user : User = Depends(get_db)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        return ApiResponse(
            status = "error",
            message = "Data not found",
            data = None
        )
    expense.title = expense_request_dto.title
    expense.amount = expense_request_dto.amount
    expense.description = expense_request_dto.description
    expense.show = expense_request_dto.show

    # update int he bd
    db.commit()
    db.refresh(expense)

    # validate in response dto

    expense_response = ExpenseResponseDto.model_validate(expense)
    return ApiResponse(
        status = "Success",
        message = "Expense Response Udate Succcessfully",
        data = {
            "expense" : expense_response.model_dump()
        }
    )
    
# DELETE EXPENSE BY ID
@expense_router.delete("/{expense_id}", response_model=ApiResponse)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user : User = Depends(get_db)
):

    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if not expense:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(expense)
    db.commit()

    return ApiResponse(
        status="Success",
        message="Expense deleted successfully",
        data={"id": expense_id}
    )
