/**
 * FOOTER
 *
 * Public footer used on landing page and any future public pages.
 * Shows logo, nav links, contact info, and copyright.
 * No Redux, no auth dependency.
 *
 * Usage: <Footer />
 *
 * Rhythm pass v4 — permanent dark theme, bookends the dark hero:
 *  - Kept dark (bg-[#0a0e1a], same tone as navbar/hero) so the page reads
 *    dark → light → dark rather than flattening everything to white.
 *  - The actual dullness problem in the earlier dark pass wasn't "dark
 *    theme" itself, it was text sitting at white/30-45 with almost no
 *    contrast against the dark bg. Fixed by raising every text layer:
 *    headings/logo → white, body/links → white/65-70, fine print → white/40
 *    (fine print is conventionally the one place low contrast is fine).
 *  - Logo mark uses the same signature gradient (admin→teacher→parent) as
 *    the hero accent word, navbar logo, and CTA icon strip.
 *  - Link hovers move toward white (more contrast) rather than a lighter
 *    white — matches the "hover = more contrast" pattern used elsewhere.
 */

import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Home',    href: '#hero'    },
  { label: 'Roles',   href: '#roles'   },
  { label: 'Modules', href: '#modules' },
];

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#0a0e1a] pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-admin-primary via-teacher-primary to-parent-primary flex items-center justify-center">
                <GraduationCap size={15} className="text-white" />
              </div>
              <span className="font-bold text-white">School AI</span>
            </div>
            <p className="text-sm text-white/65 leading-relaxed max-w-xs">
              A complete school management ERP — built for admins, teachers, students, and parents.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
              Navigation
            </p>
            <div className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-white/65 hover:text-white hover:underline underline-offset-4 decoration-white/30 transition-colors w-fit"
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
                <Mail size={14} className="text-white/45 shrink-0" />
                <a
                  href="mailto:info@schoolai.edu.pk"
                  className="text-sm text-white/65 hover:text-white transition-colors"
                >
                  info@schoolai.edu.pk
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-white/45 shrink-0" />
                <a
                  href="tel:+923000000000"
                  className="text-sm text-white/65 hover:text-white transition-colors"
                >
                  +92-300-0000000
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={14} className="text-white/45 shrink-0 mt-0.5" />
                <p className="text-sm text-white/65">
                  Lahore, Punjab, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-xs text-white/40">
            © 2026 School AI ERP. All rights reserved.
          </p>
          <div className="flex gap-5">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-xs text-white/40 hover:text-white transition-colors"
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