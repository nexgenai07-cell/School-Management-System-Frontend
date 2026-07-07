import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { loginUser, fetchUserProfile } from '../../../store/auth/authThunks';
import { Button, Input } from '../../../components';

/**
 * LOGIN PAGE
 *
 * Handles user authentication using Redux Thunks (real API).
 * 1. Dispatch loginUser to get tokens.
 * 2. Dispatch fetchUserProfile to get user info.
 * 3. On success: redirects by role.
 * 4. Uses Redux state for loading and error.
 */

const ROLE_REDIRECTS = {
  Admin: '/admin/dashboard',
  Teacher: '/teacher/dashboard',
  Student: '/student/dashboard',
  Parent: '/parent/dashboard',
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ----- REDUX STATE (Loading & Error from store) -----
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    // Optional: Clearing error on typing is handled automatically by loginStart in thunk
    setForm({ ...form, [e.target.name]: e.target.value });
  }

 async function handleSubmit(e) {
  e.preventDefault();

  try {
    // Step 1: Login (Get Tokens)
    await dispatch(loginUser({ email: form.email, password: form.password })).unwrap();

    // Step 2: Fetch Profile (Get User Info)
    const user = await dispatch(fetchUserProfile()).unwrap();
    console.log("User Data from API:", user);
    
    if (user?.status === 'Pending') {
    navigate('/pending-approval');
    return; // Yahan se return kar do, dashboard par mat bhejo
    }

    // Step 3: Redirect based on Role (FIXED)
    const userRole = user?.role_name; 
    const redirectPath = ROLE_REDIRECTS[userRole] || '/login';
    console.log("Redirect Path:", redirectPath);
    
    navigate(redirectPath);
  } catch (err) {
    console.error('Login flow error:', err.message);
  }
}
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Sign in to access your portal
        </p>
      </div>

      {/* Error message - Now comes from Redux state */}
      {error && (
        <div className="rounded-input bg-danger-bg px-4 py-3 text-sm text-danger-text">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="name@school.edu"
          value={form.email}
          onChange={handleChange}
          leftIcon={<Mail size={16} />}
          required
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-text-muted hover:text-text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />

          {/* Forgot password — right aligned under password field */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs text-brand-primary hover:text-brand-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading} 
          tone="brand"
        >
          Sign In
        </Button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-sm text-text-secondary">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-medium text-brand-primary hover:text-brand-hover transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;