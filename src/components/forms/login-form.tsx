"use client";

import { useState } from "react";
import { loginAction } from "@/actions/auth-actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await loginAction(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <Input
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="admin@gallery.com"
        required
      />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        Sign In
      </Button>
    </form>
  );
}
