from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import Base, engine, get_db
from models import User, Project, Block
from schemas import UserCreate, UserLogin, ProjectCreate
from auth import get_password_hash, verify_password
from Blockhain import Blockchain
from datetime import datetime

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS ayarları
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def load_blockchain():
    global blockchain
    db = next(get_db())
    blockchain = Blockchain(db)

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    return {"message": "User created"}

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    role = db_user.role
    return {"message": "Login successful", "role": role, "user_id": db_user.id}

@app.get("/instructors")
def get_instructors(db: Session = Depends(get_db)):
    return db.query(User).filter(User.role == "instructor").all()

@app.post("/projects")
def submit_project(project: ProjectCreate, db: Session = Depends(get_db)):
    try:
        new_project = Project(
            title=project.title,
            description=project.description,
            owner_id=project.owner_id,
            instructor_id=project.instructor_id,
            is_approved=False
        )
        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        tx = {
            "type": "submit",
            "project": {
                "id": new_project.id,
                "title": new_project.title,
                "description": new_project.description,
                "owner_id": new_project.owner_id,
                "instructor_id": new_project.instructor_id
            },
            "timestamp": str(datetime.utcnow())
        }
        blockchain.add_transaction(tx)
        blockchain.mine_pending_transactions()
        blockchain.save_chain_to_db(db)

        return {"message": "Project submitted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/projects/{project_id}/approve")
def approve_project(project_id: int, instructor_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id, Project.instructor_id == instructor_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found or unauthorized")
    project.is_approved = True
    db.commit()
    tx = {
        "type": "approve",
        "user": instructor_id,
        "project_id": project_id,
        "timestamp": str(datetime.utcnow())
    }
    blockchain.add_transaction(tx)
    blockchain.mine_pending_transactions()
    blockchain.save_chain_to_db(db)
    return {"message": "Project approved"}

@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@app.get("/blocks")
def get_blocks(db: Session = Depends(get_db)):
    return db.query(Block).all()

@app.get("/chain/validate")
def validate_chain(db: Session = Depends(get_db)):
    if blockchain.is_chain_valid(db):
        return {"valid": True}
    return {"valid": False}

@app.get("/transactions")
def get_all_transactions(db: Session = Depends(get_db)):
    all_transactions = []

    # Blockchain'deki blokları gez
    for block in blockchain.chain:
        for tx in block.transactions:
            all_transactions.append(tx)

    # İstersen bekleyen işlemleri de ekleyebilirsin:
    # all_transactions.extend(blockchain.pending_transactions)

    return {"transactions": all_transactions}
