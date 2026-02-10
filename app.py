import os
import sqlite3
import hashlib
import secrets
from datetime import datetime, timedelta

from flask import Flask, render_template, request, redirect, url_for, session, flash, g

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(APP_ROOT, "subio.db")

app = Flask(__name__)
app.secret_key = os.environ.get("SUBIO_SECRET", secrets.token_hex(16))


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db():
    db = get_db()
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            avatar TEXT,
            plan TEXT DEFAULT 'Free',
            status TEXT DEFAULT 'Inactive',
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS subscriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            plan TEXT NOT NULL,
            price INTEGER NOT NULL,
            status TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            method TEXT NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL,
            subscription_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(subscription_id) REFERENCES subscriptions(id)
        );

        CREATE TABLE IF NOT EXISTS reset_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        """
    )
    db.commit()


def hash_password(password):
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120000)
    return f"{salt}${digest.hex()}"


def verify_password(password, stored):
    try:
        salt, digest = stored.split("$")
    except ValueError:
        return False
    check = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 120000)
    return check.hex() == digest


def login_required(view):
    def wrapped(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)

    wrapped.__name__ = view.__name__
    return wrapped


def get_user_by_email(email):
    db = get_db()
    return db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()


def get_user(user_id):
    db = get_db()
    return db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()


def get_user_subscriptions(user_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY start_date DESC", (user_id,)
    ).fetchall()


def get_user_payments(user_id):
    db = get_db()
    return db.execute(
        "SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC", (user_id,)
    ).fetchall()


@app.before_request
def ensure_csrf():
    if "csrf_token" not in session:
        session["csrf_token"] = secrets.token_hex(16)


@app.context_processor
def inject_globals():
    return {"csrf_token": session.get("csrf_token"), "user": get_user(session["user_id"]) if "user_id" in session else None}


def validate_csrf():
    token = request.form.get("csrf_token")
    return token and token == session.get("csrf_token")


@app.route("/")
def index():
    if "user_id" in session:
        return redirect(url_for("dashboard"))
    return redirect(url_for("login"))


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        if not validate_csrf():
            flash("Invalid session token.", "error")
            return redirect(url_for("register"))

        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")
        avatar = request.form.get("avatar", "").strip()

        if len(password) < 6:
            flash("Password must be at least 6 characters.", "error")
            return redirect(url_for("register"))
        if password != confirm:
            flash("Passwords do not match.", "error")
            return redirect(url_for("register"))
        if get_user_by_email(email):
            flash("Email already exists.", "error")
            return redirect(url_for("register"))

        db = get_db()
        db.execute(
            "INSERT INTO users (email, name, password_hash, avatar, created_at) VALUES (?, ?, ?, ?, ?)",
            (email, name, hash_password(password), avatar or None, datetime.utcnow().isoformat()),
        )
        db.commit()
        user = get_user_by_email(email)
        session["user_id"] = user["id"]
        flash("Account created successfully.", "success")
        return redirect(url_for("dashboard"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if not validate_csrf():
            flash("Invalid session token.", "error")
            return redirect(url_for("login"))

        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        user = get_user_by_email(email)
        if not user or not verify_password(password, user["password_hash"]):
            flash("Invalid email or password.", "error")
            return redirect(url_for("login"))
        session["user_id"] = user["id"]
        flash("Welcome back!", "success")
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    flash("You have been logged out.", "info")
    return redirect(url_for("login"))


@app.route("/reset", methods=["GET", "POST"])
def reset_request():
    if request.method == "POST":
        if not validate_csrf():
            flash("Invalid session token.", "error")
            return redirect(url_for("reset_request"))

        email = request.form.get("email", "").strip().lower()
        user = get_user_by_email(email)
        if not user:
            flash("Email not found.", "error")
            return redirect(url_for("reset_request"))
        token = secrets.token_urlsafe(24)
        expires = datetime.utcnow() + timedelta(hours=1)
        db = get_db()
        db.execute(
            "INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
            (user["id"], token, expires.isoformat()),
        )
        db.commit()
        reset_link = url_for("reset_confirm", token=token, _external=True)
        flash(f"Password reset link: {reset_link}", "info")
        return redirect(url_for("login"))

    return render_template("reset_request.html")


@app.route("/reset/<token>", methods=["GET", "POST"])
def reset_confirm(token):
    db = get_db()
    record = db.execute("SELECT * FROM reset_tokens WHERE token = ?", (token,)).fetchone()
    if not record:
        flash("Invalid or expired token.", "error")
        return redirect(url_for("reset_request"))
    expires = datetime.fromisoformat(record["expires_at"])
    if datetime.utcnow() > expires:
        flash("Token expired.", "error")
        return redirect(url_for("reset_request"))

    if request.method == "POST":
        if not validate_csrf():
            flash("Invalid session token.", "error")
            return redirect(url_for("reset_confirm", token=token))
        password = request.form.get("password", "")
        confirm = request.form.get("confirm", "")
        if len(password) < 6:
            flash("Password must be at least 6 characters.", "error")
            return redirect(url_for("reset_confirm", token=token))
        if password != confirm:
            flash("Passwords do not match.", "error")
            return redirect(url_for("reset_confirm", token=token))
        db.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (hash_password(password), record["user_id"]),
        )
        db.execute("DELETE FROM reset_tokens WHERE token = ?", (token,))
        db.commit()
        flash("Password updated.", "success")
        return redirect(url_for("login"))

    return render_template("reset_confirm.html", token=token)


@app.route("/dashboard")
@login_required
def dashboard():
    user = get_user(session["user_id"])
    subscriptions = get_user_subscriptions(user["id"])
    payments = get_user_payments(user["id"])
    return render_template("dashboard.html", subscriptions=subscriptions, payments=payments)


@app.route("/profile", methods=["GET", "POST"])
@login_required
def profile():
    user = get_user(session["user_id"])
    if request.method == "POST":
        if not validate_csrf():
            flash("Invalid session token.", "error")
            return redirect(url_for("profile"))
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        avatar = request.form.get("avatar", "").strip()
        db = get_db()
        db.execute(
            "UPDATE users SET name = ?, email = ?, avatar = ? WHERE id = ?",
            (name, email, avatar or None, user["id"]),
        )
        db.commit()
        flash("Profile updated.", "success")
        return redirect(url_for("profile"))
    subscriptions = get_user_subscriptions(user["id"])
    return render_template("profile.html", subscriptions=subscriptions)


@app.route("/profile/password", methods=["POST"])
@login_required
def profile_password():
    if not validate_csrf():
        flash("Invalid session token.", "error")
        return redirect(url_for("profile"))
    password = request.form.get("password", "")
    confirm = request.form.get("confirm", "")
    if password != confirm or len(password) < 6:
        flash("Password validation failed.", "error")
        return redirect(url_for("profile"))
    db = get_db()
    db.execute(
        "UPDATE users SET password_hash = ? WHERE id = ?",
        (hash_password(password), session["user_id"]),
    )
    db.commit()
    flash("Password updated.", "success")
    return redirect(url_for("profile"))


@app.route("/subscriptions", methods=["GET", "POST"])
@login_required
def subscriptions():
    user = get_user(session["user_id"])
    plans = [
        {"name": "Basic", "price": 9},
        {"name": "Pro", "price": 19},
        {"name": "Premium", "price": 49},
    ]
    if request.method == "POST":
        if not validate_csrf():
            flash("Invalid session token.", "error")
            return redirect(url_for("subscriptions"))
        plan = request.form.get("plan")
        method = request.form.get("method", "Stripe")
        price = next((p["price"] for p in plans if p["name"] == plan), 9)
        start = datetime.utcnow()
        end = start + timedelta(days=30)
        db = get_db()
        cursor = db.execute(
            "INSERT INTO subscriptions (user_id, plan, price, status, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)",
            (user["id"], plan, price, "Active", start.isoformat(), end.isoformat()),
        )
        subscription_id = cursor.lastrowid
        db.execute(
            "INSERT INTO payments (user_id, amount, method, status, created_at, subscription_id) VALUES (?, ?, ?, ?, ?, ?)",
            (user["id"], price, method, "Paid", datetime.utcnow().isoformat(), subscription_id),
        )
        db.execute(
            "UPDATE users SET plan = ?, status = ? WHERE id = ?",
            (plan, "Active", user["id"]),
        )
        db.commit()
        flash(f"{plan} subscription activated.", "success")
        return redirect(url_for("subscriptions"))

    subscriptions = get_user_subscriptions(user["id"])
    payments = get_user_payments(user["id"])
    return render_template(
        "subscriptions.html", plans=plans, subscriptions=subscriptions, payments=payments
    )


if __name__ == "__main__":
    os.makedirs(APP_ROOT, exist_ok=True)
    with app.app_context():
        init_db()
    app.run(debug=True)
