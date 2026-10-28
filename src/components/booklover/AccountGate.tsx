import { lazy, Suspense } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/store/AuthModal';
import Layout from './Layout';

const UserDashboard = lazy(() => import('@/pages/UserDashboard'));

/** /account: original sign-in popup when signed out, original customer dashboard when signed in. */
export default function AccountGate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <Layout><div className="bl-container bl-section min-h-[50vh]" /></Layout>;
  if (user) return <Suspense fallback={<div className="min-h-screen" />}><UserDashboard /></Suspense>;
  return (
    <Layout>
      <div className="bl-container bl-section min-h-[50vh]" />
      <AuthModal isOpen onClose={() => navigate({ to: '/' })} redirectAfterLogin={false} />
    </Layout>
  );
}
