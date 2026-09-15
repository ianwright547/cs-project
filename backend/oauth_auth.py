"""Reusable Google and GitHub OAuth helpers for the future Code Practice app.

The temporary test page in ``oauth_test_server.py`` uses the same provider
endpoints. Import these helpers when the real frontend/backend are ready.
"""

import base64
import hashlib
import hmac
import json
import os
import urllib.parse
import urllib.request


PROVIDERS = {
    "google": {
        "authorize": "https://accounts.google.com/o/oauth2/v2/auth",
        "token": "https://oauth2.googleapis.com/token",
        "profile": "https://openidconnect.googleapis.com/v1/userinfo",
        "scope": "openid email profile",
    },
    "github": {
        "authorize": "https://github.com/login/oauth/authorize",
        "token": "https://github.com/login/oauth/access_token",
        "profile": "https://api.github.com/user",
        "scope": "read:user user:email",
    },
}


def authorization_url(provider, state, app_url):
    """Return the provider login URL and the callback path used by the app."""
    if provider not in PROVIDERS:
        raise ValueError(f"Unsupported OAuth provider: {provider}")
    callback = f"{app_url.rstrip('/')}/auth/{provider}/callback"
    params = {
        "client_id": os.environ[f"{provider.upper()}_CLIENT_ID"],
        "redirect_uri": callback,
        "response_type": "code",
        "scope": PROVIDERS[provider]["scope"],
        "state": state,
    }
    if provider == "google":
        params["access_type"] = "offline"
    return PROVIDERS[provider]["authorize"] + "?" + urllib.parse.urlencode(params)


def exchange_code(provider, code, app_url):
    """Exchange a callback code and return normalized user information."""
    callback = f"{app_url.rstrip('/')}/auth/{provider}/callback"
    form = urllib.parse.urlencode({
        "code": code,
        "client_id": os.environ[f"{provider.upper()}_CLIENT_ID"],
        "client_secret": os.environ[f"{provider.upper()}_CLIENT_SECRET"],
        "redirect_uri": callback,
        "grant_type": "authorization_code",
    }).encode()
    request = urllib.request.Request(PROVIDERS[provider]["token"], data=form, headers={"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(request, timeout=15) as response:
        token = json.loads(response.read())
    profile_request = urllib.request.Request(PROVIDERS[provider]["profile"], headers={"Authorization": f"Bearer {token['access_token']}", "Accept": "application/json", "User-Agent": "code-practice-oauth"})
    with urllib.request.urlopen(profile_request, timeout=15) as response:
        profile = json.loads(response.read())
    provider_subject = profile.get("sub") or profile.get("id")
    return {
        "provider": provider,
        "provider_subject": str(provider_subject) if provider_subject is not None else None,
        "name": profile.get("name") or profile.get("login"),
        "email": profile.get("email", ""),
        "github_username": profile.get("login") if provider == "github" else None,
    }


def sign_session(user, session_secret):
    payload = base64.urlsafe_b64encode(json.dumps(user, separators=(",", ":")).encode()).rstrip(b"=").decode()
    signature = hmac.new(session_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{signature}"


def verify_session(value, session_secret):
    """Return session data or None when the signed cookie is invalid."""
    try:
        payload, signature = value.split(".", 1)
        expected = hmac.new(session_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        return json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
    except (ValueError, json.JSONDecodeError):
        return None
