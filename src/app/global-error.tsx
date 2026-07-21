'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for Vercel Runtime Logs
    console.error('[Melo Music] Global Error:', error);
    console.error('[Melo Music] Error stack:', error.stack);
    if (error.digest) {
      console.error('[Melo Music] Error digest:', error.digest);
    }
  }, [error]);

  return (
    <html>
      <body style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h2>Application Error</h2>
        <details style={{ marginTop: '10px' }}>
          <summary>Error Details (check Vercel Runtime Logs for full stack)</summary>
          <pre style={{ marginTop: '10px', padding: '10px', background: '#f0f0f0', overflow: 'auto' }}>
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
        <button
          onClick={() => reset()}
          style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
