/**
 * RANDOMLY — Authentication Modal
 *
 * A modal dialog for user sign up, sign in, and sign out.
 */

import { useState, useRef, useEffect } from 'react';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  onSignOut: () => Promise<void>;
  isAuthenticated: boolean;
  userEmail?: string | null;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({
  isOpen,
  onClose,
  onSignUp,
  onSignIn,
  onSignOut,
  isAuthenticated,
  userEmail,
  initialMode = 'signin',
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Open dialog when isOpen changes
  useEffect(() => {
    if (isOpen) {
      const d = dialogRef.current;
      if (d && !d.open) {
        d.showModal();
        emailRef.current?.focus();
      }
    }
  }, [isOpen]);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    }
  }, [initialMode, isOpen]);

  // Clear form when closing
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setSuccess(null);
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    const outside =
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom;
    if (outside) onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const result = mode === 'signup'
      ? await onSignUp(email, password)
      : await onSignIn(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      if (mode === 'signup') {
        setSuccess('Check your email to confirm your account!');
        setMode('signin');
      } else {
        onClose();
      }
    }
  }

  async function handleSignOut() {
    setLoading(true);
    await onSignOut();
    setLoading(false);
    onClose();
  }

  // If authenticated, show sign out screen
  if (isAuthenticated) {
    return (
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        open={isOpen}
        aria-labelledby="auth-title"
        onClose={onClose}
        onClick={handleBackdropClick}
      >
        <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 id="auth-title" className={styles.title}>Account</h2>
            <button
              ref={closeRef}
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              X
            </button>
          </div>

          <div className={styles.authenticatedView}>
            <div className={styles.avatar}>U</div>
            <p className={styles.userEmail}>{userEmail}</p>
            <p className={styles.signedInText}>You are signed in</p>
            <p className={styles.cloudNote}>
              Your favorites are saved to the cloud and will sync across devices.
            </p>
            <button
              type="button"
              className={styles.signOutBtn}
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </dialog>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      open={isOpen}
      aria-labelledby="auth-title"
      onClose={onClose}
      onClick={handleBackdropClick}
    >
      <div className={styles.inner} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 id="auth-title" className={styles.title}>
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            X
          </button>
        </div>

        {success && (
          <div className={styles.success} role="status">
            {success}
          </div>
        )}

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Email
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              className={styles.input}
            />
          </label>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : mode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          {mode === 'signup' ? (
            <>
              <span>Already have an account?</span>
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => { setMode('signin'); setError(null); }}
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account?</span>
              <button
                type="button"
                className={styles.switchBtn}
                onClick={() => { setMode('signup'); setError(null); }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        <p className={styles.note}>
          {mode === 'signup'
            ? 'Sign up to save favorites to the cloud and access them from any device.'
            : 'Sign in to access your cloud-saved favorites.'}
        </p>
      </div>
    </dialog>
  );
}