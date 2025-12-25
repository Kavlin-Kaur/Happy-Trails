"""
Database migration script to add new profile fields to User table
"""
import sqlite3
from datetime import datetime

def migrate_database():
    conn = sqlite3.connect('instance/happytrails.db')
    cursor = conn.cursor()
    
    # List of new columns to add
    new_columns = [
        ('bio', 'TEXT'),
        ('address', 'VARCHAR(200)'),
        ('city', 'VARCHAR(100)'),
        ('state', 'VARCHAR(100)'),
        ('pincode', 'VARCHAR(10)'),
        ('profile_picture', 'VARCHAR(200)', 'default-avatar.png'),
        ('date_of_birth', 'DATE'),
        ('gender', 'VARCHAR(20)'),
        ('created_at', 'DATETIME', datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'))
    ]
    
    # Check existing columns
    cursor.execute("PRAGMA table_info(user)")
    existing_columns = [col[1] for col in cursor.fetchall()]
    print(f"Existing columns: {existing_columns}")
    
    # Add new columns if they don't exist
    for column_info in new_columns:
        column_name = column_info[0]
        column_type = column_info[1]
        default_value = column_info[2] if len(column_info) > 2 else None
        
        if column_name not in existing_columns:
            try:
                if default_value:
                    if column_type in ['VARCHAR(200)', 'VARCHAR(100)', 'VARCHAR(20)', 'VARCHAR(10)', 'TEXT']:
                        cursor.execute(f"ALTER TABLE user ADD COLUMN {column_name} {column_type} DEFAULT '{default_value}'")
                    elif column_type == 'DATETIME':
                        cursor.execute(f"ALTER TABLE user ADD COLUMN {column_name} {column_type} DEFAULT '{default_value}'")
                    else:
                        cursor.execute(f"ALTER TABLE user ADD COLUMN {column_name} {column_type}")
                else:
                    cursor.execute(f"ALTER TABLE user ADD COLUMN {column_name} {column_type}")
                
                print(f"✓ Added column: {column_name}")
            except sqlite3.OperationalError as e:
                print(f"✗ Error adding {column_name}: {e}")
        else:
            print(f"- Column {column_name} already exists")
    
    conn.commit()
    conn.close()
    print("\n✓ Database migration completed successfully!")

if __name__ == '__main__':
    migrate_database()
