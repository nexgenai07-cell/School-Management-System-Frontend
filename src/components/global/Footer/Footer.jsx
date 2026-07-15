/**
 * FOOTER
 *
 * Public footer used on landing page and any future public pages.
 * Shows logo, nav links, contact info, and copyright.
 * No Redux, no auth dependency.
 *
 * Usage: <Footer />
 */

import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-navy-900 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <GraduationCap size={15} className="text-white" />
              </div>
              <span className="font-bold text-white">School AI</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              A complete school management ERP — built for admins, teachers, students, and parents.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              Navigation
            </p>
            <div className="space-y-2.5">
              {[
                { label: 'Features',    href: '#features'     },
                { label: 'Roles',       href: '#roles'        },
                { label: 'Modules',     href: '#modules'      },
                { label: 'Events',      href: '#events'       },
                { label: 'How it Works',href: '#how-it-works' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-white/45 hover:text-white/75 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              Contact
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-white/35 shrink-0" />
                <a
                  href="mailto:info@schoolai.edu.pk"
                  className="text-sm text-white/45 hover:text-white/75 transition-colors"
                >
                  info@schoolai.edu.pk
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-white/35 shrink-0" />
                <a
                  href="tel:+923000000000"
                  className="text-sm text-white/45 hover:text-white/75 transition-colors"
                >
                  +92-300-0000000
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-white/35 shrink-0 mt-0.5" />
                <p className="text-sm text-white/45">
                  Lahore, Punjab, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-white/30">
            © 2025 School AI ERP. All rights reserved.
          </p>
          <div className="flex gap-5">
            <button
              onClick={() => navigate('/login')}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;