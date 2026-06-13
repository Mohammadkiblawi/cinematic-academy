from django.contrib import admin
from .models import Course, Lesson, Payment, UserProfile


class LessonInline(admin.TabularInline):
    model   = Lesson
    extra   = 1
    fields  = ('order', 'title', 'section', 'duration_seconds', 'is_free_preview', 'video_url')
    ordering = ('order',)


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ('title', 'tag', 'order', 'is_published')
    list_editable = ('order', 'is_published')
    list_filter   = ('is_published', 'tag')
    search_fields = ('title', 'description')
    inlines       = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display  = ('title', 'course', 'section', 'order', 'is_free_preview')
    list_filter   = ('course', 'is_free_preview')
    search_fields = ('title', 'course__title')
    ordering      = ('course', 'order')


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ('user', 'amount', 'paypal_order_id', 'status', 'created_at')
    list_filter   = ('status',)
    search_fields = ('user__username', 'paypal_order_id')
    readonly_fields = ('paypal_order_id', 'created_at')
    actions       = ['mark_completed']

    @admin.action(description='Mark selected payments as completed')
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        for payment in queryset:
            profile, _ = payment.user.profile.__class__.objects.get_or_create(user=payment.user)
            profile.has_paid = True
            profile.save()
        self.message_user(request, f'{updated} payment(s) marked as completed.')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display  = ('user', 'has_paid', 'created_at')
    list_filter   = ('has_paid',)
    search_fields = ('user__username', 'user__email')
    list_editable = ('has_paid',)