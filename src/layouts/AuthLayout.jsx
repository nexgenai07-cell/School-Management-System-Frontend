/**
 * AUTH LAYOUT
 *
 * Wrapper for all auth pages: Login, Register, ForgotPassword, PendingApproval.
 *
 * Background: light navy tint with a subtle dot grid pattern (CSS only, no image).
 * Card: centered white card, max-w-lg.
 * Logo sits above the card.
 *
 * Usage:
 *   <Route path="/login" element={<AuthLayout />} />   ← uses <Outlet />
 */

import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

function AuthLayout() {
  return (
    /*
      bg-[#EEF2F7]          → very light navy tint (brand-light)
      bg-[radial-gradient…] → dot pattern using inline bg-image style
      We use a style prop for the dot pattern since Tailwind v4 can't
      build arbitrary background-image values reliably.
    */
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundColor: '#EEF2F7',
        backgroundImage: 'radial-gradient(circle, #1E3A5F1A 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Logo above card */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary">
          <GraduationCap size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-brand-primary tracking-tight">
          School ERP
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg rounded-modal bg-surface p-8 shadow-soft">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;