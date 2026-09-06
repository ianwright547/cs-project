"""Minimal local Google/GitHub sign-in test server.

Run with: python3 oauth_test_server.py
Then open: http://localhost:8000
"""

import base64
import hashlib
import hmac
import http.server
import json
import os
import secrets
import urllib.parse
import urllib.request
from http import cookies


def load_env():
    try:
        with open(".env", encoding="utf-8") as env_file:
            for raw_line in env_file:
                line = raw_line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    os.environ.setdefault(key.strip(), value.strip().strip('"\''))
    except FileNotFoundError:
        pass


load_env()
APP_URL = os.getenv("APP_URL", "http://localhost:8000").rstrip("/")
SESSION_SECRET = os.getenv("SESSION_SECRET", "")
sessions = {}
pending_states = {}


def b64(value):
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode()


def signed_session(user):
    payload = b64(json.dumps(user, separators=(",", ":")).encode())
    signature = hmac.new(SESSION_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return f"{payload}.{signature}"


def read_json(url, data=None, headers=None):
    request = urllib.request.Request(url, data=data, headers=headers or {})
    with urllib.request.urlopen(request, timeout=15) as response:
        return json.loads(response.read())


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def send_html(self, html, status=200, extra_headers=None):
        body = html.encode()
        self.send_response(status)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        for key, value in (extra_headers or {}).items():
            self.send_header(key, value)
        self.end_headers()
        self.wfile.write(body)

    def redirect(self, location, cookie=None):
        self.send_response(302)
        self.send_header("Location", location)
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/":
            self.home()
        elif parsed.path == "/login/google":
            self.start_oauth("google")
        elif parsed.path == "/login/github":
            self.start_oauth("github")
        elif parsed.path in ("/auth/google/callback", "/auth/github/callback"):
            self.finish_oauth(parsed)
        elif parsed.path == "/logout":
            self.redirect("/", "session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax")
        else:
            self.send_html("Not found", 404)

    def home(self):
        user = self.current_user()
        if user:
            content = f'''<div class="card"><div class="eyebrow">SIGNED IN</div>
                <h1>Welcome, {user.get("name") or user.get("email") or "there"}.</h1>
                <p class="muted">Provider: {user["provider"]}<br>{user.get("email", "")}</p>
                <a class="secondary" href="/logout">Sign out</a></div>'''
        else:
            content = '''<div class="card"><div class="eyebrow">THRESHOLD</div>
                <h1>Create account<br>or sign in.</h1>
                <p class="muted">Choose a provider to test OAuth login.</p>
                <a class="button google" href="/login/google">Continue with Google</a>
                <a class="button github" href="/login/github">Continue with GitHub</a></div>'''
        self.send_html(f'''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">
            <title>Threshold — Sign in</title><style>
            *{{box-sizing:border-box}}body{{margin:0;background:#101312;color:#f2f0e9;font:16px system-ui,sans-serif;min-height:100vh;display:grid;place-items:center}}
            .card{{width:min(440px,calc(100% - 32px));padding:42px;background:#1b211e;border:1px solid #354039;border-radius:18px;box-shadow:0 20px 60px #0006}}
            .eyebrow{{color:#a7d96b;font-size:12px;letter-spacing:.18em;font-weight:700}}h1{{font-size:42px;line-height:1.03;margin:14px 0 16px;letter-spacing:-.04em}}.muted{{color:#aeb8af;line-height:1.6;margin-bottom:28px}}
            .button,.secondary{{display:block;text-align:center;text-decoration:none;padding:14px 18px;border-radius:9px;margin-top:12px;font-weight:700}}.google{{background:#f2f0e9;color:#151815}}.github{{background:#303a34;color:#fff;border:1px solid #536158}}.secondary{{color:#a7d96b;border:1px solid #536158}}
            </style></head><body>{content}</body></html>''')

    def current_user(self):
        header = self.headers.get("Cookie", "")
        jar = cookies.SimpleCookie(); jar.load(header)
        value = jar.get("session")
        if not value or not SESSION_SECRET:
            return None
        try:
            payload, signature = value.value.split(".", 1)
            expected = hmac.new(SESSION_SECRET.encode(), payload.encode(), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(signature, expected):
                return None
            return json.loads(base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)))
        except (ValueError, json.JSONDecodeError):
            return None

    def start_oauth(self, provider):
        client_id = os.getenv(f"{provider.upper()}_CLIENT_ID")
        if not client_id:
            self.send_html(f"<h2>{provider.title()} is not configured</h2><p>Add {provider.upper()}_CLIENT_ID and {provider.upper()}_CLIENT_SECRET to .env.</p>", 500)
            return
        state = secrets.token_urlsafe(24)
        pending_states[state] = provider
        callback = f"{APP_URL}/auth/{provider}/callback"
        if provider == "google":
            params = {"client_id": client_id, "redirect_uri": callback, "response_type": "code", "scope": "openid email profile", "state": state, "access_type": "offline"}
            url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
        else:
            params = {"client_id": client_id, "redirect_uri": callback, "scope": "read:user user:email", "state": state}
            url = "https://github.com/login/oauth/authorize?" + urllib.parse.urlencode(params)
        self.redirect(url)

    def finish_oauth(self, parsed):
        provider = parsed.path.split("/")[2]
        query = urllib.parse.parse_qs(parsed.query)
        state = query.get("state", [""])[0]
        if pending_states.pop(state, None) != provider:
            self.send_html("<h2>OAuth error</h2><p>Invalid or expired state.</p>", 400); return
        if "error" in query:
            self.send_html("<h2>Sign-in cancelled</h2><p>You can close this page and try again.</p>", 400); return
        code = query.get("code", [""])[0]
        callback = f"{APP_URL}/auth/{provider}/callback"
        try:
            if provider == "google":
                token = read_json("https://oauth2.googleapis.com/token", urllib.parse.urlencode({"code": code, "client_id": os.getenv("GOOGLE_CLIENT_ID"), "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"), "redirect_uri": callback, "grant_type": "authorization_code"}).encode(), {"Content-Type": "application/x-www-form-urlencoded"})
                profile = read_json("https://openidconnect.googleapis.com/v1/userinfo", headers={"Authorization": f"Bearer {token['access_token']}"})
                user = {"provider": "google", "name": profile.get("name"), "email": profile.get("email")}
            else:
                token = read_json("https://github.com/login/oauth/access_token", urllib.parse.urlencode({"code": code, "client_id": os.getenv("GITHUB_CLIENT_ID"), "client_secret": os.getenv("GITHUB_CLIENT_SECRET"), "redirect_uri": callback}).encode(), {"Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded"})
                profile = read_json("https://api.github.com/user", headers={"Authorization": f"Bearer {token['access_token']}", "Accept": "application/vnd.github+json", "User-Agent": "threshold-oauth-test"})
                user = {"provider": "github", "name": profile.get("name") or profile.get("login"), "email": profile.get("email") or ""}
            self.redirect("/", f"session={signed_session(user)}; Path=/; HttpOnly; SameSite=Lax")
        except Exception as error:
            self.send_html(f"<h2>Sign-in failed</h2><p>{type(error).__name__}: {error}</p>", 500)


if __name__ == "__main__":
    if not SESSION_SECRET:
        print("Warning: SESSION_SECRET is missing; add it to .env before signing in.")
    print("Open http://localhost:8000")
    http.server.ThreadingHTTPServer(("localhost", 8000), Handler).serve_forever()
