import React, { useState, useEffect } from 'react';
import { ChevronRight, MousePointer, ArrowRight, PanelsTopLeft } from "lucide-react"
import { Link } from '@/components/UX-Components';
export default function HomePage() {
    const [role, setRole] = useState('students');
    const roles = ['students', 'educators', 'researchers', 'parents', 'kids', 'uni', 'school', 'work', 'life' /* add more roles here if needed */];
    let currentIndex = roles.indexOf(role);

    useEffect(() => {
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % roles.length;
            setRole(roles[currentIndex]);
        }, 2100); // Change the duration (in milliseconds) for the animation
        return () => clearInterval(interval);
    }, [currentIndex]);

    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const exitTimeout = setTimeout(() => {
            setIsExiting(true);
            const enterTimeout = setTimeout(() => {
                setIsExiting(false);
            }, 700); // Adjust this duration to match your animation duration
            return () => clearTimeout(enterTimeout);
        }, 1500); // Adjust this duration to match your interval duration
        return () => clearTimeout(exitTimeout);
    }, [role]);

    return (
        <>
            <div className="w-full h-screen overflow-scroll relative bg-zinc-100">
                <nav className='w-full inline-flex items-center justify-center bg-zinc-100 shadow sticky top-0 left-0 right-0 z-[2]'>

                    <div className='p-4 lg:max-w-[1300px] md:max-w-[800px] sm:max-w-[90%] w-full flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-6 h-6' aria-label='Brand logo'>
                                <img src='logo-small.webp' />
                            </div>
                            <div>
                                <ul aria-label='Navigation items list ' className='flex items-center gap-3 [&>li]:cursor-pointer [&>li]:text-zinc-800 [&>li]:hover:text-zinc-300'>
                                    <li>
                                        <Link href="#features">Explore</Link>
                                    </li>
                                    <li>
                                        <Link href="/demo">Demo</Link>
                                    </li>
                                    <li>
                                        <Link href="/auth/login">Login</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <Link href="/auth/signup" className="font-semibold p-3 bg-zinc-200 hover:bg-zinc-300 rounded-md text-zinc-800 cursor-pointer">
                                Signup
                            </Link>
                        </div>
                    </div>

                </nav>

                <div aria-label="Hero" className="w-full h-screen inline-flex items-center justify-center p-0 sm:m-8">
                    <div className="h-full xl:w-[1024px] lg:w-[800px] md:w-[640px] sm:w-[640px] sm:max-w-[75%] overflow-hidden grid">

                        <div className=" flex flex-col items-center justify-center min-h-[50%] mb-4">
                            <Link href="/demo" className='inline-flex items-center px-3 rounded-xl bg-gray-300 text-gray-600 font-medium text-sm mb-4 shadow-lg border border-gray-400 border-[1px] cursor-pointer'>
                                <div className='py-1 border-r border-r-gray-400 pr-2 mr-2'>
                                    <PanelsTopLeft width={14} />
                                </div>
                                <span className='py-1'>Checkout the demo </span>
                                <div className='py-1 ml-2'>
                                    <ArrowRight width={14} />
                                </div>
                            </Link>
                            <div className="flex flex-col items-center gap-4">
                                <h1 className="text-6xl text-nowrap font-bold bg-gradient-to-r from-slate-600 to-gray-800 bg-clip-text text-transparent">Notes for </h1>

                                <h1 className={`text-6xl  ${isExiting ? 'opacity-0' : 'opacity-100'} transition duration-700 ease-in-out bg-gradient-to-br from-cyan-300 to-blue-500 bg-clip-text text-transparent`}>{role}</h1>
                            </div>
                        </div>

                        <div className='mx-4'>
                            <img src="/abcdef.png" alt="Notes" />
                        </div>
                    </div>
                </div>

                <section className='w-full h-screen grid grid-cols-2 bg-gradient-to-b from-zinc-100 to-zinc-200'>
                    <div className='text-center gap-2 w-full h-full flex items-center justify-center bg-zinc-100 flex flex-col items-center justify-center'>
                        <h2 className='pb-2 font-bold text-6xl bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent'>Creative freedom</h2>
                        <p className='text-balance font-normal text-xl text-gray-600'>
                            Note is a simple tool. Nothing complicated. It has been designed for ease of use because it only serves one job.
                        </p>
                    </div>
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='max-w-full max-h-full'>
                            <img className='object-scale-down h-[70vh] w-full' src="/mobilephone.png" alt="Notes" />
                        </div>
                    </div>
                </section>

                <section className='w-full h-screen grid grid-cols-2 bg-gradient-to-b from-zinc-100 to-zinc-200'>
                    <div className='w-full h-full flex items-center justify-center'>
                        <div className='max-w-full max-h-full'>
                            <img className='object-scale-down h-[70vh] w-full' src="/phonetool.png" alt="Notes" />
                        </div>
                    </div>
                    <div className='text-center gap-2 w-full h-full flex items-center justify-center bg-zinc-100 flex flex-col items-center justify-center'>
                        <h2 className='font-bold text-6xl bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent pb-2'>
                            Easy to use
                        </h2>
                        <p className='text-balance font-normal text-xl text-gray-600'>
                            Easy to share, create, copy. Note makes it easy for you and others to share and colaborate on your notes.
                        </p>
                    </div>

                </section>


            </div>
        </>
    )
}
