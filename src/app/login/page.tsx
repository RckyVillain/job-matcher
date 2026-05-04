'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Login() {
    const router = useRouter();
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const res = await signIn('credentials', {
                    redirect: false,
                    email,
                    password
                });

                if (res?.error) {
                    setError("Invalid email or password");
                } else {
                    router.push('/');
                }
            } else {
                const res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name })
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to sign up");
                }

                // Auto login after signup
                await signIn('credentials', { redirect: false, email, password });
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--background)' }}>
            <div className={styles.card} style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className={styles.title} style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Job Matcher</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    {isLogin ? "Sign in to access your portfolio tools" : "Create a new secure account"}
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Name</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required={!isLogin}
                            />
                        </div>
                    )}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input 
                            type="email" 
                            className={styles.input} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input 
                            type="password" 
                            className={styles.input} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? <div className={styles.spinner}></div> : (isLogin ? "Sign In" : "Sign Up")}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button 
                        style={{ color: 'var(--primary)', fontWeight: 600, marginLeft: '0.5rem' }}
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
}
