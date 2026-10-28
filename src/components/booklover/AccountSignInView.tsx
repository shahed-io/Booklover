import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TurnstileWidget from '@/components/store/TurnstileWidget';
import logo from '@/assets/booklover-logo-transparent.webp';

type Mode = 'login' | 'signup' | 'forgot';
interface Props {
  mode: Mode; email: string; password: string; name: string;
  loading: boolean; canSubmit: boolean; forgotSent: boolean; agreeTerms: boolean;
  honeypot: string; siteKey: string | null | undefined;
  setEmail: (value: string) => void; setPassword: (value: string) => void;
  setName: (value: string) => void; setAgreeTerms: (value: boolean) => void;
  setHoneypot: (value: string) => void; setCaptchaToken: (value: string) => void;
  switchMode: (mode: Mode) => void; onGoogle: () => void; onSubmit: (event: FormEvent) => void;
}

export default function AccountSignInView(p: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return <section className="bl-account-signin" aria-labelledby="account-signin-title">
    <div className="bl-account-form">
      <a href="/" className="bl-account-brand" aria-label="Booklover home"><img src={logo} alt="Booklover" width={110} height={76} /></a>
      <p className="bl-account-eyebrow">BOOKLOVER / MY ACCOUNT</p>
      <h1 id="account-signin-title">{p.mode === 'login' ? 'স্বাগতম, বইপ্রেমী।' : p.mode === 'signup' ? 'আপনার অ্যাকাউন্ট তৈরি করুন' : 'পাসওয়ার্ড ভুলে গেছেন?'}</h1>
      <p className="bl-account-subtitle">{p.mode === 'login' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : p.mode === 'signup' ? 'বুকলাভারে আপনাকে স্বাগতম' : 'ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হবে'}</p>

      {p.mode === 'forgot' && p.forgotSent ? <div className="bl-account-confirm" role="status">
        <Mail size={32} /><h2>ইমেইল পাঠানো হয়েছে!</h2>
        <p><strong>{p.email}</strong> এ পাঠানো লিংকটি দেখুন।</p>
        <Button variant="link" className="bl-account-link" onClick={() => p.switchMode('login')}>লগইনে ফিরুন <ArrowRight /></Button>
      </div> : <>
        {p.mode !== 'forgot' && <>
          <Button variant="outline" className="bl-account-google" disabled={p.loading} onClick={p.onGoogle}>
            <span className="bl-account-googlemark" aria-hidden="true">G</span> Google দিয়ে চালিয়ে যান
          </Button>
          <div className="bl-account-divider"><span />অথবা ইমেইল দিয়ে<span /></div>
        </>}
        <form onSubmit={p.onSubmit} className="bl-account-fields">
          {p.mode === 'signup' && <label>আপনার নাম<input autoComplete="name" required minLength={2} value={p.name} onChange={e => p.setName(e.target.value)} placeholder="পুরো নাম" /></label>}
          <label>ইমেইল অ্যাড্রেস<input type="email" autoComplete="email" required value={p.email} onChange={e => p.setEmail(e.target.value)} placeholder="you@example.com" /></label>
          {p.mode !== 'forgot' && <label>পাসওয়ার্ড<div className="bl-account-password">
            <input type={showPassword ? 'text' : 'password'} autoComplete={p.mode === 'signup' ? 'new-password' : 'current-password'} required value={p.password} onChange={e => p.setPassword(e.target.value)} placeholder="আপনার পাসওয়ার্ড" />
            <Button type="button" variant="ghost" size="icon" aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</Button>
          </div>{p.mode === 'signup' && <small>কমপক্ষে ৮ অক্ষর, অক্ষর ও সংখ্যা থাকতে হবে</small>}</label>}
          {p.mode === 'login' && <Button variant="link" type="button" className="bl-account-forgot bl-account-link" onClick={() => p.switchMode('forgot')}>পাসওয়ার্ড ভুলে গেছেন?</Button>}
          {p.mode === 'signup' && <>
            <div className="hidden" aria-hidden="true"><input tabIndex={-1} name="company" autoComplete="off" value={p.honeypot} onChange={e => p.setHoneypot(e.target.value)} /></div>
            {p.siteKey && <TurnstileWidget siteKey={p.siteKey} onVerify={p.setCaptchaToken} onExpire={() => p.setCaptchaToken('')} />}
            <label className="bl-account-terms"><input type="checkbox" checked={p.agreeTerms} onChange={e => p.setAgreeTerms(e.target.checked)} /><span>আমি <a href="/terms-conditions" target="_blank" rel="noreferrer">শর্তাবলী</a> এবং <a href="/privacy-policy" target="_blank" rel="noreferrer">প্রাইভেসি পলিসি</a> মেনে নিচ্ছি</span></label>
          </>}
          <Button type="submit" className="bl-account-submit" disabled={!p.canSubmit}>{p.loading ? <LoaderCircle className="animate-spin" /> : null}{p.loading ? 'অপেক্ষা করুন...' : p.mode === 'login' ? 'লগইন করুন' : p.mode === 'signup' ? 'অ্যাকাউন্ট তৈরি করুন' : 'রিসেট লিংক পাঠান'}{!p.loading && <ArrowRight />}</Button>
        </form>
        <div className="bl-account-switch">{p.mode === 'forgot' ? <Button variant="link" className="bl-account-link" onClick={() => p.switchMode('login')}><ArrowLeft /> লগইনে ফিরুন</Button> : <><span>{p.mode === 'login' ? 'নতুন বইপ্রেমী?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'}</span><Button variant="link" className="bl-account-link" onClick={() => p.switchMode(p.mode === 'login' ? 'signup' : 'login')}>{p.mode === 'login' ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}</Button></>}</div>
      </>}
      <div className="bl-account-security"><ShieldCheck size={16} /><span>আপনার তথ্য সুরক্ষিত</span></div>
    </div>
  </section>;
}