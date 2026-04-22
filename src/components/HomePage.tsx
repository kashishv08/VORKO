import { Search, Menu, X, ChevronDown, Settings, Code, Palette, TrendingUp, FileText, Briefcase, DollarSign, Scale, Users, Wrench } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function App() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'hire' | 'work'>('hire');
    const [howItWorksTab, setHowItWorksTab] = useState<'hiring' | 'finding'>('hiring');

    // Mock user state - replace with actual auth logic
    const [userState] = useState<'not_logged_in' | 'logged_in' | 'role_selected' | 'onboarded'>('not_logged_in');

    const handleGetStarted = () => {
        switch (userState) {
            case 'not_logged_in':
                window.location.href = '/login';
                break;
            case 'logged_in':
                window.location.href = '/role-selection';
                break;
            case 'role_selected':
                window.location.href = '/onboarding';
                break;
            case 'onboarded':
                window.location.href = '/dashboard';
                break;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center">
                                <span className="text-2xl font-bold text-gray-900">Lancify</span>
                            </Link>

                            {/* Desktop Menu */}
                            <div className="hidden lg:flex items-center gap-6">
                                <button className="text-sm font-medium text-gray-900 hover:text-green-600 flex items-center gap-1">
                                    Why Lancify <ChevronDown className="w-4 h-4" />
                                </button>
                                <button className="text-sm font-medium text-gray-900 hover:text-green-600 flex items-center gap-1">
                                    {"What's new"} <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden lg:inline-block text-sm font-medium text-gray-900 hover:text-green-600">
                                Log in
                            </Link>
                            <button className="hidden lg:inline-block px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition">
                                Sign up
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                className="lg:hidden p-2"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 py-4 space-y-3">
                            <a href="#" className="block text-sm font-medium text-gray-900">Why Lancify</a>
                            <a href="#" className="block text-sm font-medium text-gray-900">{"What's new"}</a>
                            <a href="/login" className="block text-sm font-medium text-gray-900">Log in</a>
                            <button className="w-full px-6 py-2 bg-green-600 text-white rounded-full font-medium">
                                Sign up
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-green-50 to-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                            Stop doing everything. Hire the top 1% of talent on Business Plus.
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="text-xs sm:text-sm font-medium text-green-600 hover:text-green-700 flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                            Get started <span>→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section with Video */}
            <section className="bg-white pt-6 pb-12 sm:pt-8 sm:pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
                            <div className="max-w-xl lg:max-w-2xl">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white mb-4 sm:mb-5 leading-tight">
                                    Work at the speed of your ambition
                                </h1>
                                <p className="text-sm sm:text-base text-white/90 mb-8 sm:mb-10">
                                    Hire experts who use AI to amplify their talent, turning complex work into high impact business outcomes
                                </p>

                                {/* Tabs */}
                                <div className="inline-flex bg-black/30 backdrop-blur-sm rounded-full p-1 mb-4">
                                    <button
                                        onClick={() => setActiveTab('hire')}
                                        className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition ${activeTab === 'hire'
                                            ? 'bg-white text-gray-900'
                                            : 'text-white hover:text-white/80'
                                            }`}
                                    >
                                        I want to hire
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('work')}
                                        className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition ${activeTab === 'work'
                                            ? 'bg-white text-gray-900'
                                            : 'text-white hover:text-white/80'
                                            }`}
                                    >
                                        I want to work
                                    </button>
                                </div>

                                {activeTab === 'hire' ? (
                                    <div>
                                        {/* Search Input */}
                                        <div className="flex items-stretch gap-0 bg-white rounded-full overflow-hidden shadow-lg max-w-2xl">
                                            <div className="flex items-center px-4 sm:px-5 flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Describe what you need to hire for…"
                                                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500 py-3 sm:py-3.5 text-sm sm:text-base"
                                                />
                                            </div>
                                            <button className="px-5 sm:px-8 py-3 sm:py-3.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2">
                                                <Search className="w-4 h-4" />
                                                Search
                                            </button>
                                        </div>

                                        {/* Skill Chips */}
                                        <div className="mt-5 sm:mt-6 flex flex-wrap gap-2">
                                            {[
                                                'Web design',
                                                'AI development',
                                                'Video editing',
                                                'Google Ads',
                                            ].map((skill) => (
                                                <button
                                                    key={skill}
                                                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 hover:border-white/50 rounded-full text-xs sm:text-sm font-medium text-white transition group flex items-center gap-1.5"
                                                >
                                                    {skill}
                                                    <span className="opacity-70 group-hover:opacity-100 transition">→</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl">
                                        <p className="text-base sm:text-lg text-white mb-5">
                                            Build your freelancing career on Lancify
                                        </p>
                                        <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition">
                                            Explore recently posted jobs
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="bg-white py-12 sm:py-16 lg:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-xs uppercase tracking-wider text-gray-400 mb-10 sm:mb-12 lg:mb-14">
                        Trusted by 800,000 clients
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-12 lg:gap-16">
                        <Image width={100} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/airbnb-logo.svg" alt="Airbnb" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={120} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/databricks-logo.svg" alt="Databricks" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={120} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/cloudflare-logo.svg" alt="Cloudflare" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={100} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/scale-ai-logo.svg" alt="Scale AI" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={100} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/microsoft-logo.svg" alt="Microsoft" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={120} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/grammarly-logo.svg" alt="Grammarly" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={120} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/bamboohr-logo.svg" alt="BambooHR" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                        <Image width={120} height={32} src="https://acquisition-ui-assets.static-upwork.com/brontes/canopy/shutterstock-logo.svg" alt="Shutterstock" className="h-6 sm:h-7 lg:h-8 w-auto object-contain" />
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-gray-900 mb-8 sm:mb-10 lg:mb-12">
                        Find freelancers for every type of work
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                        {categories.map((category, index) => (
                            <a
                                key={index}
                                href="#"
                                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 lg:p-8 hover:border-green-500 hover:shadow-lg transition group"
                            >
                                <div className="mb-4 sm:mb-5">
                                    {category.icon}
                                </div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-green-600 transition">
                                    {category.name}
                                </h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                    <div className="aspect-video bg-gray-200 rounded-2xl mb-5 sm:mb-6 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                {step.icon}
                                            </div>
                                        </div>
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
                                    <div className="aspect-video bg-gray-200 rounded-2xl mb-5 sm:mb-6 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                                                {step.icon}
                                            </div>
                                        </div>
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        icon: <Settings className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Development & IT',
        icon: <Code className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Design & Creative',
        icon: <Palette className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Sales & Marketing',
        icon: <TrendingUp className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Writing & Translation',
        icon: <FileText className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Admin & Support',
        icon: <Briefcase className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Finance & Accounting',
        icon: <DollarSign className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Legal',
        icon: <Scale className="w-10 h-10 text-green-600" />
    },
    {
        name: 'HR & Training',
        icon: <Users className="w-10 h-10 text-green-600" />
    },
    {
        name: 'Engineering & Architecture',
        icon: <Wrench className="w-10 h-10 text-green-600" />
    },
];

const howItWorksHiring = [
    {
        icon: <FileText className="w-8 h-8 text-green-600" />,
        title: 'Posting jobs is always free',
        description: 'Generate a job post with AI or create your own and filter talent matches.',
    },
    {
        icon: <Users className="w-8 h-8 text-green-600" />,
        title: 'Get proposals and hire',
        description: 'Screen, interview, or book a consult with an expert before hiring.',
    },
    {
        icon: <DollarSign className="w-8 h-8 text-green-600" />,
        title: 'Pay when work is done',
        description: 'Release payments after approving work, by milestone or upon project completion.',
    },
];

const howItWorksFinding = [
    {
        icon: <Search className="w-8 h-8 text-green-600" />,
        title: 'Find clients and remote jobs',
        description: 'Login to Lancify and complete your profile to start browsing available opportunities.',
    },
    {
        icon: <FileText className="w-8 h-8 text-green-600" />,
        title: 'Submit proposals for work',
        description: 'Send customized proposals to clients and showcase your expertise with portfolio work.',
    },
    {
        icon: <DollarSign className="w-8 h-8 text-green-600" />,
        title: 'Get paid as you deliver work',
        description: 'Receive secure payments through Lancify as you complete milestones and projects.',
    },
];
