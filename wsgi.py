"""
WSGI entry point for Vercel serverless deployment.
Imports the Flask app and ensures database is initialized.
"""

import os
from app import app, db

# Initialize database on startup
with app.app_context():
    db.create_all()

# Export the app for Vercel
application = app

if __name__ == '__main__':
    application.run()
