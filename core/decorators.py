from functools import wraps
from django.shortcuts import redirect

def login_and_paid_required(view_func):
    """
    Redirects unauthenticated users to the landing page.
    Redirects authenticated-but-unpaid users to the payment modal.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('/?show=login')
        try:
            has_paid = request.user.profile.has_paid
        except Exception:
            has_paid = False
        if not has_paid:
            return redirect('/?show=payment')
        return view_func(request, *args, **kwargs)
    return wrapper