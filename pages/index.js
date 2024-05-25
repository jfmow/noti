import { Check, CheckCircle, Menu, MinusCircle, PlusCircle } from "lucide-react";
import Head from "next/head";
import { createContext, useContext, useEffect, useState } from "react";
const HomePageContext = createContext()
import PocketBase from 'pocketbase'
import Router from "next/router";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function HomePage() {
    const [mobile, setIsOnMobile] = useState(false)
    useEffect(() => {
        if (window) {
            if (window.innerWidth < 500) {
                setIsOnMobile(true)
            }
        }
    }, [])
    useEffect(() => {
        function authRefresh() {
            try {
                pb.collection('users').authRefresh().then(((okres) => {
                    if (pb.authStore.isValid) {
                        Router.push("/page")
                    }
                    return
                }), ((notokres) => {
                    return
                }));

            } catch {

            }
        }
        authRefresh()
    }, [])
    return (
        <HomePageContext.Provider value={{ mobile }}>
            <Head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Note</title>
                <link rel="icon" href="/logo-small.webp" />
                <meta name="description" content="Note. The notes app for you, simple, fast, free." />
            </Head>
            <main className="w-full min-h-[100svh] bg-[#f2efe1] text-zinc-900 relative">
                <Navigation />
                <Header />
                <TwoImagesSection />
                <FAQ />
                <Pricing />
                <Footer />
            </main>
        </HomePageContext.Provider>
    )
}

function Header() {
    const { mobile } = useContext(HomePageContext)
    return (
        <div className="w-full h-[100svh] flex place-content-center items-center flex-none flex-row gap-[10px] overflow-hidden py-[100px] relative w-full">
            <div className="flex flex-col justify-between items-center gap-3 px-4">
                {mobile ? (
                    <h1 className="text-7xl w-full text-left">The <br />Notes<br /> From<br /> You.</h1>
                ) : (
                    <h1 className="text-7xl">The Notes From You.</h1>
                )}
                {!mobile ? (
                    <p className="text-zinc-500 font-medium text-2xl text-center text-balance">
                        Go from thought to memory with Note,<br /> the Notepad for the 21st<br /> century
                    </p>
                ) : null}

                {mobile ? (
                    <div className="">
                        <img alt="Half a mobile page preview" className="" src="/home/mobilephone-half.webp" />
                    </div>
                ) : (
                    <div className="max-w-[1000px] mt-4">
                        <img alt="Desktop and mobile preview of note" src="/home/full-preview.webp" />
                    </div>
                )}
            </div>

        </div>
    )
}

function Navigation() {
    const { mobile } = useContext(HomePageContext)
    const [navOpen, setNavOpen] = useState(false)

    if (mobile) {
        return (
            <div className="grid ">
                <nav className="bg-zinc-100 w-full border-b p-3 flex items-center justify-between" style={navOpen ? { border: "none" } : {}}>
                    <div aria-label="Logo" className="object-contain w-7 h-7 overflow-hidden">
                        <img alt="logo" src="/logo-small.webp" />
                    </div>
                    <button onClick={() => setNavOpen(prevValue => !prevValue)}>
                        <Menu width={24} height={24} />
                    </button>
                </nav>
                {navOpen ? (
                    <ul className="bg-zinc-100 animate-fade-down animate-once animate-duration-[800ms] animate-ease-in-out animate-normal animate-fill-both border-b flex flex-col items-start p-4 gap-4 font-bold text-3xl" aria-label="Navigation bar links">
                        <li><a href="#features">Features</a></li>
                        <li><a href="/demo">Demo</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        <li><a href="/auth/login">Login</a></li>
                    </ul>
                ) : null}
            </div>

        )
    }

    return (
        <nav className="bg-zinc-100 w-full border-b p-3 flex items-center">
            <div aria-label="Logo" className="object-contain w-9 h-9 overflow-hidden">
                <img alt="Logo" src="/logo-small.webp" />
            </div>
            <ul className="ml-3 flex items-center gap-4 font-medium text-md" aria-label="Navigation bar links">
                <li><a href="#features">Features</a></li>
                <li><a href="/demo">Demo</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="/auth/login">Login</a></li>
            </ul>
        </nav>
    )
}

function TwoImagesSection() {
    return (
        <div id="features" className="bg-zinc-100 w-full flex place-content-center items-center flex-none flex-row gap-[10px] h-min overflow-hidden py-[100px] relative w-full">
            <div className="grid sm:grid-cols-2 items-center gap-10 sm:gap-5">
                <div className="max-h-[30vh] object-contain overflow-hidden aspect-square rounded-xl flex items-center justify-center">
                    <img alt="Note page with text" loading="lazy" src="/home/simple-boximg-1.webp" />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-zinc-800 text-5xl">Simple</h2>
                    <p className="font-medium text-zinc-600 text-xl">
                        Writing notes has never<br /> been so effortless.
                    </p>
                </div>
                {/**2nd Image row */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-zinc-800 text-5xl">Easy</h2>
                    <p className="font-medium text-zinc-600 text-xl">
                        Works like the tools your<br /> already familiar with
                    </p>
                </div>
                <div className="max-h-[30vh] object-contain overflow-hidden aspect-square rounded-xl flex items-center justify-center">
                    <img alt="Note page with text highlighted, shows block selector menu" loading="lazy" src="/home/easy-boximg-2.webp" />
                </div>
            </div>
        </div>
    )
}

function FAQ() {
    return (
        <div id="faq" className="w-full flex place-content-center items-center flex-none flex-row gap-[10px] h-min overflow-hidden py-[100px] relative w-full">
            <div className="grid items-center text-center gap-10 px-4">

                <h2 className="text-zinc-800 text-5xl">Frequently asked questions</h2>
                <div className="w-[765px] max-w-[90vw] text-left">
                    <div className="space-y-4">
                        <details className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h3 className="font-medium">What is Note?</h3>

                                <span className="relative size-5 shrink-0">
                                    <PlusCircle className="absolute inset-0 opacity-100 group-open:opacity-0" />
                                    <MinusCircle className="absolute inset-0 opacity-0 group-open:opacity-100" />
                                </span>
                            </summary>

                            <p className="mt-4 leading-relaxed text-gray-700">
                                Note is a web note taking platform which has been desgined to be as simple to use as posible.
                            </p>
                        </details>

                        <details className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h3 className="font-medium">Is it easy to learn</h3>

                                <span className="relative size-5 shrink-0">
                                    <PlusCircle className="absolute inset-0 opacity-100 group-open:opacity-0" />
                                    <MinusCircle className="absolute inset-0 opacity-0 group-open:opacity-100" />
                                </span>
                            </summary>

                            <p className="mt-4 leading-relaxed text-gray-700">
                                Yes!
                            </p>
                        </details>
                        <details className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
                                <h3 className="font-medium">Why should I pay?</h3>

                                <span className="relative size-5 shrink-0">
                                    <PlusCircle className="absolute inset-0 opacity-100 group-open:opacity-0" />
                                    <MinusCircle className="absolute inset-0 opacity-0 group-open:opacity-100" />
                                </span>
                            </summary>

                            <p className="mt-4 leading-relaxed text-gray-700">
                                You shouldn't. It's really hard to actualy hit the limits so you should only ever think about paying once you hit them.
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Pricing() {
    return (
        <div id="pricing" className="bg-zinc-100 w-full flex place-content-center items-center flex-none flex-row gap-[10px] h-min overflow-hidden py-[100px] relative w-full">
            <div className="grid text-center gap-10">
                <h2 className="text-zinc-800 text-5xl">Pricing</h2>
                <div className="flex items-center gap-10">

                    <div class="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
                            <div
                                class="rounded-2xl border border-indigo-600 p-6 shadow-sm ring-1 ring-indigo-600 sm:order-last sm:px-8 lg:p-12"
                            >
                                <div class="text-center">
                                    <h2 class="text-lg font-medium text-gray-900">
                                        Personal
                                        <span class="sr-only">Plan</span>
                                    </h2>

                                    <p class="mt-2 sm:mt-4">
                                        <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 0$ </strong>

                                        <span class="text-sm font-medium text-gray-700">/month</span>
                                    </p>
                                </div>

                                <ul class="mt-6 space-y-2">
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> ∞ Pages </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> Sharing features </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> 5MB Per file </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> Email support </span>
                                    </li>


                                </ul>

                                <a
                                    href="/auth/signup?plan=personal"
                                    class="mt-8 block rounded-full border border-indigo-600 bg-indigo-600 px-12 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700 hover:ring-1 hover:ring-indigo-700 focus:outline-none focus:ring active:text-indigo-500"
                                >
                                    Get Started
                                </a>
                            </div>

                            <div class="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12">
                                <div class="text-center">
                                    <h2 class="text-lg font-medium text-gray-900">
                                        Pro
                                        <span class="sr-only">Plan</span>
                                    </h2>

                                    <p class="mt-2 sm:mt-4">
                                        <strong class="text-3xl font-bold text-gray-900 sm:text-4xl"> 5$ </strong>

                                        <span class="text-sm font-medium text-gray-700">/month</span>
                                    </p>
                                </div>

                                <ul class="mt-6 space-y-2">
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> ∞ Pages </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> Sharing features </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> 25MB Per file </span>
                                    </li>
                                    <li class="flex items-center gap-1">
                                        <Check className="size-5 text-indigo-700" />
                                        <span class="text-gray-700"> Email support </span>
                                    </li>
                                </ul>

                                <a
                                    href="/auth/signup?plan=pro"
                                    class="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                                >
                                    Get Started
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



function Footer() {
    const { mobile } = useContext(HomePageContext)
    return (
        <footer className="text-center w-full min-h-[140px] grid sm:grid-cols-3 gap-5 items-center justify-center p-4">
            <div className="sm:text-left">
                <small className="font-bold">Copyright James Mowat 2024-Present</small>
            </div>
            {mobile ? null : (
                <div>

                </div>
            )}
            <div className="sm:text-right">
                <ul>
                    <li><a href="https://github.com/jfmow/noti">Github</a></li>
                    <li><a href="mailto:hi@suddsy.dev">Email</a></li>
                </ul>
            </div>
        </footer>
    )
}