import React, { useState, useEffect } from 'react';
import { ChevronRight, MousePointer, ArrowRight, PanelsTopLeft, Check, X, InfinityIcon } from "lucide-react"
import { Link } from '@/components/UX-Components';
import Head from "next/head";
import PocketBase from 'pocketbase'
import Router from "next/router";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);
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

    useEffect(() => {
        async function authRefresh() {
            try {
                const authData = await pb.collection('users').authRefresh();
                if (pb.authStore.isValid) {
                    Router.push("/page")
                }
            } catch {

            }
        }
        authRefresh()
    }, [])

    return (
        <>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Note</title>
                <link rel="icon" href="/logo-small.webp" />
                <meta name="description" content="Note. The notes app for you, simple, fast, free." />
            </Head>
            <div className="w-full min-h-screen bg-zinc-100">
                <nav className='w-full inline-flex items-center justify-center bg-zinc-100 shadow'>

                    <div className='p-4 lg:max-w-[1300px] md:max-w-[800px] sm:max-w-[90%] w-full flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-6 h-6' aria-label='Brand logo'>
                                <img alt="Logo" src='logo-small.webp' />
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
                            <img src="/home/full-preview.webp" alt="Notes" />
                        </div>
                    </div>
                </div>

                <section id='features' className='w-full h-screen grid sm:grid-cols-2 bg-gradient-to-b from-zinc-100 to-zinc-200 '>
                    <div className='text-center gap-2 w-full h-full flex items-center justify-center bg-zinc-100 flex flex-col items-center justify-center px-4 sm:px-0'>
                        <h2 className='pb-2 font-bold text-6xl bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent'>Creative freedom</h2>
                        <p className='text-balance font-normal text-xl text-gray-600'>
                            Note is a simple tool. Nothing complicated. It has been designed for ease of use because it only serves one job.
                        </p>
                    </div>
                    <div className='w-full h-full flex items-center justify-center sm:block hidden'>
                        <div className='max-w-full max-h-full'>
                            <img className='object-scale-down h-[70vh] w-full' loading='lazy' src="/home/mobilephone.webp" alt="Notes" />
                        </div>
                    </div>
                </section>

                <section className='w-full h-screen grid sm:grid-cols-2 bg-gradient-to-b from-zinc-100 to-zinc-200 '>
                    <div className='sm:block hidden w-full h-full flex items-center justify-center'>
                        <div className='max-w-full max-h-full'>
                            <img loading='lazy' className='object-scale-down h-[70vh] w-full' src="/home/phonetool.webp" alt="Notes" />
                        </div>
                    </div>
                    <div className='text-center gap-2 w-full h-full flex items-center justify-center bg-zinc-100 flex flex-col items-center justify-center px-4 sm:px-0'>
                        <h2 className='font-bold text-6xl bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent pb-2'>
                            Easy to use
                        </h2>
                        <p className='text-balance font-normal text-xl text-gray-600'>
                            Easy to share, create, copy. Note makes it easy for you and others to share and colaborate on your notes.
                        </p>
                    </div>

                </section>

                <section className='w-full min-h-screen flex items-center justify-center flex-col py-16'>
                    <div className='pb-2 mb-2'>
                        <h2 className='pb-2 font-bold text-6xl bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent'>Pricing</h2>
                    </div>
                    <div className='flex items-center justify-center w-full flex-wrap gap-4'>
                        <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm w-[350px] max-w-[80vw]">
                            <div class="p-6 sm:px-8">
                                <h2 class="text-lg font-medium text-gray-900">
                                    Starter
                                    <span class="sr-only">Plan</span>
                                </h2>

                                <p class="mt-2 text-gray-700">All you should ever really need.</p>

                                <p class="mt-2 sm:mt-4">
                                    <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> $0 </strong>

                                    <span class="text-sm font-medium text-gray-700">/month</span>
                                </p>

                                <a
                                    class="mt-4 block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-6"
                                    href="/auth/signup?plan=starter"
                                >
                                    Get Started
                                </a>
                            </div>

                            <div class="p-6 sm:px-8">
                                <p class="text-lg font-medium text-gray-900 sm:text-xl">What's included:</p>

                                <ul class="mt-2 space-y-2 sm:mt-4">
                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> ♾️ pages </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> 5mb upload limit {`(per file)`} </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> 2.5GB storage quota </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> Email support </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <X class="size-5 text-red-700" />

                                        <span class="text-gray-700"> Teams access </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <X class="size-5 text-red-700" />

                                        <span class="text-gray-700"> Multiple editors </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm w-[350px] max-w-[80vw]">
                            <div class="p-6 sm:px-8">
                                <h2 class="text-lg font-medium text-gray-900">
                                    Thinker
                                    <span class="sr-only">Plan</span>
                                </h2>

                                <p class="mt-2 text-gray-700">For all your big dreams.</p>

                                <p class="mt-2 sm:mt-4">
                                    <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> $4 </strong>

                                    <span class="text-sm font-medium text-gray-700">/month</span>
                                </p>

                                <a
                                    class="mt-4 block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500 sm:mt-6"
                                    href="/auth/signup?plan=thinker"
                                >
                                    Get Started
                                </a>
                            </div>

                            <div class="p-6 sm:px-8">
                                <p class="text-lg font-medium text-gray-900 sm:text-xl">What's included:</p>

                                <ul class="mt-2 space-y-2 sm:mt-4">
                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> ♾️ pages </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> 10mb upload limit {`(per file)`} </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> 5GB storage quota </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> Email support </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <X class="size-5 text-red-700" />

                                        <span class="text-gray-700"> Teams access </span>
                                    </li>

                                    <li class="flex items-center gap-1">
                                        <Check class="size-5 text-indigo-700" />

                                        <span class="text-gray-700"> Multiple editors </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <span aria-label='disclamer' className='text-zinc-400'>All prices shown are in USD</span>
                    </div>
                </section>
                <div className='bg-gradient-to-r from-fuchsia-300 to-amber-300 w-full'>
                    <section className='w-full h-[70vh] flex items-center justify-center flex-col p-4 '>
                        <div>
                            <h1 className="text-6xl text-center font-bold bg-gradient-to-r from-fuchsia-600 to-yellow-600 bg-clip-text text-transparent pb-2">Start writing today!</h1>

                        </div>
                        <div className='mt-8'>
                            <Link href="/auth/signup" className="p-4 rounded-md shadow bg-zinc-100 text-zinc-700 font-semibold text-lg cursor-pointer">Get started</Link>
                        </div>
                    </section>
                    <footer className='border-t w-full p-12 flex items-center justify-center flex-col bg-zinc-50/40'>

                        <div className="w-full py-6 grid sm:grid-cols-3 p-4 text-zinc-800 gap-4">
                            <div className="flex flex-col">
                                <Link href={"/page?edit=previewwelcome0"}>Demo</Link>
                                <Link href={"https://github.com/jfmow/noti"}>Self-host</Link>
                                <Link href={"/auth/login"}>Login</Link>
                                <Link href={"/auth/login"}>Signup</Link>
                            </div>
                            <div className="flex flex-col">
                                <Link href={"/auth/terms-and-conditions"}>Terms and Conditions</Link>
                                <Link href={"/auth/privacy-policy"}>Privacy Policy</Link>
                            </div>
                            <div>
                                <p className="font-semibold">Contact:</p>
                                <p>hi@suddsy.dev</p>
                                <br />
                                <p className="font-semibold">Emails from:</p>
                                <p>hi@projects.suddsy.dev</p>
                            </div>
                            <div>

                            </div>
                        </div>
                        <div>
                            <span className='text-zinc-400'>Copyright James Mowat 2023-Present</span>
                        </div>
                    </footer>
                </div>



            </div>
        </>
    )
}
