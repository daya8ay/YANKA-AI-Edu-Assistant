'use client';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export function useAuth() {
  const { user, authStatus, signOut } = useAuthenticator((ctx) => [
    ctx.user,
    ctx.authStatus,
  ]);
  const [idToken, setIdToken] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus !== 'authenticated') {
      setIdToken(null);
      return;
    }
    fetchAuthSession().then((session) => {
      setIdToken(session.tokens?.idToken?.toString() ?? null);
    });
  }, [authStatus]);

  /**
   * Drop-in replacement for fetch() that automatically attaches
   * the Cognito ID token as "Authorization: Bearer <token>".
   *
   * Usage:  const res = await authFetch('/api/chat', { method: 'POST', body: ... })
   */
  async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  return { user, authStatus, idToken, signOut, authFetch };
}