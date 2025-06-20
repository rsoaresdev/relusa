"use client";

import { Suspense } from "react";
import BookingAuthWrapper from "./BookingAuthWrapper";

// Componente de loading simples
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-sm text-muted-foreground">A carregar...</p>
    </div>
  </div>
);

export default function BookingAuthWrapperSuspense() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingAuthWrapper />
    </Suspense>
  );
}
