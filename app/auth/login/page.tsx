'use client'

import React, { useActionState, useState } from 'react';
import Link from 'next/link';

import { handleLogin } from './actions'

const initialState = {
    errors: {}
}

export default function LoginPage() {
    const [state, formAction, pending] = useActionState(handleLogin, initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 w-full">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Welcome to EduPlus</h1>
        <p className="text-gray-500">Sign in to access your dashboard.</p>
        
        <div className="rounded-lg border bg-white p-8 shadow-sm">
           <form action={formAction} className="space-y-4">
               {state?.errors?.global && (
                    <div className="text-red-500 text-sm font-medium">{state.errors.global[0]}</div>
               )}
               <div>
                   <label className="block text-sm font-medium text-left mb-1">Email Address</label>
                   <input
                        name='email'
                        placeholder='Email Address'
                        value={inputs.email}
                        onChange={(e) => setInputs((data) => ({ ...data, email: e.target.value }))}
                        disabled={pending}
                        className="w-full rounded border p-2 text-sm"
                    />
                    {state?.errors?.email && (
                        <label className="text-red-500 text-xs">{state.errors.email[0]}</label>
                    )}
               </div>
               <div>
                   <label className="block text-sm font-medium text-left mb-1">Password</label>
                   <input
                        type={showPassword ? "text" : "password"}
                        name='password'
                        placeholder='Password'
                        value={inputs.password}
                        onChange={(e) => setInputs((data) => ({ ...data, password: e.target.value }))}
                        disabled={pending}
                        className="w-full rounded border p-2 text-sm"
                    />
                    {state?.errors?.password && (
                        <label className="text-red-500 text-xs">{state.errors.password[0]}</label>
                    )}
               </div>
               <button type="submit" disabled={pending} className="block w-full rounded bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                   {pending ? 'Signing In...' : 'Sign In'}
               </button>
           </form>
           <div className="mt-4 text-xs text-gray-400">
              <Link href="/auth/register" className="text-indigo-500 hover:underline">Don't have an account?</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
