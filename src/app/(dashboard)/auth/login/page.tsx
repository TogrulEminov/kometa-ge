"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/useServerActions";
import { LoginInput, loginValidation } from "@/actions/auth/validation";
import { loginAdminPanel } from "@/actions/auth/auth.action";
import { authClient } from "@/lib/auth/auth-client";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FormInput from "@/globalElement/form/FormInput";

export default function LoginPageMinimal() {
  const form = useForm({
    resolver: zodResolver(loginValidation),
  });
  const { execute, isExecuting } = useAction(loginAdminPanel, {
    onError: () => {
      form.setError("password", {
        message: "Invalid email or password",
      });
    },
    onSuccess: async () => {
      await authClient.getSession();
      window.location.assign("/manage/dashboard");
    },
  });

  const handleSubmit = (data: LoginInput) => {
    execute(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-xl shadow-blue-600/30">
            <svg
              className="w-11 h-11 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Admin Panel
          </h1>
          <p className="text-slate-600 text-lg">Sign in to your account</p>
        </div>

        <FormWrapper
          schema={loginValidation}
          methods={form}
          onSubmit={handleSubmit}
        >
          <FormInput fieldName={"email"} label={"Email"} />
          <FormInput fieldName={"password"} label={"Password"} type="password" />
          <button
            disabled={isExecuting}
            type="submit"
            className="relative overflow-hidden rounded-xl w-full mt-4 bg-blue-500 px-12 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:grayscale-[0.3] group"
          >
            <span className="relative z-10">
              {isExecuting ? "Signing in..." : "Sign in"}
            </span>
            {isExecuting && (
              <span className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-white/30 border-t-slate-900" />
            )}
          </button>
        </FormWrapper>
      </div>
    </div>
  );
}
