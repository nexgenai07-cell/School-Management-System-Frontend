/**
 * PASSWORD STRENGTH INDICATOR
 *
 * Shows a single colored bar below a password field that grows and
 * changes color as the password gets stronger.
 *
 * Props:
 *   - password (string): the current password value to evaluate
 *
 * Scoring (0-4), one point each for:
 *   1. length >= 8
 *   2. has lowercase AND uppercase
 *   3. has a number
 *   4. has a special character
 *
 * Usage:
 *   <Input ... value={form.password} onChange={handleChange} />
 *   <PasswordStrength password={form.password} />
 */

// Explicit lookup table — no dynamic class building (Tailwind v4 rule)
const STRENGTH_LEVELS = {
  0: { label: '', width: 'w-0', bar: 'bg-transparent', text: 'text-transparent' },
  1: { label: 'Weak', width: 'w-1/4', bar: 'bg-danger-text', text: 'text-danger-text' },
  2: { label: 'Fair', width: 'w-2/4', bar: 'bg-warning-text', text: 'text-warning-text' },
  3: { label: 'Good', width: 'w-3/4', bar: 'bg-brand-primary', text: 'text-brand-primary' },
  4: { label: 'Strong', width: 'w-full', bar: 'bg-success-text', text: 'text-success-text' },
};

function getScore(password) {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  return score;
}

function PasswordStrength({ password, className = '' }) {
  if (!password) return null;

  const score = getScore(password);
  const level = STRENGTH_LEVELS[score];

  return (
    <div className={['space-y-1', className].join(' ')}>
      {/* Track + filled bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-dim">
        <div
          className={[
            'h-full rounded-full transition-all duration-300',
            level.width,
            level.bar,
          ].join(' ')}
        />
      </div>

      {/* Label */}
      <p className={['text-xs font-medium', level.text].join(' ')}>
        {level.label}
      </p>
      
    </div>
  );
}

export default PasswordStrength;