from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    # Pages
    path('',           views.landing,   name='landing'),
    path('dashboard/', views.dashboard, name='dashboard'),

    # Auth
    path('auth/post-login/', views.post_login, name='post_login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),

    # Payments
    path('payments/create-order/',  views.paypal_create_order,  name='paypal_create_order'),
    path('payments/capture-order/', views.paypal_capture_order, name='paypal_capture_order'),

    # API
    path('api/courses/',                    views.api_courses,         name='api_courses'),
    path('api/courses/<int:course_id>/',    views.api_course_detail,   name='api_course_detail'),
    path('api/lessons/<int:lesson_id>/',    views.api_lesson_detail,   name='api_lesson_detail'),
    path('api/lessons/<int:lesson_id>/complete/', views.mark_lesson_complete, name='api_lesson_complete'),
    path('api/set-active-course/<int:course_id>/', views.set_active_course, name='set_active_course'),

]