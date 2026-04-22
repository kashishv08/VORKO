"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Role } from "@prisma/client";
import Link from 'next/link';
import { LancifyLogo } from '@/src/components/LancifyLogo';

export default function RoleSelection() {
    const [selected, setSelected] = useState<'client' | 'freelancer'>('client');
    const router = useRouter();
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!isLoaded || isLoading) return;
        setIsLoading(true);

        const role = selected === 'client' ? "CLIENT" : "FREELANCER";

        if (user) {
            try {
                const response = await axios.post("/api/check-role", {
                    clerkId: user.id,
                    role: role,
                    email: user.emailAddresses?.[0]?.emailAddress,
                    name: user.fullName || user.username || "User",
                });

                if (response.data.success) {
                    router.push(`/onboarding?role=${role}`);
                }
            } catch (err) {
                console.error("Error setting role:", err);
            } finally {
                setIsLoading(false);
            }
        } else {
            router.push(`/sign-up?role=${role}`);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top Bar with Logo */}
            <header className="px-8 py-5 border-b border-gray-100">
                <LancifyLogo />
            </header>

            {/* Main Content — vertically centered */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">

                {/* Title */}
                <h1 className="text-[40px] sm:text-[48px] font-normal text-gray-900 text-center mb-10 tracking-tight leading-tight">
                    Join as a client or freelancer
                </h1>

                {/* Role Cards */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-[580px]">

                    {/* Client Card */}
                    <button
                        onClick={() => setSelected('client')}
                        className={`flex-1 relative text-left rounded-2xl p-6 transition-all duration-150 cursor-pointer outline-none
                            ${selected === 'client'
                                ? 'bg-[#f2f2f2] border-[2.5px] border-gray-900'
                                : 'bg-white border border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        {/* Radio — top right */}
                        <div className="absolute top-5 right-5">
                            {selected === 'client' ? (
                                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-green-600">
                                    <span className="w-3 h-3 rounded-full bg-green-600 block" />
                                </span>
                            ) : (
                                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                        </div>

                        {/* Icon */}
                        <div className="mb-8 mt-1">
                            <ClientIcon />
                        </div>

                        {/* Label */}
                        <p className="text-[20px] sm:text-[22px] font-semibold text-gray-900 leading-snug">
                            I&apos;m a client,<br />
                            hiring for a<br />
                            project
                        </p>
                    </button>

                    {/* Freelancer Card */}
                    <button
                        onClick={() => setSelected('freelancer')}
                        className={`flex-1 relative text-left cursor-pointer rounded-2xl p-6 transition-all duration-150 cursor-pointer outline-none
                            ${selected === 'freelancer'
                                ? 'bg-[#f2f2f2] border-[2.5px] border-gray-900'
                                : 'bg-white border border-gray-300 hover:border-gray-400'
                            }`}
                    >
                        {/* Radio — top right */}
                        <div className="absolute top-5 right-5">
                            {selected === 'freelancer' ? (
                                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-green-600">
                                    <span className="w-3 h-3 rounded-full bg-green-600 block" />
                                </span>
                            ) : (
                                <span className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                        </div>

                        {/* Icon */}
                        <div className="mb-8 mt-1">
                            <FreelancerIcon />
                        </div>

                        {/* Label */}
                        <p className="text-[20px] sm:text-[22px] font-semibold text-gray-900 leading-snug">
                            I&apos;m a freelancer,<br />
                            looking for work
                        </p>
                    </button>
                </div>

                {/* CTA Button */}
                <button
                    onClick={handleContinue}
                    disabled={isLoading}
                    className={`cursor-pointer px-12 py-4 bg-[#14a800] hover:bg-[#12960a] active:bg-[#0f8009] text-white rounded-full text-[16px] font-semibold transition-colors duration-150 min-w-[240px] text-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Loading...' : (selected === 'client' ? 'Join as a Client' : 'Apply as a Freelancer')}
                </button>
            </main>
        </div>
    );
}

/* ── Client Icon: person + briefcase ── */
function ClientIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="20" cy="13" r="5.5" stroke="#222" strokeWidth="2" fill="none" />
            {/* Body / shoulder */}
            <path d="M8 38c0-7.732 5.373-14 12-14" stroke="#222" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Briefcase body */}
            <rect x="22" y="28" width="20" height="14" rx="2.5" stroke="#222" strokeWidth="2" fill="none" />
            {/* Briefcase handle */}
            <path d="M27 28v-2.5a2.5 2.5 0 012.5-2.5h5a2.5 2.5 0 012.5 2.5V28" stroke="#222" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Briefcase middle line */}
            <line x1="22" y1="35" x2="42" y2="35" stroke="#222" strokeWidth="2" />
        </svg>
    );
}

/* ── Freelancer Icon: person + laptop ── */
function FreelancerIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="20" cy="13" r="5.5" stroke="#222" strokeWidth="2" fill="none" />
            {/* Body / shoulder */}
            <path d="M8 38c0-7.732 5.373-14 12-14" stroke="#222" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Laptop screen */}
            <rect x="23" y="24" width="18" height="12" rx="2" stroke="#222" strokeWidth="2" fill="none" />
            {/* Laptop base */}
            <path d="M20 38h26" stroke="#222" strokeWidth="2" strokeLinecap="round" />
            {/* Hinge dot */}
            <path d="M31 36v2" stroke="#222" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
