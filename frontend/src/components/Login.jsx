import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <section className="auth-showcase" aria-hidden="true">
         
        <p className="auth-kicker">Task management, clarified.</p>
        <h1>Make room for the work that matters.</h1>
        <p className="auth-showcase-copy">Plan the day, keep the details close, and see every task move forward.</p>
        <div className="auth-preview"><span className="preview-dot preview-dot-purple" /><span className="preview-dot preview-dot-orange" /><span className="preview-dot preview-dot-green" /><div className="preview-line preview-line-long" /><div className="preview-line" /><div className="preview-line preview-line-short" /></div>
      </section>

      <section className="auth-card" aria-labelledby="login-title">
        <div className="auth-header">
          <div className="auth-logo">  TaskFlow</div>
          <h2 id="login-title">Welcome back</h2>
          <p>Sign in to continue to your workspace.</p>
        </div>

        {error && (
          <div className="auth-alert">
            <FiAlertCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="admin@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block loading-container"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer"><span>Demo account</span><strong>admin@test.com</strong><span>Use the provided credentials to sign in.</span></div>
      </section>
    </main>
  );
};

export default Login;
