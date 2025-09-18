"use client"
import { CREATE_USER } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("CLIENT")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async(e: any) => {
    e.preventDefault()
    setLoading(true)
    const user :{
      createUser : boolean
    } = await gqlClient.request(CREATE_USER, {
      password,email,name, role
    })
    if(user.createUser){
      setLoading(false);
      redirect("/")
    } else {
      alert(":/")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Join FreelanceCollab</h1>
        <p className="text-gray-600 text-lg mb-6">
          Create an account and start your freelance journey today
        </p>
        <Link href={"/"} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow">
          Get started
        </Link>
        <img
          src="/image.png"
          alt="Signup Illustration"
          className="mt-8 w-80"
        />
      </div>

      {/* Right Section (Signup Form) */}
      <div className="flex-1 flex flex-col justify-center px-10 py-12 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
                          value={email}
                          onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
                          value={password}
                          onChange={(e)=>setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              className="mt-1 block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role" className="text-blue-600" 
                              value="FREELANCER"
                              onChange={(e) => setRole(e.target.value as "FREELANCER")}/>
                <span>Freelancer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="role"  className="text-blue-600" 
                              value="CLIENT"
                              onChange={(e) => setRole(e.target.value as "CLIENT")}/>
                <span>Client</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow"
            onClick={handleSignUp}
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account? {" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}