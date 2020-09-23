from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()  # app


class User(db.Model):
    id       = db.Column(db.Integer,    primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(15), nullable=False)
    ip       = db.Column(db.String(40), nullable=False)
    remember = db.Column(db.Integer,    nullable=False, default=0)
    # status = db.Column(db.Integer,    nullable=False, default=0)
    role     = db.Column(db.String(10), nullable=False, default="nobody")

    messages = db.relationship("Message", backref="author", lazy=True)
    # user1 = User("kommando", "123", "", "admin")

    def __repr__(self):
        return f"User('{self.username}', '{self.ip}', '{self.role}')"

    def __init__(self, username, password, ip="", role="nobody", remember=0):  # status=0, xp=0
        self.username = username
        self.password = password
        self.ip       = ip
        self.role     = role
        self.remember = remember
        # self.status   = status
        # self.xp       = xp


class Message(db.Model):
    # post = Message(category="General", username="kommando", message="none", user_id=User.query.get(1).id)
    id       = db.Column(db.Integer,    primary_key=True)
    category = db.Column(db.Text,       nullable=False)
    username = db.Column(db.String(15), nullable=False)
    message  = db.Column(db.Text,       nullable=False)
    date     = db.Column(db.Text,       nullable=False, default=datetime.now().strftime('%m-%d %H:%M'))  # db.Date
    # "{:%d-%b-%Y %H:%M}".format(datetime.now())
    user_id  = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f"Message('{self.username}', '{self.date}', '{self.category}', '{self.message}')"

    def __init__(self, category, username, message, user_id):
        self.category = category
        self.username = username
        self.message  = message
        # self.date   = date
        self.user_id  = user_id
