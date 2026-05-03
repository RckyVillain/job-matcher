'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [jobLink, setJobLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!jobLink && !file) {
      setError('Please provide a Job Link/Description and upload a PDF Resume.');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const formData = new FormData();
      formData.append('jobLink', jobLink);
      if (file) {
        formData.append('resume', file);
      }

      const res = await fetch('/api/tailor', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to process resume');
      }

      const data = await res.json();
      setResults(data.bullets || []);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <main className={styles.container}>
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Job Matcher</h1>
          <p className={styles.subtitle}>AI-Powered Resume Tailoring for Your Dream Job</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="jobLink">Job Description URL or Text</label>
            <textarea
              id="jobLink"
              className={styles.textarea}
              placeholder="Paste the job URL or full job description here..."
              value={jobLink}
              onChange={(e) => setJobLink(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="resume">Upload Resume (PDF)</label>
            <div className={styles.fileInputWrapper}>
              <div className={styles.fileInput}>
                {file ? file.name : 'Click or drag a PDF file to upload'}
                <input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
          </div>

          {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <>
                <div className={styles.spinner}></div>
                Processing...
              </>
            ) : (
              'Tailor My Resume'
            )}
          </button>
        </form>

        {results.length > 0 && (
          <div className={`${styles.card} ${styles.results}`}>
            <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Optimized Bullet Points</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '0.9rem' }}>
              We analyzed the job requirements and your resume. Here are the keyword-optimized bullets:
            </p>
            {results.map((bullet, idx) => (
              <div key={idx} className={styles.bulletPoint}>
                {bullet}
              </div>
            ))}
            <button 
              className={styles.copyBtn} 
              onClick={() => copyToClipboard(results.join('\n\n'))}
            >
              Copy All to Clipboard
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
