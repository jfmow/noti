
import Link from "@/components/Link";
import { Activity, Gauge, Github, LockIcon } from "lucide-react";
import Head from "next/head";
import { useEffect } from "react";
import PocketBase from 'pocketbase'
import Router from "next/router";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function HomePage() {
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

            <div className="w-full relative">

                <nav className="fixed top-0 z-[5] w-full grid grid-cols-[3fr_1fr] md:grid-cols-3 justify-items-center items-center py-4 px-2 bg-gradient-to-r from-zinc-800 to-gray-900 shadow-lg">
                    <div className="w-full hidden items-center justify-start md:flex">
                        <div className="overflow-hidden w-6 h-6 object-contain">
                            <img alt="Brand logo - mountians with lines" src="/logo-small.webp" />
                        </div>
                        <p className="ml-2 "><span className="font-light">Note</span></p>
                    </div>
                    <div className="w-full flex items-center justify-evenly">
                        <Link href={"/page?edit=rzz50e2mnhgwof2&demo=1"}>Demo</Link>
                        <Link href="/auth/signup" className={"font-semibold"}>Get started</Link>
                        <Link href={"https://github.com/jfmow/noti"}>Self-host</Link>
                        <Link href={"/auth/login"}>Login</Link>
                    </div>
                    <div className="w-full flex items-center justify-end">
                        <Link href={"/auth/signup"} className="p-3 bg-blue-600 rounded-md text-sm hover:bg-blue-700">Get Started</Link>
                    </div>
                </nav>

                <div className="w-full p-4 relative min-h-screen flex items-center justify-center pt-[150px] lg:pt-4">
                    <div class="absolute top-0 z-[0] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

                    <div className="flex items-center justify-center overflow-hidden">
                        <div className="w-[1800px] max-w-[90%] relative z-[1] w-full grid lg:grid-cols-2 justify-items-center items-center overflow-hidden gap-4">

                            <h1 className="text-center text-3xl font-normal text-gray-400 sm:text-6xl">Accelerate your thoughts, <br />become <span className="bg-gradient-to-r from-zinc-500 via-zinc-700 to-zinc-800 bg-clip-text text-transparent">more creative</span></h1>

                            <div>
                                <img alt="desktop and mobile together - page preview" loading="eager" className="hidden lg:block" src="/desktop-preview.webp" />
                                <img alt="mobile - page preview" loading="eager" className="lg:hidden" width={200} height={423} src="/mobile-preview.webp" />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-full p-4 relative min-h-screen flex items-center justify-center bg-[#0c0c0c]">

                    <div className="flex items-center justify-center overflow-hidden">
                        <div className="w-[1800px] max-w-[90%] relative z-[1] w-full grid lg:grid-cols-2 justify-items-center items-center overflow-hidden gap-4">


                            <div className="grid lg:grid-cols-2 gap-6 order-2 lg:order-1">
                                <div className="relative max-w-xs rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
                                    <div
                                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                                    />
                                    <div className="mb-4">
                                        <Github className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="mb-2 font-medium tracking-tight text-neutral-100">
                                        Built on open source
                                    </h3>
                                    <p className="text-sm text-neutral-400">
                                        Created with open source tools, allowing you to know what happens to your data.
                                    </p>
                                </div>
                                <div className="relative max-w-xs rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
                                    <div
                                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                                    />
                                    <div className="mb-4">
                                        <LockIcon className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="mb-2 font-medium tracking-tight text-neutral-100">
                                        Security in mind
                                    </h3>
                                    <p className="text-sm text-neutral-400">
                                        A spotlight on security, because the safety of your data is our
                                        priority.
                                    </p>
                                </div>
                                <div className="relative max-w-xs rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
                                    <div
                                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                                    />
                                    <div className="mb-4">
                                        <Gauge className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="mb-2 font-medium tracking-tight text-neutral-100">
                                        Fast
                                    </h3>
                                    <p className="text-sm text-neutral-400">
                                        A simple desgin allowing for high throughput and small data usage
                                    </p>
                                </div>
                                <div className="relative max-w-xs rounded-3xl border border-neutral-800 bg-neutral-950 p-8">
                                    <div
                                        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
                                    />
                                    <div className="mb-4">
                                        <Activity className="h-8 w-8 text-neutral-400" />
                                    </div>
                                    <h3 className="mb-2 font-medium tracking-tight text-neutral-100">
                                        Reliable
                                    </h3>
                                    <p className="text-sm text-neutral-400">
                                        Making sure you can view and take notes at a moments notice
                                    </p>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <h2 className="text-center text-3xl font-semibold bg-gradient-to-r from-slate-500 to-gray-800 bg-clip-text text-transparent sm:text-6xl">Take notes better than ever!</h2>

                            </div>

                        </div>
                    </div>
                </div>


                <div className="w-full p-4 relative min-h-screen flex items-center justify-center bg-[#0c0c0c]">
                    <div className="flex items-center justify-center">
                        <div className="w-[1800px] max-w-[80%] relative z-[1] w-full grid grid-cols-1 justify-items-center items-center overflow-hidden gap-4">




                            <div>
                                <h2 className="pb-2 text-center text-3xl font-semibold bg-gradient-to-r from-slate-500 to-gray-800 bg-clip-text text-transparent sm:text-6xl"><span className="bg-gradient-to-r from-fuchsia-600 to-blue-600 bg-clip-text text-transparent">Beautiful.</span></h2>
                            </div>

                            <div className="flex items-center justify-center mt-4">
                                <img src="/page-alone.webp" className="rounded max-w-[75%] shadow-lg" />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="w-full min-h-[300px] grid sm:grid-cols-3 lg:grid-cols-5 p-4 text-zinc-300 gap-4">
                    <div>
                        <img alt="Brand logo - mountians with lines" src="/logo-small.webp" className="w-8 h-8" />
                        <p className="mt-2  text-sm">Note - By <Link href={"https://jamesmowat.com/"}>James Mowat</Link></p>
                    </div>
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



            </div>

        </>
    )
}