/**
 * LANDING NAVBAR
 *
 * Simple top bar for the public landing page only.
 * No Redux, no user state, no profile dropdown.
 * Just logo + nav links + Sign In / Register buttons.
 *
 * Props:
 *  - none required — fully self-contained
 *
 * Usage:
 *   <LandingNavbar />
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';

function LandingNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'Roles',    href: '#roles'    },
    { label: 'Growth',   href: '#growth'   },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-surface-muted shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-navy-800">School ERP</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-navy-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-navy-800 hover:text-brand-primary transition-colors px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-semibold bg-navy-800 hover:bg-navy-700 text-white px-5 py-2 rounded-button transition-colors"
            >
              Register Now
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-text-secondary hover:text-text-primary p-1 transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface-muted bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-text-secondary py-2"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-surface-muted mt-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full text-sm font-medium text-navy-800 border border-navy-800 rounded-button py-2 hover:bg-surface-dim transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full text-sm font-semibold bg-navy-800 text-white rounded-button py-2 hover:bg-navy-700 transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default LandingNavbar;