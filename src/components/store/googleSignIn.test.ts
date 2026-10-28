import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ oauth: vi.fn(), getUser: vi.fn() }));
vi.mock('@/integrations/lovable/index', () => ({ lovable: { auth: { signInWithOAuth: mocks.oauth } } }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { getUser: mocks.getUser } } }));
import { signInWithGoogle } from './googleSignIn';

describe('Google account sign-in', () => {
  beforeEach(() => vi.resetAllMocks());
  it('uses Google only with a public origin and account chooser', async () => {
    mocks.oauth.mockResolvedValue({ redirected: true });
    expect(await signInWithGoogle()).toBe('redirected');
    expect(mocks.oauth).toHaveBeenCalledExactlyOnceWith('google', {
      redirect_uri: window.location.origin, extraParams: { prompt: 'select_account' },
    });
    expect(mocks.getUser).not.toHaveBeenCalled();
  });
  it('accepts a completed popup only after validating the account', async () => {
    mocks.oauth.mockResolvedValue({ redirected: false });
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'customer' } }, error: null });
    expect(await signInWithGoogle()).toBe('signed-in');
    expect(mocks.getUser).toHaveBeenCalledOnce();
  });
  it('rejects a popup that did not attach an account session', async () => {
    mocks.oauth.mockResolvedValue({ redirected: false });
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    await expect(signInWithGoogle()).rejects.toThrow();
  });
  it('propagates cancellation or provider failure so the button can recover', async () => {
    mocks.oauth.mockRejectedValue(new Error('Popup closed'));
    await expect(signInWithGoogle()).rejects.toThrow('Popup closed');
  });
});