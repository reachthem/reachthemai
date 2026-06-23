'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import ModifyProfileModal from '@/components/app/ModifyProfileModal';
import {
  acknowledgeProfileWelcomeModal,
  getProfileModalPromptState,
} from '@/app/actions/user-profile';

const PHONE_DISMISS_SESSION_KEY = 'profile_phone_modal_dismissed_session';

/**
 * Auto-opens profile modal on /app for first-visit welcome and when phone is missing
 * (missing-phone prompt respects a per-tab dismiss so closing without saving does not loop).
 */
export default function AppProfileGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [missingPhone, setMissingPhone] = useState(false);

  const inAppShell =
    pathname.startsWith('/app') &&
    !pathname.startsWith('/app/admin');

  const applyPromptState = useCallback(() => {
    if (!inAppShell) return;
    getProfileModalPromptState()
      .then(({ missingPhone: noPhone, needsWelcome }) => {
        setMissingPhone(noPhone);
        const dismissed =
          typeof window !== 'undefined' &&
          sessionStorage.getItem(PHONE_DISMISS_SESSION_KEY) === '1';
        const openNow = needsWelcome || (noPhone && !dismissed);
        setOpen(openNow);
      })
      .catch(() => setOpen(false))
      .finally(() => setHydrated(true));
  }, [inAppShell]);

  useEffect(() => {
    if (!inAppShell) {
      setOpen(false);
      setHydrated(true);
      return;
    }
    applyPromptState();
  }, [inAppShell, pathname, applyPromptState]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        void acknowledgeProfileWelcomeModal()
          .catch(() => {})
          .finally(() => {
            if (missingPhone && typeof window !== 'undefined') {
              sessionStorage.setItem(PHONE_DISMISS_SESSION_KEY, '1');
            }
            setOpen(false);
          });
        return;
      }
      setOpen(true);
    },
    [missingPhone]
  );

  const handleSuccess = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(PHONE_DISMISS_SESSION_KEY);
    }
    void acknowledgeProfileWelcomeModal().then(() => applyPromptState());
  }, [applyPromptState]);

  if (!inAppShell || !hydrated) return null;

  return (
    <ModifyProfileModal
      hideTrigger
      open={open}
      onOpenChange={handleOpenChange}
      onSuccess={handleSuccess}
    />
  );
}
