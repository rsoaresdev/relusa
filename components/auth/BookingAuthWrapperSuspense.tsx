"use client";

import { Suspense } from "react";
import BookingAuthWrapper from "./BookingAuthWrapper";

const BookingAuthWrapperFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        A carregar sistema de marcações...
      </p>
    </div>
  </div>
);

export default function BookingAuthWrapperSuspense() {
  return (
    <Suspense fallback={<BookingAuthWrapperFallback />}>
      <BookingAuthWrapper />
    </Suspense>
  );
}
