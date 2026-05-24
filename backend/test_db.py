# backend/test_db.py
import sys
from sqlalchemy.exc import OperationalError, ProgrammingError
from sqlalchemy import inspect # Used to check if tables exist

print("--- Database Connection Test ---")

# --- 1. Import App Components ---
try:
    print("Importing database engine and Base...")
    # This also loads your .env file because config.py is imported by database.py
    from app.database import engine, Base
    
    print("Importing models (User, Scan)...")
    # This is critical so that Base.metadata knows what tables to create
    from app.models import user, scan
    
    print(f"Models {user.User.__tablename__} and {scan.Scan.__tablename__} are registered with Base.")
    print(f"Connecting to database: {str(engine.url).split('@')[-1]}") # Hides password
    
except ImportError as e:
    print(f"\n[FATAL ERROR] Could not import app components: {e}")
    print("Please make sure you are running this script from the 'backend' folder.")
    sys.exit()
except Exception as e:
    print(f"\n[FATAL ERROR] An unexpected error occurred during import: {e}")
    sys.exit()

# --- 2. Test Connection and Create Tables ---
try:
    with engine.connect() as connection:
        print("\n[SUCCESS] Successfully connected to the database!")
        
        print("\nAttempting to create all tables...")
        # This is the same command from your main.py
        Base.metadata.create_all(bind=engine)
        print("[SUCCESS] Tables create command executed.")
        
        # --- 3. Verify Table Creation ---
        print("\nVerifying table creation...")
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if "users" in tables and "scans" in tables:
            print("[SUCCESS] 'users' and 'scans' tables are confirmed to exist in the database.")
            print("\nTest passed! Your connection and permissions are correct.")
        else:
            print(f"\n[WARNING] Tables not found. Found: {tables}")
            print("This could mean the user has permission to connect, but not to CREATE.")

except OperationalError as e:
    print("\n--- [ TEST FAILED: Connection Error ] ---")
    print("Could not connect to the database. This is almost always a problem with your .env file (DATABASE_URL).")
    print("Please check:")
    print("  1. Host (e.g., 'localhost')")
    print("  2. Port (e.g., '5432')")
    print("  3. Database name (does it exist in pgAdmin?)")
    print("  4. Username and Password")
    print(f"\nError Details: {e}")

except ProgrammingError as e:
    print("\n--- [ TEST FAILED: Permission or Database Error ] ---")
    print("Connected, but an error occurred. This is often a permissions issue or the database doesn't exist.")
    print("  1. Does the database in your DATABASE_URL actually exist?")
    print("  2. Does your user have 'CREATE' permissions on this database?")
    print(f"\nError Details: {e}")

except Exception as e:
    print(f"\n--- [ TEST FAILED: An Unexpected Error Occurred ] ---")
    print(f"Error Details: {e}")