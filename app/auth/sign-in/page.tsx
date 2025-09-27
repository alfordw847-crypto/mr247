"use client";

import { Suspense } from "react";
import { LoginPageContent } from "./components/sign-in-content";

export default function SignPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
