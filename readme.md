# The Cinematic Academy

A Django-based e-learning platform for cinematic and filmmaking education — featuring course catalogs, an interactive learning dashboard, lesson video player, progress tracking, and PayPal-based course enrollment.

## Features

- **Course catalog** with categories, instructors, levels, and tags
- **Enrollment & payments** via PayPal integration
- **Interactive dashboard** showing enrolled courses, current lesson, and overall progress
- **Lesson player** with progress tracking, completion marking, and sequential unlocking
- **My Courses** page with filtering (All / In Progress / Completed) and search
- **Lessons Library** aggregating lessons across all enrolled courses
- **Google OAuth** login via `django-allauth`
- Persistent lesson completion stored per user (`LessonCompletion` model)

## Tech Stack

- **Backend:** Django 5.x
- **Auth:** django-allauth (Google OAuth)
- **Payments:** PayPal REST SDK
- **Frontend:** HTML, vanilla JS, CSS (Raycast-inspired dark UI)

## Getting Started

### Prerequisites

- Python 3.11+
- pip / virtualenv

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd cinematic-academy

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

### Environment Variables

Create a `.env` file in the project root with the following:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox

# Google OAuth (django-allauth)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Project Structure

```
cinematic_academy/
├── manage.py
├── requirements.txt
├── .env
├── core/                  # Main Django app
│   ├── models.py          # Course, Lesson, Profile, Payment, LessonCompletion
│   ├── views.py            # Dashboard, course, lesson & API views
│   ├── urls.py
│   ├── paypal.py           # PayPal SDK helper functions
│   ├── templates/
│   │   └── dashboard.html
│   └── static/
│       └── dashboard.js
└── media/                  # User-uploaded course/lesson thumbnails
```

## Key API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/courses/` | GET | List all courses with enrollment & progress info |
| `/api/courses/<id>/` | GET | Course detail including curriculum |
| `/api/lessons/<id>/` | GET | Lesson detail |
| `/api/lessons/<id>/complete/` | POST | Mark a lesson as completed for the current user |
| `/api/paypal/create-order/` | POST | Create a PayPal order for course purchase |
| `/api/paypal/capture-order/` | POST | Capture/complete a PayPal payment |

## Development Notes

- Lesson completion is persisted in the `LessonCompletion` model (`user`, `lesson`) and used to compute per-course progress and unlock the next lesson sequentially.
- The dashboard's "Course Curriculum" panel and progress bars are rebuilt client-side from `/api/courses/` data after page load (`rebuildDashCurriculum()` in `dashboard.js`) so completions reflect immediately without a full reload.
- The **My Courses** page only shows courses where `is_enrolled === true`.

## License

Proprietary — All rights reserved.