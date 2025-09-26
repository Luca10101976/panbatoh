'use client';
export const dynamic = 'force-dynamic';

import { Suspense, lazy } from "react";

// lazy loading komponenty
const ResetPasswordComponent = lazy(() => import("./ResetPasswordComponent"));

export default function Page() {
  return (
    <Suspense fallback={<div>Načítání formuláře…</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}