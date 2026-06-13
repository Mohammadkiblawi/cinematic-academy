from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user      = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar    = models.ImageField(upload_to='avatars/', blank=True, null=True)
    has_paid  = models.BooleanField(default=False)
    enrolled_courses = models.ManyToManyField('Course', blank=True, related_name='enrolled_users')
    last_active_course = models.ForeignKey('Course', null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


class Course(models.Model):
    title        = models.CharField(max_length=200)
    bread_title  = models.CharField(max_length=200, blank=True)
    description  = models.TextField()
    thumbnail    = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    hero_bg      = models.URLField(blank=True)
    price        = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    order        = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)
    tag          = models.CharField(max_length=50, blank=True)  # e.g. "Cinematography"
    tag_class    = models.CharField(max_length=100, blank=True)
    level        = models.CharField(max_length=50, blank=True)
    rating       = models.CharField(max_length=20, blank=True)
    rating_count = models.CharField(max_length=50, blank=True)
    students     = models.CharField(max_length=100, blank=True)
    hours        = models.CharField(max_length=50, blank=True)
    instructor   = models.CharField(max_length=100, blank=True)
    instr_initials = models.CharField(max_length=10, blank=True)
    instr_av     = models.CharField(max_length=50, blank=True)
    duration     = models.CharField(max_length=50, blank=True)
    status       = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def progress_for(self, user):
        """Returns 0-100 completion percentage for the given user."""
        total = self.lessons.count()
        if total == 0:
            return 0
        done = self.lessons.filter(completions__user=user).count()
        return int(done / total * 100)


class Lesson(models.Model):
    course          = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title           = models.CharField(max_length=200)
    description     = models.TextField(blank=True)
    video_url       = models.URLField(blank=True)
    video_file      = models.FileField(upload_to='videos/', blank=True, null=True)
    thumbnail       = models.ImageField(upload_to='lesson_thumbs/', blank=True, null=True)
    thumbnail_url   = models.URLField(blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    order           = models.PositiveIntegerField(default=0)
    is_free_preview = models.BooleanField(default=False)
    section         = models.CharField(max_length=200, blank=True)  # curriculum section name

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} — {self.title}"

    @property
    def duration_display(self):
        m, s = divmod(self.duration_seconds, 60)
        return f"{m}:{s:02d}"


class LessonCompletion(models.Model):
    """Tracks which lessons a user has completed."""
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson     = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='completions')
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'lesson')

    def __str__(self):
        return f"{self.user.username} ✓ {self.lesson.title}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('completed', 'Completed'),
        ('failed',    'Failed'),
    ]
    user           = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount         = models.DecimalField(max_digits=8, decimal_places=2)
    paypal_order_id = models.CharField(max_length=100, unique=True)
    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — ${self.amount} [{self.status}]"