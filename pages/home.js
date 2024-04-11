import React, { useState, useEffect } from 'react';
import { ChevronRight, MousePointer, ArrowRight, PanelsTopLeft } from "lucide-react"
import { Link } from '@/components/UX-Components';
export default function HomePage() {
    const [role, setRole] = useState('student');
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
            <div className="w-full min-h-screen bg-zinc-100">
                <nav className='w-full inline-flex items-center justify-center'>

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

                <div aria-label="Hero" className="w-full h-screen inline-flex items-center justify-center">
                    <div className="xl:w-[1024px] lg:w-[800px] md:w-[640px] sm:w-[640px] max-w-[75%] overflow-hidden inline-flex flex-col items-center justify-center">
                        <div className="mt-12 xl:mt-0 flex flex-col items-center justify-center min-h-[300px]">
                            <Link href="/demo" className='inline-flex items-center px-3 rounded-xl bg-gray-300 text-gray-600 font-medium text-sm mb-4 shadow-lg border border-gray-400 border-[1px] cursor-pointer'>
                                <div className='py-1 border-r border-r-gray-400 pr-2 mr-2'>
                                    <PanelsTopLeft width={14} />
                                </div>
                                <span className='py-1'>Checkout the demo </span>
                                <div className='py-1 ml-2'>
                                    <ArrowRight width={14} />
                                </div>
                            </Link>
                            <div className=" overflow-clip flex flex-col items-center gap-4">
                                <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-600 to-gray-800 bg-clip-text text-transparent">Notes for </h1>

                                <h1 className={`text-6xl ${isExiting ? 'opacity-0' : 'opacity-100'} transition duration-700 ease-in-out bg-gradient-to-br from-cyan-300 to-blue-500 bg-clip-text text-transparent`}>{role}</h1>
                            </div>
                        </div>
                        <img src="/abcdef.png" alt="Notes" />
                    </div>
                </div>
            </div>
        </>
    )
}
