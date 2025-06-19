"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "./ResetPasswordForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const LoadingFallback = () => (
  <Card>
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold">Nova Password</CardTitle>
      <CardDescription>
        Introduza a sua nova password para a conta.
      </CardDescription>
    </CardHeader>
    <CardContent className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-4 h-4 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
    </CardContent>
  </Card>
);

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
