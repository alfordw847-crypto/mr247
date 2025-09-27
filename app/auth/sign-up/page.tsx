"use client";

import { createUser, sendOtp, verifyOtp } from "@/action/auth.action";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RegisterSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { OTPCountdown } from "./components/resend-button";

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 60;

type FormData = z.infer<typeof RegisterSchema>;

const RegForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVerifyingOTP, startOTPTransition] = useTransition();
  const [showOTPStep, setShowOTPStep] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [countdown, setCountdown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      refBy: "",
    },
  });

  const resetOTPState = useCallback(
    () => setOtpValues(Array(OTP_LENGTH).fill("")),
    []
  );
  const startCountdown = useCallback(() => setCountdown(RESEND_TIMEOUT), []);
  const focusOTPInput = useCallback(
    (index: number) => otpInputRefs.current[index]?.focus(),
    []
  );

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOTPChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1 || (value && !/^\d$/.test(value))) return;
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);
      if (value && index < OTP_LENGTH - 1) focusOTPInput(index + 1);
    },
    [otpValues, focusOTPInput]
  );

  const handleOTPKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otpValues[index] && index > 0)
        focusOTPInput(index - 1);
    },
    [otpValues, focusOTPInput]
  );

  const handleOTPPaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .slice(0, OTP_LENGTH)
        .split("")
        .filter((c) => /^\d$/.test(c));
      const newOtp = [...otpValues];
      pasted.forEach((digit, i) => (newOtp[i] = digit));
      setOtpValues(newOtp);
      const nextEmpty = newOtp.findIndex((v) => !v);
      focusOTPInput(nextEmpty !== -1 ? nextEmpty : OTP_LENGTH - 1);
    },
    [otpValues, focusOTPInput]
  );

  const handleVerifyOTP = useCallback(async () => {
    const otpCode = otpValues.join("");
    if (otpCode.length !== OTP_LENGTH)
      return toast.error("Please enter complete OTP");
    startOTPTransition(async () => {
      try {
        const result = await verifyOtp(userEmail, otpCode);
        if (result?.success) {
          toast.success("Email verified successfully! 🎉");
          router.push("/auth/sign-in");
        } else {
          toast.error(result?.message || "Invalid OTP");
          resetOTPState();
          focusOTPInput(0);
        }
      } catch {
        toast.error("Verification failed. Please try again.");
      }
    });
  }, [otpValues, userEmail, router, resetOTPState, focusOTPInput]);

  const handleResendOTP = useCallback(async () => {
    if (countdown > 0) return;
    try {
      const result = await sendOtp(userEmail);
      if (result?.success) {
        toast.success("OTP resent successfully!");
        resetOTPState();
        startCountdown();
        focusOTPInput(0);
      } else {
        toast.error(result?.message || "Failed to resend OTP");
      }
    } catch {
      toast.error("Failed to resend OTP");
    }
  }, [userEmail, countdown, resetOTPState, startCountdown, focusOTPInput]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    startTransition(async () => {
      try {
        const result = await createUser(data);
        if (result?.success) {
          setUserEmail(data.email);
          setShowOTPStep(true);
          startCountdown();
          toast.success("Registration successful! Check your email for OTP.", {
            duration: 4000,
          });
          setTimeout(() => focusOTPInput(0), 100);
        } else {
          toast.error(
            result?.message || "Registration failed. Please try again."
          );
        }
      } catch {
        toast.error("Network error. Please try again.");
      }
    });
  };

  const handleBackToForm = () => {
    setShowOTPStep(false);
    resetOTPState();
  };

  // ===== OTP Step =====
  if (showOTPStep) {
    return (
      <div className="flex min-h-screen mb-12 items-center justify-center bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-8 shadow-2xl border border-white/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-700">
              We've sent a 6-digit code to <br />
              <span className="font-medium text-purple-600">{userEmail}</span>
            </p>
          </div>

          <Separator className="my-6 border-purple-300/50" />

          <div className="space-y-6">
            <div className="flex justify-center gap-3">
              {otpValues.map((value, index) => (
                <Input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    otpInputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  onPaste={handleOTPPaste}
                  className="h-14 w-12 text-center text-xl font-semibold border-2 focus:border-purple-500 transition-colors rounded-lg shadow-sm"
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            <OTPCountdown countdown={countdown} onResend={handleResendOTP} />

            <div className="space-y-3">
              <Button
                onClick={handleVerifyOTP}
                disabled={
                  otpValues.join("").length !== OTP_LENGTH || isVerifyingOTP
                }
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 text-white py-3 font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 disabled:opacity-50"
              >
                {isVerifyingOTP ? "Verifying..." : "Verify Email"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={handleBackToForm}
                className="w-full text-gray-700 hover:text-gray-900 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Registration
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== Registration Form =====
  return (
    <div className="flex min-h-screen mb-12 items-center justify-center bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-8 shadow-2xl border border-white/20 mt-12">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500">
            Create Account
          </h2>
          <p className="text-center text-gray-700 text-sm">
            Fill in your details to get started
          </p>
        </div>

        <Separator className="my-6 border-purple-300/50" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="name"
              control={form.control}
              label="Full Name"
              placeholder="Enter your full name"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="email"
              control={form.control}
              label="Email Address"
              placeholder="your@email.com"
              type="email"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="password"
                control={form.control}
                label="Password"
                placeholder="Create password"
                type="password"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="confirmPassword"
                control={form.control}
                label="Confirm Password"
                placeholder="Confirm password"
                type="password"
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="refBy"
              control={form.control}
              label="Referral Code"
              placeholder="Enter valid ref code"
            />

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Label
                htmlFor="terms"
                className="text-sm leading-5 text-gray-700 cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  href="#"
                  className="font-medium text-purple-600 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="font-medium text-purple-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <SubmitButton
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 py-3 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              isLoading={isPending}
            >
              {isPending ? "Processing..." : "Register"}
            </SubmitButton>
          </form>
        </Form>

        <div className="mt-6 text-center text-gray-700 text-sm">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-purple-600 hover:text-indigo-500 hover:underline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegForm;
