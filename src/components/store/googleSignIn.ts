import { lovable } from '@/integrations/lovable/index';
import { supabase } from '@/integrations/supabase/client';

/** The managed helper owns preview popups and session attachment. */
export async function signInWithGoogle() {
  const result = await lovable.auth.signInWithOAuth('google', {
    redirect_uri: window.location.origin,
    extraParams: { prompt: 'select_account' },
  });
  if (result.error) throw result.error;
  if (result.redirected) return 'redirected' as const;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Google লগইন সম্পূর্ণ হয়নি। আবার চেষ্টা করুন।');
  return 'signed-in' as const;
}