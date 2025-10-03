from fastapi import FastAPI, Depends, HTTPException, APIRouter, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler
import smtplib
from email.mime.text import MIMEText
from passlib.context import CryptContext
#
from sqlalchemy import func, text
from sqlalchemy import extract

from datetime import datetime, timedelta
#contact
from models import Contact
from schemas import ContactCreate, ContactOut

# --- Import modules locaux ---
from database import Base, engine, SessionLocal
from models import User, Admin, ExerciseSession, Post, Goal, Activity
from schemas import UserCreate, UserLogin, SessionCreate, SessionOut, PostCreate, PostOut


# --- Password hashing ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Création des tables ---
Base.metadata.create_all(bind=engine)

# --- Application FastAPI ---
app = FastAPI()

# --- CORS ---
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dépendance DB ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Email config ---
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "ton_email@gmail.com"
SMTP_PASSWORD = "ton_mot_de_passe_app"

def send_email(to_email: str, subject: str, body: str):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_USERNAME
    msg["To"] = to_email
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, to_email, msg.as_string())

# --- Scheduler rappels inactivité ---
scheduler = BackgroundScheduler()

def send_inactivity_reminders():
    db = SessionLocal()
    try:
        threshold_date = datetime.utcnow() - timedelta(days=7)
        users_to_remind = db.query(User).filter(
            (User.last_active < threshold_date) &
            ((User.last_reminder_sent == None) | (User.last_reminder_sent < threshold_date))
        ).all()
        for user in users_to_remind:
            send_email(
                to_email=user.email,
                subject="Rappel : votre séance vous attend !",
                body=f"Bonjour {user.first_name},\n\nReprenez votre entraînement dès aujourd'hui !\n\nL'équipe CoreFlex"
            )
            user.last_reminder_sent = datetime.utcnow()
            db.commit()
    finally:
        db.close()

scheduler.add_job(send_inactivity_reminders, 'interval', hours=24)
scheduler.start()

# ==============================
# ROUTES UTILISATEURS
# ==============================

class UserOut(BaseModel):
    id: int
    first_name: str
    last_name: str
    age: int
    email: str
    gender: str
    level: str
    last_active: Optional[datetime] = None
    role: str
    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    old_password: Optional[str] = None
    new_password: Optional[str] = None
    age: Optional[int] = None
    level: Optional[str] = None
    two_factor_enabled: Optional[bool] = None
    dark_mode: Optional[bool] = None
    language: Optional[str] = None
    email_notifications: Optional[bool] = None
    timezone: Optional[str] = None
    profile_visibility: Optional[str] = None
    auto_save_settings: Optional[bool] = None
    
@app.post("/signup", status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email déjà utilisé.")
    
    hashed_password = pwd_context.hash(user.password)
    
    user_data = user.dict()
    user_data.pop("password", None)  # supprime le mot de passe clair
    
    new_user = User(**user_data, password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Inscription réussie."}

@app.post("/sigin")
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
    # Vérifier admin
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()
    if admin and pwd_context.verify(credentials.password, admin.hashed_password):
        return {"message": "Connexion admin réussie", "role": "admin", "admin_id": admin.id}

    # Vérifier user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Identifiants invalides.")

    if pwd_context.verify(credentials.password, user.password):
        user.last_active = datetime.utcnow()
        db.commit()
        return {
            "message": "Connexion client réussie",
            "role": "client",
            "user_id": user.id,
            "user_fullname": f"{user.first_name} {user.last_name}"
        }

    raise HTTPException(status_code=401, detail="Identifiants invalides.")

@app.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.get("/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "age": user.age,
        "level": user.level,
        "gender": user.gender, 
        "two_factor_enabled": getattr(user, "two_factor_enabled", False),
        "dark_mode": getattr(user, "dark_mode", False),
        "language": getattr(user, "language", "fr"),
        "email_notifications": getattr(user, "email_notifications", True),
        "timezone": getattr(user, "timezone", "Africa/Rabat"),
        "profile_visibility": getattr(user, "profile_visibility", "public"),
        "auto_save_settings": getattr(user, "auto_save_settings", False),
    }

@app.put("/user/{user_id}")
def update_user(user_id: int, update: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    names = update.full_name.strip().split(" ", 1)
    user.first_name = names[0]
    user.last_name = names[1] if len(names) > 1 else ""
    user.email = update.email
    user.age = update.age
    
    user.level = update.level

    if update.old_password and update.new_password:
        if not pwd_context.verify(update.old_password, user.password):
            raise HTTPException(status_code=400, detail="Ancien mot de passe incorrect")
        user.password = pwd_context.hash(update.new_password)

    # Autres paramètres
    for attr in ["two_factor_enabled","dark_mode","language","email_notifications","timezone","profile_visibility","auto_save_settings"]:
        val = getattr(update, attr)
        if val is not None:
            setattr(user, attr, val)

    db.commit()
    db.refresh(user)
    return {"message": "Utilisateur mis à jour avec succès."}

@app.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    db.delete(user)
    db.commit()
    return

@app.get("/user/{user_id}/export")
def export_user_data(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    sessions = db.query(ExerciseSession).filter(ExerciseSession.user_id == user_id).all()
    return {
        "id": user.id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "two_factor_enabled": user.two_factor_enabled,
        "dark_mode": user.dark_mode,
        "sessions": [
            {
                "id": s.id,
                "session_type": s.session_type,
                "start_time": s.start_time.isoformat(),
                "end_time": s.end_time.isoformat(),
                "duration": s.duration,
                "evaluation": s.evaluation,
                "exercises_done": s.exercises_done,
            } for s in sessions
        ]
    }

# ==============================
# ROUTER SESSIONS
# ==============================
sessions_router = APIRouter(prefix="/sessions", tags=["Sessions"])

@sessions_router.post("", response_model=SessionOut)  # "" pour éviter 404
def create_session(session: SessionCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    start_time = session.start_time or datetime.utcnow()
    end_time = session.end_time or (start_time + timedelta(minutes=session.duration)) if session.duration else start_time

    new_session = ExerciseSession(
        user_id=session.user_id,
        session_type=session.session_type,
        start_time=start_time,
        end_time=end_time,
        duration=session.duration,
        evaluation=session.evaluation or "",
        exercises_done=session.exercises_done or ""
    )

    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session

@sessions_router.get("/user/{user_id}", response_model=List[SessionOut])
def get_user_sessions(user_id: int, db: Session = Depends(get_db)):
    return db.query(ExerciseSession).filter(ExerciseSession.user_id == user_id).all()

@sessions_router.get("/progress/user/{user_id}")
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    sessions = db.query(ExerciseSession).filter(ExerciseSession.user_id == user_id).all()
    total_sessions = len(sessions)
    total_duration = sum(session.duration for session in sessions)
    score = round(total_duration / total_sessions, 2) if total_sessions > 0 else 0
    evaluations = [{"date": s.start_time.strftime("%Y-%m-%d"), "value": s.evaluation} for s in sessions]
    sessions_list = [{"id": s.id,"session_type": s.session_type,"start_time": s.start_time.isoformat(),"end_time": s.end_time.isoformat(),"duration": s.duration,"evaluation": s.evaluation,"exercises_done": s.exercises_done} for s in sessions]
    return {"total_sessions": total_sessions,"total_duration": total_duration,"score": score,"evaluations": evaluations,"sessions": sessions_list}

# ==============================
# ROUTER POSTS
# ==============================
posts_router = APIRouter(prefix="/posts", tags=["Posts"])

@posts_router.post("", response_model=PostOut)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    db_post = Post(**post.dict())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@posts_router.get("", response_model=List[PostOut])
def get_all_posts(db: Session = Depends(get_db)):
    return db.query(Post).order_by(Post.timestamp.desc()).all()

# --- Inclusion des routers ---
app.include_router(sessions_router)
app.include_router(posts_router)

#### admin
@app.get("/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    reports_generated = db.query(ExerciseSession).count()

    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    # Distribution des utilisateurs
    active_users = db.query(User).filter(
        User.last_active != None,
        User.last_active > seven_days_ago
    ).count()

    inactive_users = db.query(User).filter(
        (User.last_active == None) | (User.last_active <= seven_days_ago)
    ).count()

    suspended_users = 0  # si tu ajoutes un champ `status` pour les suspendus

    # Données mensuelles (nouveaux utilisateurs par mois)
    monthly_data = []
    labels = []
    today = datetime.utcnow()
    for i in range(5):  # 5 derniers mois
        month = (today.month - i - 1) % 12 + 1
        year = today.year if today.month - i > 0 else today.year - 1

        count = db.query(User).filter(
            extract("month", User.last_active) == month,
            extract("year", User.last_active) == year
        ).count()

        monthly_data.insert(0, count)
        labels.insert(0, datetime(year, month, 1).strftime("%b"))

    # Exemple de calcul dynamique de l'uptime (facultatif)
    system_start = datetime(2025, 8, 12)  # remplacer par la date réelle de démarrage
    uptime_days = (datetime.utcnow() - system_start).days

    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "inactiveUsers": inactive_users,
        "suspendedUsers": suspended_users,
        "reportsGenerated": reports_generated,
        "systemUptime": f"{uptime_days} days",
        "monthlyData": monthly_data,
        "labels": labels,
        "userDistribution": [active_users, inactive_users, suspended_users]
    }


#### admin - users distripution 


@app.get("/admin/user-distribution")
def user_distribution(db: Session = Depends(get_db)):
    # Active : last_active dans les 7 derniers jours


    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    active_count = db.query(func.count(User.id)).filter(
        User.last_active != None,
        User.last_active > seven_days_ago
    ).scalar()

    inactive_count = db.query(func.count(User.id)).filter(
        (User.last_active == None) | (User.last_active <= seven_days_ago)
    ).scalar()


    # Suspended : si tu as un champ `status` dans User
    suspended_count = db.query(func.count(User.id)).filter(User.status == 'suspended').scalar() if hasattr(User, "status") else 0

    distribution = {
        "Active": active_count,
        "Inactive": inactive_count,
        "Suspended": suspended_count
    }

    return distribution


### Contact 


@app.post("/contacts", response_model=ContactOut)
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    new_contact = Contact(
        name=contact.name,
        email=contact.email,
        message=contact.message
    )
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact

@app.get("/contacts", response_model=List[ContactOut])
def get_contacts(db: Session = Depends(get_db)):
    return db.query(Contact).order_by(Contact.created_at.desc()).all()



# === Endpoint Client ===
@app.get("/client/stats")
def get_client_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Séances
    workouts_done = db.query(ExerciseSession).filter(ExerciseSession.user_id == user_id).count()
    calories_burned = (
    db.query(func.sum(ExerciseSession.duration * 5))  # 5 kcal par minute (exemple)
    .filter(ExerciseSession.user_id == user_id)
    .scalar() or 0
)

    # Jours actifs → basé sur start_time
    active_days = (
        db.query(func.date(ExerciseSession.start_time))
        .filter(ExerciseSession.user_id == user_id)
        .distinct()
        .count()
    )

    # Goals
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    goals_list = [{"id": g.id, "text": g.text, "done": g.done} for g in goals]

    if goals:
        done_count = sum(1 for g in goals if g.done)
        progress_percent = round((done_count / len(goals)) * 100, 1)  # 1 décimale
    else:
        progress_percent = round(min(100, (workouts_done / 50) * 100), 1)


    # Activités récentes
    activities = (
        db.query(Activity)
        .filter(Activity.user_id == user_id)
        .order_by(Activity.date.desc())
        .limit(5)
        .all()
    )
    recent_activities = [
        {"id": a.id, "description": a.description, "date": a.date.strftime("%Y-%m-%d")}
        for a in activities
    ]

    return {
        "workoutsDone": workouts_done,
        "caloriesBurned": calories_burned,
        "activeDays": active_days,
        "progressPercent": progress_percent,
        "goals": goals_list,
        "recentActivities": recent_activities,
    }


@app.get("/admin/{admin_id}")
def get_admin(admin_id: int, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin non trouvé")

    return {
        "id": admin.id,
        "email": admin.email,
        "role": admin.role,
        "created_at": admin.created_at.isoformat(),
        # Valeurs par défaut car pas encore dans ta table
        "dark_mode": False,
        "email_notifications": True
    }

class AdminUpdate(BaseModel):
    email: str
    password: str | None = None
    dark_mode: bool = False
    email_notifications: bool = True

@app.put("/admin/{admin_id}")
def update_admin(admin_id: int, data: AdminUpdate, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin non trouvé")

    admin.email = data.email

    if data.password:  # rehash le mot de passe si modifié
        admin.hashed_password = pwd_context.hash(data.password)

    # Si tu veux vraiment stocker dark_mode et email_notifications :
    # ajoute ces colonnes dans ton modèle Admin + migration SQL
    # Sinon, pour l'instant, on les ignore ou on peut logguer

    db.commit()
    db.refresh(admin)

    return {
        "message": "Admin mis à jour",
        "id": admin.id,
        "email": admin.email,
        "role": admin.role
    }