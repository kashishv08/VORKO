"use client"
import { LOG_IN } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async(e: any) => {
    e.preventDefault()
    const user :{
      loginUser : boolean
    } = await gqlClient.request(LOG_IN, {
      password, email
    })
    console.log(user)
    if(user.loginUser){
      redirect("/");
    } else {
      alert(":/")
    }
  }
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
          {/* Left Section */}
          <div className="flex flex-col items-center justify-center p-10 bg-gray-50 text-center">
            <h1 className="text-3xl font-bold">Welcome to <br /> FreelanceCollab</h1>
            <p className="mt-4 text-gray-600 text-lg">
              Find the best freelancers for your projects
            </p>
            <Link href={"/"} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium">
              Get started
            </Link>
            <img
              src="/image.png"
              alt="Login Illustration"
              className="mt-10 w-72"
            />
          </div>
  
          {/* Right Section (Login Form) */}
          <div className="flex flex-col justify-center p-10">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
  
              <div className="text-right">
                <a href="#" className="text-blue-600 text-sm hover:underline">
                  Forgot password?
                </a>
              </div>
  
              <button
              onClick={handleLogin}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
              >
                Log in
              </button>
  
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-500 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
  
              <p className="text-center text-gray-600 text-sm">
                Don’t have an account?{' '}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Register
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
  