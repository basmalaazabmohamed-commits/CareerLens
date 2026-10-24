import os
import sys
import threading
import time
import webbrowser

# Ensure project root is in Python path regardless of current working directory
project_root = os.path.dirname(os.path.abspath(__file__))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

import uvicorn


def open_browser():
    time.sleep(1.2)
    webbrowser.open("http://127.0.0.1:8000")


if __name__ == "__main__":
    print("=" * 65)
    print("   CareerLens — Complete AI Career Platform")
    print("   Running unified application (Frontend UI + Backend API)")
    print("=" * 65)
    print("   Web Application: http://127.0.0.1:8000")
    print("   Health Check:    http://127.0.0.1:8000/health")
    print("   Swagger API:     http://127.0.0.1:8000/docs")
    print("=" * 65)
    print("   Opening browser at http://127.0.0.1:8000 ...")

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run("api.main:app", host="127.0.0.1", port=8000, reload=False)

