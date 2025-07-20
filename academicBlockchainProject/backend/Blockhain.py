import json
import hashlib
import time
from models import Block as DBBlock, Project
from sqlalchemy.orm import Session
from datetime import datetime

class Block:
    def __init__(self, index, transactions, timestamp, previous_hash):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "transactions": self.transactions,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()


class Blockchain:
    def __init__(self, db: Session):
        self.chain = []
        self.pending_transactions = []
        self.load_chain_from_db(db)

        if not self.chain:
            genesis_block = self.create_genesis_block()
            self.chain.append(genesis_block)
            self.save_chain_to_db(db)

    def create_genesis_block(self):
        return self.create_block(0, [], time.time(), "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_transaction(self, transaction):
        self.pending_transactions.append(transaction)

    def mine_pending_transactions(self):
        if not self.pending_transactions:
            return
        new_block = self.create_block(
            index=len(self.chain),
            transactions=self.pending_transactions,
            timestamp=time.time(),
            previous_hash=self.get_latest_block().hash
        )
        self.chain.append(new_block)
        self.pending_transactions = []

    def create_block(self, index, transactions, timestamp, previous_hash):
        return Block(index, transactions, timestamp, previous_hash)

    def is_chain_valid(self, db: Session):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            if current.hash != current.calculate_hash():
                return False

            if current.previous_hash != previous.hash:
                return False

            for tx in current.transactions:
                if "project" in tx:
                    proj_data = tx["project"]
                    project_in_db = db.query(Project).filter(Project.id == proj_data["id"]).first()
                    if not project_in_db:
                        return False
                    if (
                        project_in_db.title != proj_data.get("title") or
                        project_in_db.description != proj_data.get("description") or
                        project_in_db.owner_id != proj_data.get("owner_id") or
                        project_in_db.instructor_id != proj_data.get("instructor_id")
                    ):
                        return False
        return True

    def save_chain_to_db(self, db: Session):
        for block in self.chain:
            if db.query(DBBlock).filter_by(index=block.index).first():
                continue
            db_block = DBBlock(
                index=block.index,
                transactions=block.transactions,
                timestamp=datetime.utcfromtimestamp(block.timestamp),
                previous_hash=block.previous_hash,
                hash=block.hash
            )
            db.add(db_block)
        db.commit()

    def load_chain_from_db(self, db: Session):
        self.chain = []
        blocks = db.query(DBBlock).order_by(DBBlock.index).all()
        for db_block in blocks:
            block = Block(
                index=db_block.index,
                transactions=db_block.transactions,
                timestamp=db_block.timestamp.timestamp(),
                previous_hash=db_block.previous_hash
            )
            block.hash = db_block.hash
            self.chain.append(block)
