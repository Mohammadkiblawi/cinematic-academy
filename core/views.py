import json
from decimal import Decimal, InvalidOperation
from django.conf import settings
from django.shortcuts import redirect, render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from .models import Course, Lesson, LessonCompletion, Payment, UserProfile
from . import paypal as pp
from .decorators import login_and_paid_required

def landing(request):
    courses = Course.objects.filter(is_published=True).order_by('order')
    enrolled_ids = []
    if request.user.is_authenticated:
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        enrolled_ids = list(profile.enrolled_courses.values_list('id', flat=True))
    return render(request, 'index.html', {
        'paypal_client_id': settings.PAYPAL_CLIENT_ID,
        'courses': courses,
        'enrolled_ids': enrolled_ids,
    })
    
@login_required
def post_login(request):
    """
    Called by social-auth after every Google login.
    Sends paid users to the dashboard, unpaid users to the payment modal.
    """
    try:
        has_paid = request.user.profile.has_paid
    except Exception:
        has_paid = False

    if has_paid:
        return redirect('dashboard')
    else:
        # Landing page will read ?show=payment and open the modal
        return redirect('/?show=payment')


@login_required
@require_POST
def paypal_create_order(request):
    """Creates a PayPal order for the requested course amount and returns the order ID."""
    try:
        body = json.loads(request.body or '{}')
        course_id = body.get('course_id')
        amount_value = body.get('amount')

        if course_id is not None:
            try:
                course = Course.objects.get(pk=course_id, is_published=True)
            except Course.DoesNotExist:
                return JsonResponse({'error': 'Course not found.'}, status=404)
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            if profile.enrolled_courses.filter(pk=course.id).exists():
                return JsonResponse({'error': 'You have already purchased this course.'}, status=400)
            amount = course.price
            if amount <= 0:
                return JsonResponse({'error': 'Course price is not configured.'}, status=400)
        elif amount_value is not None:
            try:
                amount = Decimal(str(amount_value))
            except (InvalidOperation, TypeError, ValueError):
                return JsonResponse({'error': 'Invalid amount format.'}, status=400)

            if amount <= 0:
                return JsonResponse({'error': 'Amount must be greater than zero.'}, status=400)
        else:
            return JsonResponse({'error': 'Course ID or amount is required.'}, status=400)

        amount_str = f'{amount:.2f}'
        order_id = pp.create_order(amount=amount_str)
        Payment.objects.create(
            user=request.user,
            amount=amount_str,
            paypal_order_id=order_id,
            status='pending',
        )
        return JsonResponse({'order_id': order_id})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_and_paid_required
def dashboard(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    enrolled_courses = profile.enrolled_courses.filter(is_published=True).order_by('order').prefetch_related('lessons')
   #Completed lessons query
    completed_lessons_qs = LessonCompletion.objects.filter(user=request.user)
    lessons_completed = completed_lessons_qs.count()
   #total hours watched
    total_courses = enrolled_courses.count()
    total_hours_seconds = completed_lessons_qs.aggregate(total_seconds=Sum('lesson__duration_seconds'))['total_seconds'] or 0
    hours_watched = int(round(total_hours_seconds / 3600)) if total_hours_seconds else 0
   #certificates earned
    certificate_count = Payment.objects.filter(user=request.user, status='completed').count()
    # Calculate average completion rate across all enrolled courses
    total_courses = enrolled_courses.count()
    if total_courses > 0:
        total_progress = sum(
            course.progress_for(request.user) 
            for course in enrolled_courses
        )
        avg_completion_rate = round(total_progress / total_courses)
    else:
        avg_completion_rate = 0
        #build dashboard courses list
    dashboard_courses = []
    for course in enrolled_courses:
        total_lessons = course.lessons.count()
        completed_lessons = course.lessons.filter(completions__user=request.user).count()
        progress = int(completed_lessons / total_lessons * 100) if total_lessons else 0
        dashboard_courses.append({
            'id': course.id,
            'title': course.title,
            'tag': course.tag,
            'tag_class': course.tag_class,
            'level': course.level,
            'rating': course.rating,
            'rating_count': course.rating_count,
            'students': course.students,
            'hours': course.hours,
            'instructor': course.instructor,
            'thumbnail_url': course.thumbnail.url if course.thumbnail else course.thumbnail_url or course.hero_bg or '',
            'hero_bg': course.hero_bg,
            'price': f'{course.price:.2f}',
            'duration': course.duration,
            'status': course.status,
            'progress': progress,
            'lessons_count': total_lessons,
            'lessons_completed': completed_lessons,
        })

    current_course = None
    if enrolled_courses:
         # FIX: Use the last active course if it exists, otherwise fallback to the first enrolled course
        active_course = profile.last_active_course
        if not active_course:
            active_course = enrolled_courses.first()
            profile.last_active_course = active_course
            profile.save()
            
        course = active_course
        # course = enrolled_courses[0]
        completed_ids = set(
            LessonCompletion.objects.filter(user=request.user, lesson__course=course)
            .values_list('lesson_id', flat=True)
        )
        next_lesson = course.lessons.exclude(id__in=completed_ids).order_by('order').first()
        if not next_lesson:
            next_lesson = course.lessons.order_by('order').last()

        progress = int(
            course.lessons.filter(completions__user=request.user).count() / course.lessons.count() * 100
        ) if course.lessons.count() else 0

        sections = {}
        for lesson in course.lessons.all():
            section_title = lesson.section or 'General'
            sections.setdefault(section_title, []).append(lesson)

        curriculum = []
        next_unlocked = True
        for si, (section_title, lessons) in enumerate(sections.items()):
            lesson_entries = []
            for li, lesson in enumerate(lessons):
                if lesson.id in completed_ids:
                    status = 'done'
                elif next_unlocked:
                    status = 'play'
                    next_unlocked = False
                else:
                    status = 'lock'

                lesson_entries.append({
                    'id': lesson.id,
                    'name': lesson.title,
                    'img': lesson.thumbnail_url or (lesson.thumbnail.url if lesson.thumbnail else ''),
                    'dur': lesson.duration_display,
                    'durSec': lesson.duration_seconds,
                    'status': status,
                    'si': si,
                    'li': li,
                })

            curriculum.append({
                'title': section_title,
                'lessons': lesson_entries,
            })

        # Built ONCE, after the section loop, so it's populated even if
        # `curriculum` ends up with sections but the loop body was skipped
        # for any reason — and never silently overwritten per-iteration.
        current_course = {
            'id': course.id,
            'title': course.title,
            'breadTitle': course.bread_title or course.title,
            'tag': course.tag,
            'tagClass': course.tag_class,
            'thumbnail_url': course.thumbnail.url if course.thumbnail else (course.thumbnail_url or course.hero_bg or ''),
            'thumb': request.build_absolute_uri(course.thumbnail.url) if course.thumbnail else (course.thumbnail_url or course.hero_bg or ''),
            'is_enrolled': True,
            'heroBg': course.hero_bg,
            'hero_bg': course.hero_bg,
            'instructor': course.instructor,
            'progress': progress,
            'current_lesson_title': next_lesson.title if next_lesson else 'Start learning',
            'current_lesson_duration': next_lesson.duration_display if next_lesson else '00:00',
            'curriculum': curriculum,
        }

    return render(request, 'dashboard.html', {
    'user_full_name': request.user.get_full_name() or request.user.username,
    'user_initials': (request.user.first_name[:1] + request.user.last_name[:1]).upper()
                     if (request.user.first_name or request.user.last_name)
                     else request.user.username[:2].upper(),
    'user_avatar_url': profile.avatar.url if profile.avatar else '',
    'dashboard_courses': dashboard_courses,
    'enrolled_course_count': total_courses,
    'completed_lessons': lessons_completed,
    'hours_watched': hours_watched,
    'certificate_count': certificate_count,
    'avg_completion_rate': avg_completion_rate, 
    'overall_progress': int(
        sum(c['progress'] for c in dashboard_courses) / len(dashboard_courses)
    ) if dashboard_courses else 0,
    'current_course': current_course, 
    'current_course_json': json.dumps(current_course),
    # NEW – list of every enrolled course ID
    'enrolled_ids_json': json.dumps(list(profile.enrolled_courses.values_list('id', flat=True))),
})

@login_required
@require_POST
def paypal_capture_order(request):
    """Captures the approved PayPal order and marks the user as paid."""
    try:
        data = json.loads(request.body)
        order_id = data['order_id']
        course_id = data.get('course_id')
        result = pp.capture_order(order_id)

        capture_status = result.get('status')  # 'COMPLETED'

        payment = Payment.objects.get(paypal_order_id=order_id, user=request.user)
        if capture_status == 'COMPLETED':
            payment.status = 'completed'
            payment.save()
            profile, _ = UserProfile.objects.get_or_create(user=request.user)
            profile.has_paid = True
            if course_id is not None:
                try:
                    course = Course.objects.get(pk=course_id, is_published=True)
                    profile.enrolled_courses.add(course)
                except Course.DoesNotExist:
                    pass
            profile.save()
            return JsonResponse({'success': True})
        else:
            payment.status = 'failed'
            payment.save()
            return JsonResponse({'success': False, 'status': capture_status}, status=400)

    except Payment.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)  




def _api_auth_check(request):
    """Returns a JsonResponse error if the user isn't logged in and paid, else None."""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    try:
        if not request.user.profile.has_paid:
            return JsonResponse({'error': 'Payment required'}, status=403)
    except Exception:
        return JsonResponse({'error': 'Payment required'}, status=403)
    return None


def api_courses(request):
    err = _api_auth_check(request)
    if err:
        return err
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    enrolled_ids = set(profile.enrolled_courses.values_list('id', flat=True))

    # FIX: prefetch lessons to optimize the curriculum building loop
    courses = Course.objects.filter(is_published=True).order_by('order').prefetch_related('lessons')
    data = []
    for c in courses:
        completed = c.lessons.filter(completions__user=request.user).count()
        total     = c.lessons.count()
        thumb_url = None
        if c.thumbnail:
            thumb_url = request.build_absolute_uri(c.thumbnail.url)
        elif c.thumbnail_url:
            thumb_url = c.thumbnail_url

        # FIX: Build curriculum for enrolled courses so frontend can render lessons/accordions
        curriculum = []
        if c.id in enrolled_ids:
            completed_ids = set(
                LessonCompletion.objects.filter(user=request.user, lesson__course=c)
                .values_list('lesson_id', flat=True)
            )
            sections = {}
            for lesson in c.lessons.all().order_by('order'):
                sec = lesson.section or 'General'
                sections.setdefault(sec, []).append(lesson)
            
            next_unlocked = True
            for si, (sec_title, lessons) in enumerate(sections.items()):
                lesson_entries = []
                for li, lesson in enumerate(lessons):
                    if lesson.id in completed_ids:
                        status = 'done'
                    elif next_unlocked:
                        status = 'play'
                        next_unlocked = False
                    else:
                        status = 'lock'
                    
                    lesson_thumb = None
                    if lesson.thumbnail:
                        lesson_thumb = request.build_absolute_uri(lesson.thumbnail.url)
                    elif lesson.thumbnail_url:
                        lesson_thumb = lesson.thumbnail_url
                        
                    lesson_entries.append({
                        'id': lesson.id, 
                        'name': lesson.title,
                        'img': lesson_thumb,
                        'dur': lesson.duration_display,
                        'durSec': lesson.duration_seconds,
                        'status': status,
                    })
                curriculum.append({'title': sec_title, 'lessons': lesson_entries})

        data.append({
            'id':               c.id,
            'title':            c.title,
            'breadTitle':       c.bread_title or c.title,
            'description':      c.description,
            'desc':             c.description,
            'tag':              c.tag,
            'tagClass':         c.tag_class,
            'level':            c.level,
            'rating':           c.rating,
            'ratingCount':      c.rating_count,
            'students':         c.students,
            'hours':            c.hours,
            'instructor':       c.instructor,
            'instrInitials':    c.instr_initials,
            'instrAv':          c.instr_av,
            'duration':         c.duration,
            'status':           c.status,
            'thumb':            thumb_url,
            'heroBg':           c.hero_bg,
            'price':            f'{c.price:.2f}',
            'lessons_count':    total,
            'lessons_completed': completed,
            'lessonsCount':     total,
            'lessonsCompleted': completed,
            'totalLessons':     total,
            'progress':         int(completed / total * 100) if total else 0,
            'is_enrolled':      c.id in enrolled_ids,
            'curriculum':       curriculum, # <--- FIX: Include curriculum in API response
        })
    return JsonResponse({'courses': data})

def api_course_detail(request, course_id):
    err = _api_auth_check(request)
    if err:
        return err

    try:
        course = Course.objects.get(pk=course_id, is_published=True)
    except Course.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    completed_ids = set(
        LessonCompletion.objects.filter(
            user=request.user, lesson__course=course
        ).values_list('lesson_id', flat=True)
    )

    # Group lessons by section
    sections = {}
    for lesson in course.lessons.all():
        sec = lesson.section or 'General'
        lesson_thumb = None
        if lesson.thumbnail:
            lesson_thumb = request.build_absolute_uri(lesson.thumbnail.url)
        elif lesson.thumbnail_url:
            lesson_thumb = lesson.thumbnail_url

        sections.setdefault(sec, []).append({
            'id':              lesson.id,
            'title':           lesson.title,
            'duration':        lesson.duration_display,
            'duration_seconds': lesson.duration_seconds,
            'status':          'done' if lesson.id in completed_ids else (
                                'play' if lesson.is_free_preview else 'lock'),
            'thumbnail':       lesson_thumb,
        })

    return JsonResponse({
        'id':          course.id,
        'title':       course.title,
        'description': course.description,
        'curriculum':  [{'title': sec, 'lessons': ls} for sec, ls in sections.items()],
    })


def api_lesson_detail(request, lesson_id):
    err = _api_auth_check(request)
    if err:
        return err

    try:
        lesson = Lesson.objects.select_related('course').get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    thumb_url = None
    if lesson.thumbnail:
        thumb_url = request.build_absolute_uri(lesson.thumbnail.url)
    elif lesson.thumbnail_url:
        thumb_url = lesson.thumbnail_url

    return JsonResponse({
        'id':          lesson.id,
        'title':       lesson.title,
        'description': lesson.description,
        'video_url':   lesson.video_url or (
                       request.build_absolute_uri(lesson.video_file.url)
                       if lesson.video_file else None),
        'duration':    lesson.duration_display,
        'thumbnail':   thumb_url,
        'course':      {'id': lesson.course.id, 'title': lesson.course.title},
    })


@login_and_paid_required
@require_POST
def mark_lesson_complete(request, lesson_id):
    """Marks a lesson as completed for the current user."""
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
        LessonCompletion.objects.get_or_create(user=request.user, lesson=lesson)
        return JsonResponse({'success': True})
    except Lesson.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)
    
@login_and_paid_required
@require_POST
def set_active_course(request, course_id):
    """Updates the user's last active course in the database."""
    try:
        course = Course.objects.get(pk=course_id, is_published=True)
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.last_active_course = course
        profile.save()
        return JsonResponse({'success': True})
    except Course.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)    