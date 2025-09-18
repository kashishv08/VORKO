import { Code, FileText, PenTool, Video } from "lucide-react";
import Header from "./Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-gray-900">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 max-w-6xl w-full">
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold leading-snug">
            Find the perfect freelancer for your project
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Hire expert freelancers for any job, online.
          </p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
            Get Started
          </button>
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="/image.png"
            alt="Freelancer Illustration"
            className="w-80 md:w-96"
          />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="w-full max-w-6xl px-8 py-12">
        <h3 className="text-2xl font-bold mb-6">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: <Code className="w-6 h-6 text-blue-600" />,
              title: "Web Development",
            },
            {
              icon: <PenTool className="w-6 h-6 text-blue-600" />,
              title: "Graphic Design",
            },
            {
              icon: <FileText className="w-6 h-6 text-blue-600" />,
              title: "Writing",
            },
            {
              icon: <Video className="w-6 h-6 text-blue-600" />,
              title: "Video Editing",
            },
          ].map((category, index) => (
            <div
              key={index}
              className="rounded-2xl shadow-sm hover:shadow-md transition border border-gray-200 flex flex-col items-center justify-center gap-2 py-6"
            >
              {category.icon}
              <p className="font-medium">{category.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="w-full max-w-6xl px-8 py-12">
        <h3 className="text-2xl font-bold mb-6">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              number: "1",
              title: "Create an account",
              desc: "Sign up and create a free account",
            },
            {
              number: "2",
              title: "Explore",
              desc: "Search through thousands profiles",
            },
            {
              number: "3",
              title: "Hire",
              desc: "Contact and hire the right freelancer",
            },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                {step.number}
              </div>
              <h4 className="mt-4 font-semibold text-lg">{step.title}</h4>
              <p className="mt-2 text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
