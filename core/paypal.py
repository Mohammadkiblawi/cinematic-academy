import requests
from django.conf import settings


def _get_access_token():
    base = (
        'https://api-m.sandbox.paypal.com'
        if settings.PAYPAL_MODE == 'sandbox'
        else 'https://api-m.paypal.com'
    )
    r = requests.post(
        f'{base}/v1/oauth2/token',
        auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET),
        data={'grant_type': 'client_credentials'},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()['access_token'], base


def create_order(amount='97.00', currency='USD'):
    token, base = _get_access_token()
    r = requests.post(
        f'{base}/v2/checkout/orders',
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        json={
            'intent': 'CAPTURE',
            'purchase_units': [{
                'amount': {'currency_code': currency, 'value': amount}
            }]
        },
        timeout=10,
    )
    r.raise_for_status()
    return r.json()['id']   # PayPal order ID


def capture_order(order_id):
    token, base = _get_access_token()
    r = requests.post(
        f'{base}/v2/checkout/orders/{order_id}/capture',
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        timeout=10,
    )
    r.raise_for_status()
    return r.json()