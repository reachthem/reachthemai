'use client';

import { useEffect } from 'react';

export default function PopupClosePage() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'AUTH_SUCCESS' }, window.location.origin);
    }
    window.close();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-secondary-500">Signing you in&hellip; this window will close automatically.</p>
    </div>
  );
}
