"use client";

import { LancifyLogo } from '@/src/components/LancifyLogo';
import { UserButton, useUser } from "@clerk/nextjs";
import { Briefcase, ChevronDown, Code, CreditCard, DollarSign, FileText, Layers, LayoutDashboard, Palette, Scale, Settings, ShieldCheck, Sparkles, TrendingUp, Users, Video, Wrench, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function App() {
    const { isSignedIn } = useUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'hire' | 'work'>('hire');
    const [howItWorksTab, setHowItWorksTab] = useState<'hiring' | 'finding'>('hiring');
    const [whatsNewOpen, setWhatsNewOpen] = useState(false);
    const [whyLancifyOpen, setWhyLancifyOpen] = useState(false);

    const whatsNewRef = useRef<HTMLDivElement>(null);
    const whyLancifyRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const whyLancifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleWhatsNewEnter = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setWhatsNewOpen(true);
    };

    const handleWhatsNewLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => setWhatsNewOpen(false), 120);
    };

    const handleWhyLancifyEnter = () => {
        if (whyLancifyTimeoutRef.current) clearTimeout(whyLancifyTimeoutRef.current);
        setWhyLancifyOpen(true);
    };

    const handleWhyLancifyLeave = () => {
        whyLancifyTimeoutRef.current = setTimeout(() => setWhyLancifyOpen(false), 120);
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            if (whyLancifyTimeoutRef.current) clearTimeout(whyLancifyTimeoutRef.current);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="sticky top-0 bg-white z-50 border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center justify-between h-[60px]">
                        {/* Logo */}
                        <div className="flex items-center gap-10">
                            <LancifyLogo />

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center gap-7">
                                <button
                                    onMouseEnter={handleWhyLancifyEnter}
                                    onMouseLeave={handleWhyLancifyLeave}
                                    className={`text-[14px] flex items-center gap-1 font-medium transition-colors cursor-pointer ${whyLancifyOpen ? 'text-green-600' : 'text-gray-700 hover:text-gray-900'}`}
                                >
                                    Why Lancify <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${whyLancifyOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <button
                                    onMouseEnter={handleWhatsNewEnter}
                                    onMouseLeave={handleWhatsNewLeave}
                                    className={`text-[14px] flex items-center gap-1 font-medium transition-colors cursor-pointer ${whatsNewOpen ? 'text-green-600' : 'text-gray-700 hover:text-gray-900'}`}
                                >
                                    What&apos;s new <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${whatsNewOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {isSignedIn ? (
                                <div className="hidden lg:flex items-center gap-3">
                                    <UserButton afterSignOutUrl="/" />
                                </div>
                            ) : (
                                <>
                                    <Link
                                        href="/sign-in"
                                        className="hidden lg:inline-block text-[14px] text-gray-700 hover:text-gray-900 px-3"
                                    >
                                        Log in
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu Button */}
                            <div className="lg:hidden flex items-center gap-3">
                                {isSignedIn && <UserButton afterSignOutUrl="/" />}
                                {/* <button
                                    className="p-2"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Lancify Mega Dropdown */}
                {whyLancifyOpen && (
                    <div
                        ref={whyLancifyRef}
                        onMouseEnter={handleWhyLancifyEnter}
                        onMouseLeave={handleWhyLancifyLeave}
                        className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg z-50"
                    >
                        <div className="max-w-[1400px] mx-auto px-6 py-8">
                            <div className="grid grid-cols-4 gap-8">
                                {/* Card 1 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <ShieldCheck className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Everything in One Secure Place
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            Manage the entire work journey—from proposal screening and encrypted video interviews to final contract completion—within a single, unified workspace.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <CreditCard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Secure, Milestone-Based Payments
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            Hire with confidence. Our integrated payment flows ensure funds are only released securely when milestones are met or final project deliverables are approved.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <LayoutDashboard className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Role-Tailored Workflows
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            Experience a platform that adapts to you. Enjoy dedicated, highly-optimized dashboard environments whether you are a client or a freelancer tracking active contracts.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 4 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <Zap className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Frictionless Onboarding
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            Get from sign-up to your first meeting in seconds. Powered by enterprise-grade security, our seamless authentication means less time logging in and more time getting work done.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* What's New Mega Dropdown — full width, flush below navbar */}
                {whatsNewOpen && (
                    <div
                        ref={whatsNewRef}
                        onMouseEnter={handleWhatsNewEnter}
                        onMouseLeave={handleWhatsNewLeave}
                        className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg z-50"
                    >
                        <div className="max-w-[1400px] mx-auto px-6 py-8">
                            <div className="grid grid-cols-3 gap-8">
                                {/* Card 1 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <Video className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Integrated Video Meetings
                                            <span className="ml-2 text-[11px] font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full align-middle">New</span>
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            Experience our brand new &quot;Collaboration Rooms.&quot; HD, end-to-end encrypted video meetings built directly into the platform — interview and collaborate face-to-face without ever needing external links or third-party apps.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <Layers className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Seamless Ecosystem Integration
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            Say goodbye to app-switching. From initial bids and real-time chat to live video calls and milestone payments, every tool you need is now seamlessly integrated into one unified, uninterrupted workflow.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mt-0.5">
                                        <Sparkles className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-semibold text-gray-900 mb-1.5 group-hover:text-green-600 transition-colors">
                                            Premium, High-Fidelity Experience
                                        </h3>
                                        <p className="text-[13px] text-gray-500 leading-relaxed">
                                            We&apos;ve completely overhauled the platform to feature a stunning, card-based UI. With ultra-smooth animations and real-time status tracking, managing complex contracts is now beautifully intuitive.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {/* {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-100 bg-white">
                        <div className="px-6 py-4 space-y-3">
                            <a href="#" className="block text-[14px] text-gray-700">Hire freelancers</a>
                            <a href="#" className="block text-[14px] text-gray-700">Find work</a>
                            <a href="#" className="block text-[14px] text-gray-700">Why Lancify</a>
                            <a href="#" className="block text-[14px] text-gray-700">What&apos;s new</a>
                            <a href="#" className="block text-[14px] text-gray-700">Pricing</a>
                            <a href="#" className="block text-[14px] text-gray-700">For enterprise</a>
                            {!isSignedIn && (
                                <>
                                    <Link href="/sign-in" className="block text-[14px] text-gray-700 w-full text-left">
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )} */}
            </nav>

            {/* Promo Banner — pill on white background */}
            <div className="bg-white px-4 sm:px-6 pt-5 pb-0">
                <div className="max-w-[1400px] mx-auto">
                    <div className="bg-[#d4edda] rounded-2xl sm:rounded-[50px] px-6 sm:px-8 py-4 sm:py-[18px] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <p className="text-[13px] sm:text-[14px] text-gray-900 text-center sm:text-left leading-snug">
                            Stop doing everything. Hire the top 1% of talent on <span className="text-[#001E00] font-semibold">Lancify</span>.
                        </p>
                        <Link
                            href={isSignedIn ? "/role-selection" : "/sign-in"}
                            className="text-[13px] sm:text-[14px] font-bold text-gray-900 underline hover:text-green-800 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                        >
                            Visit dashboard <span className="text-base font-bold leading-none">›</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Hero Section with Video */}
            <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="relative overflow-hidden rounded-3xl">
                        {/* Video Background */}
                        <div className="absolute inset-0 w-full h-full">
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                            >
                                <source
                                    src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/hero-video-lg.mp4"
                                    type="video/mp4"
                                />
                            </video>
                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/40"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 px-6 sm:px-12 lg:px-14 py-10 sm:py-14 lg:py-16">
                            <div className="max-w-xl lg:max-w-2xl">
                                <h1 className="text-[36px] sm:text-[56px] lg:text-[68px] font-bold text-white mb-4 leading-[1.1]">
                                    Work at the speed of your ambition
                                </h1>
                                <p className="text-[15px] sm:text-[18px] text-white font-semibold mb-8 leading-snug">
                                    Hire experts who use AI to amplify their talent, turning complex work into high impact business outcomes
                                </p>

                                {/* Tabs */}
                                <div className="flex bg-white/15 backdrop-blur-sm rounded-full p-1 mb-5 w-full max-w-[540px]">
                                    <button
                                        onClick={() => setActiveTab('hire')}
                                        className={`flex-1 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-medium transition ${activeTab === 'hire'
                                            ? 'bg-[#1a1a1a] text-white'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        I want to hire
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('work')}
                                        className={`flex-1 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-[14px] font-medium transition ${activeTab === 'work'
                                            ? 'ring-2 ring-white text-white bg-white/10'
                                            : 'text-white hover:bg-white/10'
                                            }`}
                                    >
                                        I want to work
                                    </button>
                                </div>

                                {activeTab === 'hire' ? (
                                    <div>
                                        {/* Skill Chips */}
                                        <div className="mt-5 flex flex-wrap gap-2">
                                            {[
                                                'Web design',
                                                'AI development',
                                                'Video editing',
                                                'Google Ads',
                                            ].map((skill) => (
                                                <Link
                                                    key={skill}
                                                    href="/role-selection"
                                                    className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/50 hover:border-white/80 rounded-full text-[13px] font-medium text-white transition group flex items-center gap-1.5"
                                                >
                                                    {skill}
                                                    <span className="opacity-80 group-hover:opacity-100 transition text-sm">→</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl">
                                        <p className="text-[18px] text-white font-semibold mb-5">
                                            Build your freelancing career on Lancify
                                        </p>
                                        {/* Skill Chips */}
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                'Virtual assistant',
                                                'AI expert',
                                                'Video editing',
                                                'Web design',
                                            ].map((skill) => (
                                                <Link
                                                    key={skill}
                                                    href="/role-selection"
                                                    className="px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/50 hover:border-white/80 rounded-full text-[13px] font-medium text-white transition group flex items-center gap-1.5"
                                                >
                                                    {skill}
                                                    <span className="opacity-80 group-hover:opacity-100 transition text-sm">→</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="bg-white py-8 sm:py-10 lg:py-12">
                <div className="max-w-[1400px] mx-auto px-6">
                    <p className="text-center text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-7">
                        Trusted by 800,000 clients
                    </p>
                    <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center gap-6 lg:justify-between w-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <Image width={100} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/airbnb-logo.svg" alt="Airbnb" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={120} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/databricks-logo.svg" alt="Databricks" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={120} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/cloudflare-logo.svg" alt="Cloudflare" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={100} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/scale-ai-logo.svg" alt="Scale AI" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={100} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/microsoft-logo.svg" alt="Microsoft" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={120} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/grammarly-logo.svg" alt="Grammarly" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={120} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/bamboohr-logo.svg" alt="BambooHR" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                        <Image width={120} height={24} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/shutterstock-logo.svg" alt="Shutterstock" className="h-4 sm:h-5 lg:h-6 w-auto object-contain mx-auto sm:mx-0" />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-10 sm:py-12 lg:py-14 bg-white">
                <div className="max-w-[1400px] mx-auto px-6">
                    <h2 className="text-[38px] sm:text-[42px] lg:text-[46px] font-normal text-gray-900 mb-8 lg:mb-10 leading-tight">
                        Find freelancers for every type of work
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                href="/role-selection"
                                className="bg-white rounded-2xl p-5 transition-all select-none border border-gray-200 hover:border-gray-900 hover:ring-2 hover:ring-green-500 hover:ring-offset-1"
                            >
                                <div className="mb-3">
                                    {category.icon}
                                </div>
                                <h3 className="text-[15px] font-normal text-gray-900 leading-snug">
                                    {category.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-10 lg:mb-12 gap-4">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900">
                            How it works
                        </h2>
                        {/* Tab Toggle */}
                        <div className="flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                            <button
                                onClick={() => setHowItWorksTab('hiring')}
                                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition ${howItWorksTab === 'hiring'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                For hiring
                            </button>
                            <button
                                onClick={() => setHowItWorksTab('finding')}
                                className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition ${howItWorksTab === 'finding'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                For finding work
                            </button>
                        </div>
                    </div>

                    {howItWorksTab === 'hiring' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {howItWorksHiring.map((step, index) => (
                                <div key={index} className="group">
                                    <div className="aspect-video rounded-2xl mb-5 sm:mb-6 overflow-hidden relative">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {howItWorksFinding.map((step, index) => (
                                <div key={index} className="group">
                                    <div className="aspect-video rounded-2xl mb-5 sm:mb-6 overflow-hidden relative">
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 sm:py-16">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">For Clients</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition">How to Hire</a></li>
                                <li><a href="#" className="hover:text-white transition">Talent Marketplace</a></li>
                                <li><a href="#" className="hover:text-white transition">Project Catalog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">For Talent</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition">How to Find Work</a></li>
                                <li><a href="#" className="hover:text-white transition">Direct Contracts</a></li>
                                <li><a href="#" className="hover:text-white transition">Find Freelance Jobs</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Resources</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition">Help & Support</a></li>
                                <li><a href="#" className="hover:text-white transition">Success Stories</a></li>
                                <li><a href="#" className="hover:text-white transition">Reviews</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Company</h4>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition">Leadership</a></li>
                                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                        <p className="text-xs sm:text-sm text-gray-400">© 2026 Lancify. All rights reserved.</p>
                        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const categories = [
    {
        name: 'AI Services',
        icon: <Settings className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Development & IT',
        icon: <Code className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Design & Creative',
        icon: <Palette className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Sales & Marketing',
        icon: <TrendingUp className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Writing & Translation',
        icon: <FileText className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Admin & Support',
        icon: <Briefcase className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Finance & Accounting',
        icon: <DollarSign className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Legal',
        icon: <Scale className="w-8 h-8 text-green-500" />
    },
    {
        name: 'HR & Training',
        icon: <Users className="w-8 h-8 text-green-500" />
    },
    {
        name: 'Engineering & Architecture',
        icon: <Wrench className="w-8 h-8 text-green-500" />
    },
];

const howItWorksHiring = [
    {
        title: 'Posting jobs is always free',
        description: 'Generate a job post with AI or create your own and filter talent matches.',
        image: 'https://images.unsplash.com/photo-1759752393882-1b6587a7c887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBwb3N0aW5nJTIwam9iJTIwbGlzdGluZyUyMGxhcHRvcCUyMG9mZmljZXxlbnwxfHx8fDE3NzY3OTkyODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        title: 'Get proposals and hire',
        description: 'Screen, interview, or book a consult with an expert before hiring.',
        image: 'https://images.unsplash.com/photo-1622674777904-386b3ef30c4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXJpbmclMjBpbnRlcnZpZXclMjB0ZWFtJTIwbWVldGluZyUyMGNhbmRpZGF0ZXN8ZW58MXx8fHwxNzc2Nzk5Mjg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        title: 'Pay when work is done',
        description: 'Release payments after approving work, by milestone or upon project completion.',
        image: 'https://images.unsplash.com/photo-1705948354275-d55101017fb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBwYXltZW50JTIwc3VjY2VzcyUyMHRyYW5zYWN0aW9uJTIwbW9iaWxlfGVufDF8fHx8MTc3Njc5OTI4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
];

const howItWorksFinding = [
    {
        title: 'Find clients and remote jobs',
        description: 'Login to Lancify and complete your profile to start browsing available opportunities.',
        image: 'https://images.unsplash.com/photo-1523939158338-1708c2391359?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlbGFuY2VyJTIwcmVtb3RlJTIwd29yayUyMGJyb3dzaW5nJTIwam9icyUyMGxhcHRvcHxlbnwxfHx8fDE3NzY3OTkyODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        title: 'Submit proposals for work',
        description: 'Send customized proposals to clients and showcase your expertise with portfolio work.',
        image: 'https://images.unsplash.com/photo-1599249300675-c39f1dd2d6be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3cml0aW5nJTIwcHJvcG9zYWwlMjBjcmVhdGl2ZSUyMHdvcmslMjBkZXNrfGVufDF8fHx8MTc3Njc5OTI4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
        title: 'Get paid as you deliver work',
        description: 'Receive secure payments through Lancify as you complete milestones and projects.',
        image: 'https://images.unsplash.com/photo-1758522484691-a98f008acdfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVlbGFuY2VyJTIwY2VsZWJyYXRpbmclMjBwYXltZW50JTIwcmVjZWl2ZWQlMjBoYXBweXxlbnwxfHx8fDE3NzY3OTkyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
];