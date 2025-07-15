
# 🛍️ Fullstack E-commerce Store

A fullstack e-commerce web application built using **Django REST Framework** for the backend and **React + Redux Toolkit** for the frontend.

## 🔧 Features

- User Registration & Login (JWT Auth)
- Product Listing and Detail View
- Shopping Cart with Quantity Updates
- Order Placement & History
- Toast Notifications for Feedback
- Responsive UI with Tailwind CSS
- Role-based Navigation (Login/Register/Logout)

## 🗂️ Tech Stack

### Backend (Django)
- Django & Django REST Framework
- Simple JWT for authentication
- PostgreSQL / SQLite (choose your DB)
- CORS support & Swagger docs

### Frontend (React)
- React with Redux Toolkit
- Axios for API calls
- React Router v6
- Tailwind CSS for styling
- React Toastify for notifications

## 🚀 Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend/my-store
npm install
npm run dev
```

## 🔒 Environment Variables

### Backend (`.env`)
```
SECRET_KEY=your_django_secret
DEBUG=True
```
Make sure `.env` is added to `.gitignore`.

### Frontend
API URLs are imported from a central `api.js` file.

## 📁 Project Structure

```
FULLSTACK_APP/
│
├── backend/              # Django project (includes manage.py)
│   ├── venv/
│   ├── requirements.txt
│   └── ...
│
└── frontend/
    └── my-store/         # React project (with src, public, etc.)
```
