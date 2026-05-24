# 🫁 PneumoScan — AI-Powered Pneumonia Detection

> A full-stack web application that uses a deep learning CNN model to detect pneumonia from chest X-ray images, classify it as **Normal**, **Bacterial**, or **Viral** pneumonia, and generate **Grad-CAM heatmaps** to visually explain the AI's decision.

---

## 📸 Features

- 🔬 **3-class pneumonia classification** — Normal / Bacterial Pneumonia / Viral Pneumonia
- 🌡️ **Grad-CAM heatmap visualization** — see exactly which lung regions the AI focused on
- 📊 **Interactive heatmap viewer** — toggle between Original, AI Focus, and Overlay modes with an opacity slider
- 📈 **Confidence gauge** — animated circular progress showing prediction confidence
- 📄 **PDF report generation** — download a formatted report of the analysis
- 📷 **Camera capture** — take a photo directly in the browser
- 🔐 **JWT authentication** — register/login with secure HttpOnly cookie-based sessions
- 📜 **Scan history** — logged-in users can view past scans
- 🌍 **Internationalization (i18n)** — multi-language support via react-i18next
- 🌙 **Dark / Light mode** — system-aware theme toggle
- 📱 **Fully responsive** — works on mobile and desktop

---

## 🏗️ Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | [FastAPI](https://fastapi.tiangolo.com/) |
| Server | Uvicorn (ASGI) |
| ML Model | TensorFlow / Keras — MobileNetV2 CNN |
| Explainability | Grad-CAM (Gradient-weighted Class Activation Mapping) |
| Database | SQLAlchemy ORM + SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT tokens (python-jose) + bcrypt password hashing |
| Image Processing | Pillow, OpenCV, NumPy, Matplotlib |

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 + shadcn/ui components |
| Animations | Framer Motion |
| HTTP Client | Axios (via Vite dev proxy) |
| State / Data | TanStack React Query |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| PDF Export | jsPDF + html2canvas |

---

## 📁 Project Structure

```
Pneumonia_app/
├── backend/                        # FastAPI Python backend
│   ├── app/
│   │   ├── main.py                 # App entry point, CORS, router registration
│   │   ├── config.py               # Settings via pydantic-settings + .env
│   │   ├── database.py             # SQLAlchemy engine + session
│   │   ├── deps.py                 # Dependency injection (DB, auth)
│   │   ├── core/
│   │   │   └── security.py         # JWT encode/decode, password hashing
│   │   ├── ml/
│   │   │   ├── predict.py          # Inference + Grad-CAM heatmap generation
│   │   │   └── chest_xray_cnn_model.keras   # Trained MobileNetV2 model (11 MB)
│   │   ├── models/
│   │   │   ├── user.py             # User SQLAlchemy model
│   │   │   └── scan.py             # Scan SQLAlchemy model
│   │   ├── routers/
│   │   │   ├── auth.py             # /auth/register, /login, /logout, /me
│   │   │   └── scan.py             # /scan/predict, /scan/predict/save, /scan/history
│   │   ├── schemas/
│   │   │   ├── user.py             # Pydantic schemas for User
│   │   │   └── scan.py             # Pydantic schemas for Scan
│   │   ├── services/
│   │   │   ├── auth_service.py     # User creation, authentication logic
│   │   │   └── scan_service.py     # Scan CRUD operations
│   │   └── utils/
│   │       ├── image_filter.py     # Grayscale X-ray validator
│   │       └── storage.py          # Local file upload handler
│   ├── requirements.txt
│   ├── test_db.py                  # DB connection + table creation test
│   └── test_script.py              # ML prediction smoke test
│
└── frontend/                       # React + TypeScript frontend
    ├── src/
    │   ├── api/
    │   │   ├── apiClient.ts        # Axios instance (uses Vite proxy /api)
    │   │   └── scanApi.ts          # analyzeImageApi() function
    │   ├── components/
    │   │   ├── HeatmapVisualization.tsx   # Grad-CAM viewer (tabs, slider, legend)
    │   │   ├── ConfidenceGauge.tsx        # Animated circular confidence display
    │   │   ├── ConfidenceAlert.tsx        # Low/high confidence banner
    │   │   ├── StepProgress.tsx           # Upload → Analyze → Result → Report
    │   │   ├── Loader.tsx                 # Animated scanning loader
    │   │   ├── ModelInfoModal.tsx         # Modal with model architecture info
    │   │   ├── CameraCapture.tsx          # Browser webcam capture
    │   │   ├── Navbar.tsx                 # Top navigation bar
    │   │   └── Footer.tsx
    │   ├── pages/
    │   │   ├── Home.tsx            # Landing / hero page
    │   │   ├── Upload.tsx          # Main scan upload + analysis page
    │   │   ├── About.tsx           # Project & model info page
    │   │   ├── History.tsx         # Past scan history (requires login)
    │   │   ├── Dashboard.tsx       # User dashboard with charts
    │   │   └── Auth.tsx            # Login / register forms
    │   ├── contexts/
    │   │   ├── AuthContext.tsx      # Global auth state (Supabase + local JWT)
    │   │   └── ThemeContext.tsx     # Dark/light theme context
    │   └── utils/
    │       └── reportGenerator.ts  # PDF report generation
    ├── vite.config.ts              # Vite config with /api → backend proxy
    └── package.json
```

---

## 🧠 How the AI Works

### Model Architecture
The model is a fine-tuned **MobileNetV2** pretrained on ImageNet, with a custom classification head:

```
MobileNetV2 (frozen base)
    ↓
GlobalAveragePooling2D
    ↓
Dense(128, activation='relu')
    ↓
Dropout(0.3)
    ↓
Dense(3, activation='softmax')   ← [NORMAL, BACTERIAL, VIRAL]
```

- **Input size:** 150 × 150 × 3 (RGB)
- **Total parameters:** ~2.75M (164K trainable)
- **Output:** softmax probabilities over 3 classes
- **Confidence threshold:** 0.60 — predictions below this are labeled *"Uncertain / Unknown"*

### Grad-CAM Explainability
After prediction, [Gradient-weighted Class Activation Mapping (Grad-CAM)](https://arxiv.org/abs/1610.02391) is applied:

1. Gradients of the top predicted class are computed with respect to the **Conv_1** layer output
2. Gradients are pooled to get channel importance weights
3. A weighted sum of feature maps produces the heatmap
4. The heatmap is upsampled and overlaid on the original X-ray using a **jet colormap**

| Color | Meaning |
|---|---|
| 🔴 Red / Hot | Regions most critical to the prediction |
| 🟡 Yellow / Warm | Moderately influential regions |
| 🔵 Blue / Cool | Background regions largely ignored |

> Heatmaps are generated for **all predictions** including Normal — helping radiologists confirm which regions drove the result.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Sharanya735/Pneumonia_app.git
cd Pneumonia_app
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create your environment file
# Copy the template below and fill in your values
```

Create `backend/.env`:
```env
DATABASE_URL=sqlite:///./pneumonia.db
SECRET_KEY=your_very_long_and_random_secret_key_here
```

> **PostgreSQL (production):** Replace `DATABASE_URL` with:
> `postgresql://username:password@localhost:5432/pneumonia_db`

```bash
# Verify DB connection and create tables
python test_db.py

# Start the backend server
python -m uvicorn app.main:app --port 8000 --reload
```

Backend will be running at: **http://127.0.0.1:8000**  
Interactive API docs: **http://127.0.0.1:8000/docs**

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start the dev server
npm run dev
```

Frontend will be running at: **http://localhost:8080**

> The Vite dev server automatically proxies `/api/*` requests to the FastAPI backend at `http://127.0.0.1:8000` — no CORS configuration needed in development.

---

## 🔌 API Reference

### Authentication — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user, returns JWT |
| `POST` | `/auth/login` | Login with email + password, returns JWT |
| `POST` | `/auth/logout` | Clear auth cookies |
| `GET` | `/auth/me` | Get current logged-in user info |

### Scan — `/scan`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/scan/predict` | ❌ Public | Upload X-ray image, get prediction + Grad-CAM heatmap |
| `POST` | `/scan/predict/save` | ✅ Required | Predict and save result to user's history |
| `GET` | `/scan/history` | ✅ Required | Get all past scans for logged-in user |

#### Example: `/scan/predict` response
```json
{
  "prediction": "NORMAL",
  "confidence": 0.8732,
  "probabilities": [0.8732, 0.0841, 0.0427],
  "heatmap": "<base64-encoded JPEG string>"
}
```

---

## 🗄️ Database Schema

### `users` table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `name` | VARCHAR | Display name |
| `email` | VARCHAR UNIQUE | Login email |
| `password` | VARCHAR | bcrypt hashed |
| `role` | ENUM | `user` \| `admin` |
| `created_at` | DATETIME | Registration timestamp |

### `scans` table
| Column | Type | Description |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `user_id` | INTEGER FK | References `users.id` (nullable for anonymous) |
| `image_path` | VARCHAR | Local path to saved X-ray |
| `prediction` | VARCHAR | `NORMAL` / `BACTERIAL` / `VIRAL` / `Uncertain / Unknown` |
| `confidence` | FLOAT | Softmax confidence (0–1) |
| `raw_probs` | TEXT | JSON string of all 3 class probabilities |
| `created_at` | DATETIME | Scan timestamp |

---

## ⚙️ Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✅ | — | SQLAlchemy DB connection string |
| `SECRET_KEY` | ✅ | — | JWT signing key (use a long random string) |
| `ALGORITHM` | ❌ | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | ❌ | `15` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_MINUTES` | ❌ | `10080` (7 days) | Refresh token lifetime |
| `UPLOAD_DIR` | ❌ | `backend/uploads/scans` | Directory for saved X-ray files |
| `MODEL_PATH` | ❌ | `backend/ml/chest_xray_cnn_model.keras` | Path to the Keras model |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** before storing
- JWTs are stored in **HttpOnly cookies** (not accessible via JavaScript)
- The `.env` file is excluded from Git via `.gitignore` — **never commit secrets**
- For production, set `secure=True` on cookies and serve over HTTPS

---

## 🛠️ Development Scripts

### Backend
```bash
# Run DB connection test
python test_db.py

# Run prediction smoke test (requires an image in temp_test/)
python test_script.py

# Check model architecture
python check_model.py
```

### Frontend
```bash
npm run dev       # Start dev server (port 8080)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 📊 Model Performance

The CNN model was trained on the [Kaggle Chest X-Ray Images (Pneumonia)](https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia) dataset:
- ~5,800 training images across 3 classes
- Transfer learning from MobileNetV2 (ImageNet weights)
- Only the top classification head was fine-tuned

---

## 📄 License

This project is for **educational / research purposes**. Not intended for clinical medical diagnosis.

---

## 👩‍💻 Author

**Sharanya** — [github.com/Sharanya735](https://github.com/Sharanya735)