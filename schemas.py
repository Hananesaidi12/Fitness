from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from datetime import datetime
#
from pydantic import BaseModel


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    age: int
    email: str
    password: str
    gender: str
    level: str

class UserLogin(BaseModel):
    email: str
    password: str

    
class SessionCreate(BaseModel):
    user_id: int
    session_type: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration: Optional[int] = None
    evaluation: Optional[str] = None
    exercises_done: Optional[str] = None



class SessionOut(BaseModel):
    id: int
    user_id: int
    session_type: str
    start_time: datetime
    end_time: datetime
    duration: Optional[int] = None
    evaluation: Optional[str] = None
    exercises_done: Optional[str] = None

    class Config:
        orm_mode = True
  # très important pour SQLAlchemy

class PostCreate(BaseModel):
    name: str
    message: str

class PostOut(PostCreate):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    age: Optional[int] = None
    gender: Optional[str] = None
    level: Optional[str] = None
    last_active: Optional[datetime] = None
    role: Optional[str] = None

    class Config:
        from_attributes = True



class ContactCreate(BaseModel):
    name: str
    email: str
    message: str

class ContactOut(BaseModel):
    id: int
    name: str
    email: str
    message: str
    created_at: datetime

    class Config:
        orm_mode = True



class AdminUpdate(BaseModel):
    email: str
    password: str | None = None
    dark_mode: bool = False
    email_notifications: bool = True