# 💪 FitPlan Pro — Gym & Diet Planner System

A **full-stack, production-ready** web application for intelligent, personalized gym and diet planning.

**Stack:** Django · Django REST Framework · React · PostgreSQL · JWT Auth · Recharts

---

## 📁 Project Structure

```
gym_diet_planner/
├── backend/                        # Django REST API
│   ├── gym_diet_planner/           # Core project config
│   │   ├── settings.py             # All settings (JWT, CORS, DB)
│   │   └── urls.py                 # Root URL routing
│   ├── users/                      # Auth & user profiles
│   │   ├── models.py               # CustomUser (BMI, TDEE, goals)
│   │   ├── serializers.py          # Registration, profile, JWT
│   │   ├── views.py                # Register, login, profile, BMI calc
│   │   ├── urls.py                 # Auth endpoints
│   │   ├── admin.py
│   │   └── tests.py                # Unit tests
│   ├── workouts/                   # Workout plans & exercises
│   │   ├── models.py               # Exercise, WorkoutPlan, WorkoutDetail
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── tests.py
│   │   └── management/commands/
│   │       └── seed_exercises.py   # DB seed command
│   ├── diet/                       # Food & diet plans
│   │   ├── models.py               # Food, DietPlan, DietDetail
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── progress/                   # Progress tracking
│   │   ├── models.py               # Progress (weight, measurements)
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
│   ├── plans/                      # Intelligent plan generation
│   │   ├── logic.py                # Core business logic (goal-based plans)
│   │   ├── views.py
│   │   └── urls.py
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/                       # React SPA
    └── src/
        ├── context/
        │   └── AuthContext.js      # Global auth state (JWT)
        ├── services/
        │   └── api.js              # Axios + auto token refresh
        ├── utils/
        │   └── helpers.js          # BMI colors, formatters
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.js       # Responsive nav with user info
        │   │   ├── Layout.js       # Page wrapper
        │   │   └── ProtectedRoute.js
        │   ├── ui/
        │   │   ├── Button.js       # Multi-variant button
        │   │   ├── Card.js         # Card + StatCard
        │   │   ├── Input.js        # Input + Select
        │   │   ├── Badge.js        # Color badges
        │   │   ├── Modal.js        # ESC-closable modal
        │   │   └── LoadingSpinner.js
        │   └── charts/
        │       └── ProgressChart.js # Weight, body fat, calorie, macro charts
        ├── pages/
        │   ├── LoginPage.js        # JWT login
        │   ├── RegisterPage.js     # 3-step wizard
        │   ├── DashboardPage.js    # Overview + quick actions
        │   ├── WorkoutsPage.js     # Weekly plan + exercise library
        │   ├── DietPage.js         # Meal logging + daily summary
        │   ├── ProgressPage.js     # Charts + measurement history
        │   └── ProfilePage.js      # Edit profile + BMI calculator
        ├── App.js                  # Route config
        └── index.css               # Global dark theme
```

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/register/` | Create account + receive tokens | ❌ |
| POST | `/api/login/` | Login + receive tokens | ❌ |
| POST | `/api/logout/` | Blacklist refresh token | ✅ |
| POST | `/api/token/refresh/` | Get new access token | ❌ |
| GET | `/api/profile/` | Get user profile | ✅ |
| PUT | `/api/profile/` | Update profile | ✅ |
| POST | `/api/bmi/` | BMI + calorie calculator | ❌ |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts/` | List all user's plans |
| POST | `/api/workouts/create/` | Create a plan |
| GET/PUT/DELETE | `/api/workouts/<id>/` | Manage specific plan |
| GET | `/api/workouts/exercises/` | Browse exercise library |
| POST | `/api/workouts/detail/add/` | Add exercise to plan |

### Diet
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diet/` | List diet plans (filter by `?date=`) |
| POST | `/api/diet/add/` | Create meal |
| GET/PUT/DELETE | `/api/diet/<id>/` | Manage specific meal |
| GET | `/api/diet/foods/` | Browse food database |
| GET | `/api/diet/summary/?date=YYYY-MM-DD` | Daily calorie breakdown |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/progress/` | List progress entries |
| POST | `/api/progress/add/` | Log new entry |
| GET/PUT/DELETE | `/api/progress/<id>/` | Manage entry |
| GET | `/api/progress/weekly-report/` | Trend analysis |

### Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/plans/generate/workout/` | Generate weekly workout plan |
| POST | `/api/plans/generate/diet/` | Generate daily meal plan |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or SQLite for dev)

---

### Backend Setup

```bash
cd gym_diet_planner/backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env — set USE_SQLITE=True for quick start (no PostgreSQL needed)

# 4. Run migrations
python manage.py migrate

# 5. Seed exercise and food database (32 exercises, 27 foods)
python manage.py seed_exercises

# 6. Create admin user (optional)
python manage.py createsuperuser

# 7. Start server
python manage.py runserver
# API running at http://localhost:8000
# Admin panel at http://localhost:8000/admin
```

### Frontend Setup

```bash
cd gym_diet_planner/frontend

# 1. Install dependencies
npm install

# 2. Configure API URL (default: localhost:8000)
# Edit .env if your backend is elsewhere

# 3. Start dev server
npm start
# App running at http://localhost:3000
```

---

## 🧠 Business Logic

### Workout Plan Generation

| Goal | Strategy | Config |
|------|----------|--------|
| **Fat Loss** | HIIT + Full Body circuits | 3×15 reps, 45s rest |
| **Muscle Gain** | Push/Pull/Legs split | 4×8 reps, 90s rest |
| **Maintain** | Balanced upper/lower | 3×12 reps, 60s rest |

### Calorie Calculation (Mifflin-St Jeor)

```
BMR (Male)   = 10×weight + 6.25×height − 5×age + 5
BMR (Female) = 10×weight + 6.25×height − 5×age − 161

TDEE = BMR × Activity Multiplier
  Sedentary     → ×1.2
  Light         → ×1.375
  Moderate      → ×1.55
  Very Active   → ×1.725
  Extra Active  → ×1.9

Daily Target:
  Fat Loss    = TDEE − 500 kcal
  Muscle Gain = TDEE + 300 kcal
  Maintain    = TDEE
```

### BMI Categories
```
< 18.5  → Underweight
18.5–25 → Normal weight
25–30   → Overweight
≥ 30    → Obese
```

---

## 🔒 Security

- **Passwords** — Django's PBKDF2-SHA256 hashing
- **JWT** — 1-hour access tokens, 7-day refresh tokens with rotation + blacklisting
- **CORS** — Whitelist-only origins via `django-cors-headers`
- **Input Validation** — Serializer-level + model-level validators
- **Protected Routes** — All data endpoints require `IsAuthenticated`
- **SQL Injection** — Django ORM prevents injection by design

---

## 🚀 Deployment

### Backend → Railway / Render

```bash
# 1. Set environment variables in dashboard:
SECRET_KEY=<strong-random-key>
DEBUG=False
USE_SQLITE=False
DB_NAME=<your-db>
DB_USER=<your-user>
DB_PASSWORD=<your-password>
DB_HOST=<your-host>
ALLOWED_HOSTS=your-app.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# 2. Add to settings.py for static files (already included):
#    STATIC_ROOT = BASE_DIR / 'staticfiles'
#    whitenoise middleware

# 3. Procfile (create in backend/)
echo "web: gunicorn gym_diet_planner.wsgi --log-file -" > Procfile

# 4. Post-deploy commands:
python manage.py migrate
python manage.py seed_exercises
python manage.py collectstatic --noinput
```

### Frontend → Vercel / Netlify

```bash
# Vercel
npm i -g vercel
vercel --prod

# Netlify — set build command:
# Build: npm run build
# Publish: build/
# Add: REACT_APP_API_URL = https://your-backend.railway.app/api
```

### PostgreSQL Setup

```sql
-- Local development
CREATE DATABASE gym_diet_planner;
CREATE USER fitplan_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE gym_diet_planner TO fitplan_user;
```

---

## 🧪 Running Tests

```bash
cd backend

# Run all tests
python manage.py test

# Run specific app
python manage.py test users
python manage.py test workouts

# With coverage
pip install coverage
coverage run manage.py test
coverage report
```

**Test coverage includes:**
- User registration with valid/invalid data
- Password mismatch validation
- JWT login flow
- BMI calculation (API + model)
- Workout plan CRUD
- Exercise library access

---

## 📊 Features Summary

| Feature | Status |
|---------|--------|
| JWT Authentication (register/login/logout/refresh) | ✅ |
| Custom User Model (BMI, TDEE, goals) | ✅ |
| Exercise Library (32 exercises) | ✅ |
| Workout Plan CRUD | ✅ |
| Intelligent Plan Generation (goal-based) | ✅ |
| Food Database (27 foods with macros) | ✅ |
| Meal Logging with macros | ✅ |
| Daily Calorie Summary | ✅ |
| Progress Tracking (weight, body fat, measurements) | ✅ |
| Weight Progress Charts (Recharts) | ✅ |
| Body Fat Chart | ✅ |
| Macro Breakdown (visual) | ✅ |
| BMI Calculator | ✅ |
| TDEE & Daily Calorie Calculator | ✅ |
| Weekly Progress Report | ✅ |
| Auto-generated Workout Plans | ✅ |
| Auto-generated Diet Plans | ✅ |
| Protected Routes (React) | ✅ |
| Auto token refresh (Axios interceptor) | ✅ |
| Responsive dark UI | ✅ |
| Admin Panel | ✅ |
| Unit Tests | ✅ |
| PostgreSQL + SQLite support | ✅ |
| Deployment config (Railway + Vercel) | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this for learning and production projects.

---


