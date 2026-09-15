import { FormEvent, useEffect, useState } from 'react';
import { fetchMe, logout, updateMe, type AuthUser } from '../auth';
import { applyMotionPreference, readPreference, writePreference } from '../preferences';

export function LoginPage() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    fetchMe().then(user => { if (user) window.location.replace('/profile.html'); }).catch(() => setMessage('Account service is unavailable right now.'));
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) setMessage('Sign-in was cancelled. Choose a provider to try again.');
  }, []);
  return <main className="account-shell">
    <a className="wordmark account-wordmark" href="/"> <span className="door" aria-hidden="true" />Code Practice</a>
    <section className="account-card" aria-labelledby="login-title">
      <h1 id="login-title" className="h1">Sign in to Code Practice</h1>
      <p className="account-copy">Sign in to manage your profile, then get back to learning Git and GitHub.</p>
      {message && <p className="account-message" role="alert">{message}</p>}
      <div className="provider-buttons">
        <a className="btn provider-button" href="/auth/google/start">Continue with Google <span aria-hidden="true">→</span></a>
        <a className="btn provider-button provider-secondary" href="/auth/github/start">Continue with GitHub <span aria-hidden="true">→</span></a>
      </div>
      <p className="account-note">No Code Practice password to remember. You can sign out at any time from your profile.</p>
      <a className="link-quiet" href="/">← Back to dashboard</a>
    </section>
  </main>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'T';
}

function localProgress() {
  let completed = 0;
  try {
    for (const course of ['git', 'github']) {
      const value = localStorage.getItem(`code-practice-completed:${course}`);
      const entries: unknown = value ? JSON.parse(value) : [];
      if (Array.isArray(entries)) completed += new Set(entries.filter(entry => typeof entry === 'string')).size;
    }
  } catch { /* A damaged local progress record should not block account settings. */ }
  return completed;
}

export function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [saved, setSaved] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => readPreference('code-practice.reduced-motion') === '1');
  useEffect(() => {
    fetchMe().then(account => {
      if (!account) { window.location.replace('/login.html'); return; }
      setUser(account); setDisplayName(account.display_name);
    }).catch(() => setError('Could not load your profile.')).finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    applyMotionPreference(reducedMotion);
    writePreference('code-practice.reduced-motion', reducedMotion ? '1' : '0');
  }, [reducedMotion]);
  async function save(event: FormEvent) {
    event.preventDefault(); setSaved(''); setError('');
    if (!displayName.trim()) { setError('Enter a display name before saving.'); return; }
    setSaving(true);
    try { const next = await updateMe(displayName.trim()); setUser(next); setDisplayName(next.display_name); setSaved('Profile saved.'); }
    catch { setError('Could not save your profile.'); }
    finally { setSaving(false); }
  }
  async function signOut() {
    setSigningOut(true); setError('');
    try { await logout(); window.location.replace('/'); }
    catch { setError('Could not sign out. Please try again.'); setSigningOut(false); }
  }
  if (loading) return <main className="wrap page-top" role="status">Loading profile…</main>;
  if (!user) return <main className="wrap page-state"><h1 className="h1">Your profile couldn’t load.</h1><p role="alert">{error || 'Please try signing in again.'}</p><button className="btn" onClick={() => window.location.reload()}>Try again</button><a className="link-quiet" href="/">Back to dashboard</a></main>;
  return <>
    <header className="nav"><div className="nav-inner"><a className="wordmark" href="/"><span className="door" aria-hidden="true" />Code Practice</a><nav className="nav-links" aria-label="Account navigation"><a href="/">Dashboard</a><a className="active" href="/profile.html" aria-current="page">Profile</a></nav><div className="nav-user"><span className="season-label">Git & GitHub</span></div></div></header>
    <main className="wrap page-top account-page">
      <div className="page-heading"><h1 className="h1">Your profile</h1></div>
      <section className="profile-hero"><div className="avatar" aria-hidden="true">{initials(user.display_name)}</div><div><h2>{user.display_name}</h2><p>{user.email || 'Email hidden by provider'}</p></div><button className="link-button" disabled={signingOut} onClick={signOut}>{signingOut ? 'Signing out…' : 'Sign out'}</button></section>
      <div className="profile-grid">
        <section className="settings-card" aria-labelledby="profile-settings">
          <h2 className="h2" id="profile-settings">Profile settings</h2>
          <form onSubmit={save} className="profile-form" aria-busy={saving}>
            <label htmlFor="display-name">Display name</label>
            <input id="display-name" value={displayName} disabled={saving} onChange={event => { setDisplayName(event.target.value); setSaved(''); }} maxLength={200} required aria-describedby="display-name-note" autoComplete="nickname" />
            <p className="field-note" id="display-name-note">This is the name shown inside your learning workspace.</p>
            <button className="btn" type="submit" disabled={saving || !displayName.trim() || displayName.trim() === user.display_name}>{saving ? 'Saving…' : 'Save changes'} <span aria-hidden="true">→</span></button>
            {saved && <p className="success-message" role="status">{saved}</p>}
            {error && <p className="account-message" role="alert">{error}</p>}
          </form>
        </section>
        <section className="settings-card" aria-labelledby="preferences"><h2 className="h2" id="preferences">Preferences</h2><label className="toggle-row"><span><strong>Reduce motion</strong><small>Keep interface transitions subtle.</small></span><input type="checkbox" checked={reducedMotion} onChange={event => setReducedMotion(event.target.checked)} /></label></section>
        <section className="settings-card" aria-labelledby="connections"><h2 className="h2" id="connections">Connected sign-in</h2><div className="connection-list">{user.identities.map(identity => <div className="connection" key={identity.provider}><span>{identity.provider === 'github' ? 'GitHub' : 'Google'}</span><span className="status">Connected{identity.github_username ? ` · @${identity.github_username}` : ''}</span></div>)}</div></section>
        <section className="settings-card" aria-labelledby="activity"><h2 className="h2" id="activity">Your activity</h2><div className="activity-stat"><strong>{localProgress()}</strong><span>activities completed on this browser</span></div><p className="field-note">Progress stays in this browser for now.</p></section>
      </div>
    </main>
  </>;
}
