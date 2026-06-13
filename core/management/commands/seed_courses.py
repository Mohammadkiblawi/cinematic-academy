import json
from pathlib import Path

from django.core.management.base import BaseCommand

from core.models import Course, Lesson


class Command(BaseCommand):
    help = 'Seed Course and Lesson data from core/seed_data/courses.json'

    def handle(self, *args, **options):
        data_path = Path(__file__).resolve().parents[2] / 'seed_data' / 'courses.json'
        if not data_path.exists():
            self.stderr.write(self.style.ERROR(f'Missing seed file: {data_path}'))
            return

        with open(data_path, encoding='utf-8') as f:
            courses = json.load(f)

        for course_index, course_data in enumerate(courses):
            course_obj, created = Course.objects.update_or_create(
                title=course_data['title'],
                defaults={
                    'bread_title': course_data.get('breadTitle', course_data['title']),
                    'description': course_data.get('description', course_data.get('desc', '')),
                    'tag': course_data.get('tag', ''),
                    'tag_class': course_data.get('tagClass', ''),
                    'level': course_data.get('level', ''),
                    'rating': course_data.get('rating', ''),
                    'rating_count': course_data.get('ratingCount', ''),
                    'students': course_data.get('students', ''),
                    'hours': course_data.get('hours', ''),
                    'instructor': course_data.get('instructor', ''),
                    'instr_initials': course_data.get('instrInitials', ''),
                    'instr_av': course_data.get('instrAv', ''),
                    'duration': course_data.get('duration', ''),
                    'status': course_data.get('status', ''),
                    'hero_bg': course_data.get('heroBg', ''),
                    'thumbnail_url': course_data.get('thumb', ''),
                    'price': course_data.get('price', 0),
                    'order': course_data.get('order', course_index),
                    'is_published': course_data.get('is_published', True),
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Course: {course_obj.title}'))
            else:
                self.stdout.write(self.style.WARNING(f'Updated Course: {course_obj.title}'))

            lesson_count = 0
            for section_index, section_data in enumerate(course_data.get('curriculum', [])):
                section_name = section_data.get('section', section_data.get('title', ''))
                for lesson_index, lesson_data in enumerate(section_data.get('lessons', [])):
                    defaults = {
                        'description': lesson_data.get('description', ''),
                        'video_url': lesson_data.get('video_url', lesson_data.get('img', '')),
                        'thumbnail_url': lesson_data.get('img', ''),
                        'duration_seconds': lesson_data.get('durSec', lesson_data.get('duration_seconds', 0)),
                        'order': lesson_index,
                        'section': section_name,
                        'is_free_preview': lesson_data.get('status') == 'play',
                    }
                    lesson_obj, lesson_created = Lesson.objects.update_or_create(
                        course=course_obj,
                        title=lesson_data['name'],
                        defaults=defaults,
                    )
                    lesson_count += 1
                    if lesson_created:
                        self.stdout.write(self.style.SUCCESS(f'  Created Lesson: {lesson_obj.title}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'  Updated Lesson: {lesson_obj.title}'))

            self.stdout.write(self.style.NOTICE(f'  Total lessons for "{course_obj.title}": {lesson_count}'))

        self.stdout.write(self.style.SUCCESS('Course seeding complete.'))
