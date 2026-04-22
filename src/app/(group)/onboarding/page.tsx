"use client";

import { COMPLETE_ONBOARD } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, KeyboardEvent, useEffect, Suspense } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Building2, CheckCircle2, User as UserIcon, Briefcase, Plus, X, UserCircle2 } from "lucide-react";
import { Spinner } from "@radix-ui/themes";
import Link from "next/link";
import { LancifyLogo } from "@/src/components/LancifyLogo";

const COMPANY_SIZES = [
    { label: '1–10 employees', value: '1-10' },
    { label: '11–50 employees', value: '11-50' },
    { label: '51–200 employees', value: '51-200' },
    { label: '201–1000 employees', value: '201-1000' },
    { label: '1000+ employees', value: '1000+' },
];

const INDUSTRIES = [
    'Technology', 'Finance & Banking', 'Healthcare', 'Education',
    'E-commerce & Retail', 'Marketing & Advertising', 'Media & Entertainment',
    'Real Estate', 'Legal', 'Non-profit', 'Other',
];

const SUGGESTED_SKILLS = [
    'React', 'Node.js', 'TypeScript', 'Python', 'UI/UX Design',
    'Figma', 'GraphQL', 'AWS', 'PostgreSQL', 'Docker',
    'Next.js', 'Vue.js', 'iOS Development', 'Android Development',
    'Content Writing', 'SEO', 'Data Analysis', 'Machine Learning',
    'Copywriting', 'Video Editing',
];

function OnboardingContent() {
    const params = useSearchParams();
    const { user, isLoaded } = useUser();
    const queryRole = params.get("role");
    const role = user?.publicMetadata?.role || queryRole;
    const router = useRouter();

    // Logic State
    const [bio, setBio] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (!isLoaded || !user || !role) return;

        const setRole = async () => {
            try {
                await fetch("/api/check-role", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ clerkId: user.id, role }),
                });
            } catch (err) {
                console.error("Error setting role:", err);
            }
        };
        setRole();
    }, [isLoaded, user, role]);

    const bioMax = role === "CLIENT" ? 600 : 500;
    const minBioLen = role === "CLIENT" ? 20 : 30;
    const isValid = bio.trim().length >= minBioLen && (role !== "FREELANCER" || (skills.length >= 1 && skills.length <= 15));

    const removeSkill = (remove: string) => {
        setSkills((prev) => prev.filter((s) => s !== remove));
    };

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !skills.includes(trimmed) && skills.length < 15) {
            setSkills(prev => [...prev, trimmed]);
        }
        setSkillInput('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill(skillInput);
        }
        if (e.key === 'Backspace' && skillInput === '' && skills.length > 0) {
            setSkills(prev => prev.slice(0, -1));
        }
    };

    const handleOnboard = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (!user || !role) return toast.error("User or role missing.");
        if (!isValid) return;

        setLoading(true);

        try {
            const userOnboard: { completeOnboarding: User & { stripeOnboardingUrl?: string } } = await gqlClient.request(
                COMPLETE_ONBOARD,
                { bio, skills, role }
            );

            if (userOnboard?.completeOnboarding) {
                setSubmitted(true);
                await user.reload();

                const onboardUrl = userOnboard.completeOnboarding.stripeOnboardingUrl;

                if (role === "FREELANCER" && onboardUrl) {
                    setTimeout(() => {
                        window.location.href = onboardUrl;
                    }, 2500);
                }
            } else {
                toast.error("Onboarding failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const filteredSuggestions = SUGGESTED_SKILLS.filter(
        s => !skills.includes(s) && s.toLowerCase().includes(skillInput.toLowerCase())
    );

    if (!isLoaded) return null;

    if (submitted) {
        return (
            <div className="min-h-screen bg-white flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-5 text-center max-w-[420px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle2 className="w-9 h-9 text-[#14a800]" />
                        </div>
                        <h2 className="text-[32px] font-semibold text-gray-900 leading-tight">
                            {role === "FREELANCER" ? "Profile created!" : "You&apos;re all set!"}
                        </h2>
                        <p className="text-[16px] text-gray-500 leading-relaxed">
                            {role === "FREELANCER"
                                ? "Your freelancer profile is live. Redirecting to payment setup..."
                                : "Your company profile has been saved. You can now start posting jobs and finding the best talent on Lancify."}
                        </p>
                        {role !== "FREELANCER" && (
                            <button
                                onClick={() => router.push(`/${role?.toString().toLowerCase()}/dashboard`)}
                                className="mt-2 px-10 py-4 bg-[#14a800] hover:bg-[#12960a] text-white rounded-full text-[15px] font-semibold transition-colors"
                            >
                                Go to Dashboard
                            </button>
                        )}
                        {role === "FREELANCER" && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 animate-pulse">
                                <Spinner />
                                Preparing your Stripe workspace...
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col items-center px-4 py-1">
                <div className="w-full max-w-[620px]">

                    {/* Back */}
                    {/* <button
                        onClick={() => router.push('/role-selection')}
                        className="flex items-center gap-2 text-[14px] text-gray-500 hover:text-gray-800 mb-8 transition-colors group cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        Back
                    </button> */}

                    {/* Progress */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-1.5 flex-1 rounded-full bg-[#14a800]" />
                        <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
                        <span className="text-[12px] text-gray-400 ml-1">Step 1 of 2</span>
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                            {role === "CLIENT" ? <Building2 className="w-5 h-5 text-[#14a800]" /> : <UserCircle2 className="w-5 h-5 text-[#14a800]" />}
                        </div>
                        <h1 className="text-[30px] font-semibold text-gray-900 leading-tight tracking-tight">
                            {role === "CLIENT" ? "Tell us about your company" : "Build your freelancer profile"}
                        </h1>
                    </div>
                    <p className="text-[15px] text-gray-500 mb-10 ml-[52px]">
                        {role === "CLIENT"
                            ? "This helps freelancers understand your business and what you&apos;re looking for."
                            : "A strong profile helps you stand out and win more clients."}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleOnboard} className="flex flex-col gap-8">

                        {/* Bio/Description */}
                        <div>
                            <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 tracking-wide uppercase">
                                {role === "CLIENT" ? "Company Description" : "Professional Bio"} <span className="text-red-400 normal-case">*</span>
                            </label>
                            <p className="text-[13px] text-gray-400 mb-2">
                                {role === "CLIENT"
                                    ? "Describe what your company does, your mission, and the type of work you typically hire for."
                                    : "Write a short summary about your experience, expertise, and what makes you unique."}
                            </p>
                            <div className="relative">
                                <textarea
                                    value={bio}
                                    onChange={e => {
                                        if (e.target.value.length <= bioMax) setBio(e.target.value);
                                    }}
                                    rows={6}
                                    placeholder={role === "CLIENT"
                                        ? "e.g. We are a fast-growing SaaS company focused on helping small businesses automate their operations..."
                                        : "e.g. I&apos;m a full-stack developer with 5+ years of experience building scalable web applications..."}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#14a800] focus:ring-2 focus:ring-[#14a800]/15 transition resize-none leading-relaxed"
                                />
                                <span className={`absolute bottom-3 right-4 text-[12px] ${bio.length >= bioMax ? 'text-red-400' : 'text-gray-400'}`}>
                                    {bio.length}/{bioMax}
                                </span>
                            </div>
                            {bio.trim().length > 0 && bio.trim().length < minBioLen && (
                                <p className="text-[12px] text-red-400 mt-1.5">Please write at least {minBioLen} characters.</p>
                            )}
                        </div>

                        {/* Skills Section (Freelancer Only) */}
                        {role === "FREELANCER" && (
                            <div>
                                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5 tracking-wide uppercase">
                                    Skills <span className="text-red-400 normal-case">*</span>
                                </label>
                                <p className="text-[13px] text-gray-400 mb-3">
                                    Add up to 15 skills. Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] font-mono text-gray-600">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[11px] font-mono text-gray-600">,</kbd> to add.
                                </p>

                                {/* Tag input box */}
                                <div
                                    className="w-full min-h-[52px] border border-gray-300 rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center cursor-text focus-within:border-[#14a800] focus-within:ring-2 focus-within:ring-[#14a800]/15 transition"
                                    onClick={() => document.getElementById('skill-input')?.focus()}
                                >
                                    {skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 text-[#14a800] rounded-full text-[13px] font-medium"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); removeSkill(skill); }}
                                                className="hover:text-green-800 transition-colors cursor-pointer"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {skills.length < 15 && (
                                        <input
                                            id="skill-input"
                                            value={skillInput}
                                            onChange={e => setSkillInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            onBlur={() => { if (skillInput.trim()) addSkill(skillInput); }}
                                            placeholder={skills.length === 0 ? 'e.g. React, Python, Figma…' : ''}
                                            className="flex-1 min-w-[140px] outline-none text-[15px] text-gray-900 placeholder-gray-400 bg-transparent py-1"
                                        />
                                    )}
                                </div>

                                {/* Skill count */}
                                <p className="text-[12px] text-gray-400 mt-1.5">
                                    {skills.length} / 15 skills added
                                </p>

                                {/* Suggestions */}
                                {(skillInput === '' || filteredSuggestions.length > 0) && (
                                    <div className="mt-4">
                                        <p className="text-[12px] text-gray-400 mb-2 font-medium uppercase tracking-wide">
                                            {skillInput ? 'Matching suggestions' : 'Popular skills'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {(skillInput ? filteredSuggestions : SUGGESTED_SKILLS.filter(s => !skills.includes(s))).slice(0, 12).map(skill => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    onClick={() => addSkill(skill)}
                                                    disabled={skills.length >= 15}
                                                    className="px-3 py-1.5 rounded-full border border-gray-300 text-[13px] text-gray-600 hover:border-[#14a800] hover:text-[#14a800] hover:bg-green-50 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    + {skill}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Validation hint */}
                        {!isValid && (bio.trim().length > 0 || skills.length > 0) && (
                            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
                                <svg className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                                </svg>
                                <p className="text-[13px] text-amber-700">
                                    Please add a bio (min. {minBioLen} characters) and {role === "FREELANCER" ? "at least one skill" : "company description"} to continue.
                                </p>
                            </div>
                        )}

                        {/* Submit */}
                        <div className="flex justify-end pt-1">
                            <button
                                type="submit"
                                disabled={!isValid || loading}
                                className={`px-10 py-2 rounded-full text-[15px] font-semibold transition-all duration-150 flex items-center justify-center min-w-[160px]
                                    ${isValid && !loading
                                        ? 'bg-[#14a800] hover:bg-[#12960a] text-white cursor-pointer'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {loading ? <Spinner /> : (role === "FREELANCER" ? "Create Profile" : "Continue")}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default function Onboarding() {
    return (
        <Suspense fallback={null}>
            <OnboardingContent />
        </Suspense>
    );
}

function Header() {
    return (
        <header className="px-8 py-5 border-b border-gray-100">
            <LancifyLogo />
        </header>
    );
}
