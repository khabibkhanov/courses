"use client";

import { useActionState } from "react";
import { changeCredentialsAction, loginAction, type FormState } from "@/app/admin/actions";

const input =
  "mt-1 block w-full rounded-md border border-rule bg-sheet px-3 py-2 focus:border-ink focus:outline-none";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input {...props} className={input} />
    </label>
  );
}

function Message({ state }: { state: FormState }) {
  if (state?.error) return <p role="alert" className="text-sm text-warn">{state.error}</p>;
  if (state?.ok) return <p role="status" className="text-sm text-done">{state.ok}</p>;
  return null;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Login" name="username" autoComplete="username" required autoFocus />
      <Field label="Parol" name="password" type="password" autoComplete="current-password" required />
      <Message state={state} />
      <button disabled={pending} className="w-full rounded-md bg-ink px-4 py-2.5 font-medium text-paper disabled:opacity-50">
        {pending ? "Tekshirilmoqda..." : "Kirish"}
      </button>
    </form>
  );
}

export function CredentialsForm({ username, min }: { username: string; min: number }) {
  const [state, action, pending] = useActionState(changeCredentialsAction, undefined);
  return (
    <form action={action} className="max-w-sm space-y-4">
      <Field label="Login" name="username" defaultValue={username} autoComplete="username" required />
      <Field label="Yangi parol (o'zgartirmaslik uchun bo'sh qoldiring)" name="next" type="password" autoComplete="new-password" minLength={min} />
      <Field label="Yangi parol takrori" name="repeat" type="password" autoComplete="new-password" />
      <Field label="Joriy parol" name="current" type="password" autoComplete="current-password" required />
      <Message state={state} />
      <button disabled={pending} className="rounded-md bg-ink px-4 py-2.5 font-medium text-paper disabled:opacity-50">
        {pending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
