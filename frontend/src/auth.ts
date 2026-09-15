export type AuthIdentity = { provider: string; github_username?: string | null };
export type AuthUser = {
  id: string;
  display_name: string;
  email: string | null;
  created_at: string | null;
  identities: AuthIdentity[];
};

export async function fetchMe(): Promise<AuthUser | null> {
  const response = await fetch('/api/me', { credentials: 'same-origin' });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error('Could not load account');
  return response.json() as Promise<AuthUser>;
}

export async function updateMe(display_name: string): Promise<AuthUser> {
  const response = await fetch('/api/me', {
    method: 'PATCH', credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ display_name }),
  });
  if (!response.ok) throw new Error('Could not save profile');
  return response.json() as Promise<AuthUser>;
}

export async function logout(): Promise<void> {
  const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  if (!response.ok) throw new Error('Could not sign out');
}
