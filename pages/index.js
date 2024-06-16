import Head from "next/head";
import { useEffect, useState } from "react";
import PocketBase from 'pocketbase'
import Router from "next/router";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL);
pb.autoCancellation(false);

export default function Home() {
    const [mobile, setIsOnMobile] = useState(false)
    useEffect(() => {
        if (window) {
            if (window.innerWidth < 640) {
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
        <>
            <Head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                </style>
            </Head>
            <div className="w-full h-[100svh] overflow-y-scroll relative bg-homebackground text-hometext">
                <nav className="w-full p-4 flex items-center justify-between  bg-homebackground z-[2] border-b sticky top-0">
                    <div className="flex gap-2 items-center">
                        <img src="/logo-small.webp" width={32} />
                        <ul className="flex gap-2 items-center">
                            <li className="cursor-pointer"><a href="/auth/login">Login</a></li>
                            <li className="cursor-pointer"><a href="/auth/signup">Signup</a></li>
                            <li className="cursor-pointer"><a href="/demo">Demo</a></li>
                            <li className="cursor-pointer"><a href="https://github.com/jfmow/noti">Github</a></li>
                        </ul>
                    </div>
                </nav>
                <header className="ml-auto mr-auto min-h-[100svh] w-fit p-5 flex items-center justify-center flex-col">

                    <div className="text-center">
                        <h1 className="font-bold text-6xl word-wrap">Learn, <span className="bg-gradient-to-r from-homeprimary to-homeaccent bg-clip-text text-transparent">write</span>, revise, repeat</h1>
                        <p className="mt-2 text-xl opacity-70 text-balance">Let Note handle the rembering for you,{mobile ? "" : (<br />)} so you can focus on performing your best</p>
                    </div>

                    <div className="max-w-[1000px] mt-4 p-3">
                        <img alt="Desktop and mobile preview of note" src="/home/full-preview.webp" />
                    </div>

                    <div className="flex gap-4 items-center justify-center">
                        <a href="/demo" className="cursor-pointer hover:bg-homesecondary/70 px-6 py-3 rounded-lg bg-homesecondary/30">View the Demo</a>
                        <a href="/auth/signup" className="cursor-pointer hover:bg-homeprimary px-6 py-3 rounded-lg bg-homeprimary/70 text-homebackground">Get Started</a>
                    </div>

                </header>

                <section className="ml-auto mr-auto min-h-[100svh] w-fit p-5 flex items-center justify-center flex-col">
                    <div className="text-center">
                        <h2 className="text-4xl">Why Note?</h2>
                        <h2 className="pb-1 mt-3 tracking-wider font-beba text-7xl bg-gradient-to-r from-homeprimary to-homeaccent bg-clip-text text-transparent">Because it just works</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 items-center justify-items-center mt-4">
                        <img width={512} src="/home/easy-boximg-2.webp" className="rounded shadow-lg" />
                        <p className="text-center text-balance max-w-[400px] text-lg font-bold">Note is simple, minimal features for less clutter and optimal usage. Only including features that you need. Note supports many different types of text highlighting, formating, and difernt media types too.</p>
                    </div>
                </section>

                <footer className="w-full p-8 border-t bg-homeprimary/20 flex justify-between">
                    <ul>
                        <li><a href="https://github.com/jfmow/noti">Github</a></li>
                        <li><a href="mailto:hi@suddsy.dev">Email</a></li>
                        <li><a href="/demo">Demo</a></li>
                    </ul>
                    <ul>
                        <li><a href="https://www.realtimecolors.com/?colors=1b0225-f9edfe-b410f5-f96e96-f73e44&fonts=Inter-Inter">Colors</a></li>
                    </ul>
                </footer>
            </div>
        </>
    )
}