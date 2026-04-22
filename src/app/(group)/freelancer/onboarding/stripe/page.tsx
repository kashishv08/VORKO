"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Banknote, FileText, ExternalLink } from 'lucide-react';
import Link from "next/link";
import { Spinner } from "@radix-ui/themes";
import { LancifyLogo } from "@/src/components/LancifyLogo";

const BENEFITS = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#14a800]" />,
    label: 'Secure, enterprise-grade payment processing',
  },
  {
    icon: <Banknote className="w-5 h-5 text-[#14a800]" />,
    label: 'Direct deposits to your local bank account',
  },
  {
    icon: <FileText className="w-5 h-5 text-[#14a800]" />,
    label: 'Automatic tax reporting and management',
  },
];

export default function StripeOnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Auto-check on mount
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      if (!isMounted) return;
      try {
        const res = await fetch("/api/stripe/status", { cache: "no-store" });
        if (!res.ok) {
           const errData = await res.json().catch(() => ({}));
           console.error("Status API error:", res.status, errData.error);
           return;
        }
        const text = await res.text();
        if (!text || text.trim() === "") {
          console.warn("Empty response from /api/stripe/status");
          return;
        }
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse status JSON:", text);
          return;
        }

        if (data.connected && isMounted) {
          toast.success("Payment setup verified!");
          setChecking(false);
          // Give Clerk metadata a moment to propagate before redirecting
          setTimeout(() => {
            if (isMounted) router.push("/freelancer/dashboard?synced=true");
          }, 2000);
        }
      } catch (err) {
        console.error("Check status failed:", err);
      } finally {
        if (isMounted) setChecking(false);
      }
    };

    // Initial check
    checkStatus();

    // Occasional polling while on this page
    const interval = setInterval(checkStatus, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [router]);

  const handleOnboard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/onboard", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to generate onboarding link.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-8 py-5 border-b border-gray-100">
        <LancifyLogo />
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-1">
        <div className="w-full max-w-[540px]">

          {/* Back */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-800 mb-8 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          {/* Progress — final step */}
          <div className="flex items-center gap-2 mb-10">
            <div className="h-1.5 flex-1 rounded-full bg-[#14a800]" />
            <div className="h-1.5 flex-1 rounded-full bg-[#14a800]" />
            <span className="text-[12px] text-gray-400 ml-1">Final Step</span>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

            {/* Card top — green accent */}
            <div className="bg-gradient-to-br from-[#14a800] to-[#0d8000] px-8 pt-10 pb-12 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-6 w-28 h-28 rounded-full bg-white/10" />

              {/* Stripe wordmark */}
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                  </svg>
                </div>
                <span className="text-white/90 text-[13px] font-medium tracking-wide uppercase">Stripe Connect</span>
              </div>

              <h1 className="text-[28px] font-semibold text-white leading-tight mb-2 relative z-10">
                Set up your payments
              </h1>
              <p className="text-white/80 text-[15px] leading-relaxed relative z-10">
                Connect your bank account to start receiving payments and applying for projects.
              </p>
            </div>

            {/* Card body */}
            <div className="px-8 py-8">
              {/* Benefits list */}
              <ul className="flex flex-col gap-4 mb-8">
                {BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      {b.icon}
                    </div>
                    <span className="text-[15px] text-gray-700">{b.label}</span>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="border-t border-gray-100 mb-8" />

              {/* CTA */}
              <button
                onClick={handleOnboard}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#14a800] hover:bg-[#12960a] active:bg-[#0f8009] text-white rounded-full text-[15px] font-semibold transition-colors duration-150 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Spinner /> : (
                  <>
                    Complete Stripe Setup
                    <ExternalLink className="w-4 h-4 opacity-80" />
                  </>
                )}
              </button>

              {/* Powered by */}
              <div className="flex items-center justify-center gap-2 mt-4">
                <svg viewBox="0 0 24 24" fill="#6b7280" width="14" height="14">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                </svg>
                <span className="text-[12px] text-gray-400">Powered by Stripe Connect</span>
              </div>
            </div>
          </div>

          {/* Skip for now */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-[14px] text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors cursor-pointer"
            >
              I&apos;ll do this later
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
