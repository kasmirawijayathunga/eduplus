'use client'

import React, { useActionState, useState } from 'react';
import Link from 'next/link';

import { handleRegister } from './actions'

const initialState = {
    errors: {}
}

export default function RegisterPage() {
    const [state, formAction, pending] = useActionState(handleRegister, initialState);
    const [showPassword, setShowPassword] = useState(false);
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    })

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Join EduPlus</h1>
        <p className="text-gray-500">Create your student account.</p>
        
        <div className="rounded-lg border bg-white p-8 shadow-sm">
           <form action={formAction} className="space-y-4">
               {state?.errors?.global && (
                    <div className="text-red-500 text-sm font-medium">{state.errors.global[0]}</div>
               )}
               <div>
                   <label className="block text-sm font-medium text-left mb-1">Full Name</label>
                   <input
                        name='name'
                        placeholder='Full Name'
                        value={inputs.name}
                        onChange={(e) => setInputs((data) => ({ ...data, name: e.target.value }))}
                        disabled={pending}
                        className="w-full rounded border p-2 text-sm"
                    />
                    {state?.errors?.name && (
                        <label className="text-red-500 text-xs">{state.errors.name[0]}</label>
                    )}
               </div>
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
                   {pending ? 'Creating Account...' : 'Create Account'}
               </button>
           </form>
           <div className="mt-4 text-xs text-gray-400">
              <Link href="/auth/login" className="text-indigo-500 hover:underline">Already have an account?</Link>
           </div>
        </div>
      </div>
    </div>
  );
}