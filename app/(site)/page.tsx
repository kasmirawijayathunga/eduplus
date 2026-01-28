import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/eduplus_hero.png" 
            alt="EduPlus Hero" 
            fill 
            className="object-cover opacity-40" 
            priority
          />
        </div>
        <div className="relative z-10 container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Unlock Your Potential with EduPlus
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl">
                The modern Learning Management System designed for student success and seamless teaching experiences.
              </p>
            </div>
            <div className="space-x-4">
              <Link
                href="/auth/register"
                className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Join Now
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 mx-auto md:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="p-4 bg-indigo-100 rounded-full">
                        <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold">Diverse Courses</h2>
                    <p className="text-gray-500">Access a wide range of subjects from engineering to arts, curated by top professors.</p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                     <div className="p-4 bg-purple-100 rounded-full">
                        <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold">Track Progress</h2>
                    <p className="text-gray-500">Visualize your learning journey with our advanced dashboard and analytics.</p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                     <div className="p-4 bg-pink-100 rounded-full">
                        <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold">Community</h2>
                    <p className="text-gray-500">Collaborate with peers and instructors through our integrated communication tools.</p>
                </div>
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 mx-auto md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started with EduPlus in three simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xl">1</div>
                <h3 className="text-xl font-bold">Create Account</h3>
                <p className="text-gray-500">Sign up for free and set up your student or instructor profile.</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xl">2</div>
                <h3 className="text-xl font-bold">Choose Courses</h3>
                <p className="text-gray-500">Explore our vast library and enroll in courses that interest you.</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xl">3</div>
                <h3 className="text-xl font-bold">Start Learning</h3>
                <p className="text-gray-500">Access high-quality content, track your progress, and get certified.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 mx-auto md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of satisfied learners and educators.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-12 mt-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <blockquote className="space-y-2">
                    <p className="text-lg text-gray-600">"EduPlus has completely transformed the way I learn. The courses are structured perfectly, and the instructors are top-notch."</p>
                    <footer className="text-sm font-semibold text-indigo-600">– Alex Johnson, Computer Science Student</footer>
                </blockquote>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                 <blockquote className="space-y-2">
                    <p className="text-lg text-gray-600">"As an instructor, I find the platform incredibly intuitive. Managing my courses and communicating with students has never been easier."</p>
                    <footer className="text-sm font-semibold text-indigo-600">– Prof. Sarah Williams, History Dept.</footer>
                </blockquote>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}