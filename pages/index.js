import Link from "@/components/Link";
import { Button } from "@/components/UI";
import pb from "@/lib/pocketbase";
import Head from "next/head";
import Router from "next/router";
import { useEffect } from "react";

export default function HomePageRedo() {
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
            {/**
             * TODO: Update hero image
             * */}

            <HeadHeader />


            <div className="w-full h-[100svh] overflow-y-scroll relative bg-zinc-100 text-zinc-700">
                <Navigation />
                <Header />
                <div className="h-[70vh] flex items-center justify-center flex-col max-w-[1200px] mx-auto p-4">
                    <h2 className="text-4xl mb-2">Note just works.</h2>
                    <p className="mb-2 text-balance text-center">Note is easy to use and it does what you think it does, no tricks.</p>
                    <img src="/home/easy-boximg-2.webp" className="shadow-md rounded-xl" />
                </div>
                <div className="h-[70vh] grid sm:grid-cols-2 items-center justify-items-center max-w-[1200px] mx-auto p-4">
                    <div className="text-left text-balance ">
                        <h2 className="text-4xl mb-2">Take notes anywhere</h2>
                        <p className="mb-2 ">Use Note on your phone, in the car, on the train, heck even in a <span className="bg-gradient-to-r from-red-600 to-orange-300 bg-clip-text text-transparent">plane</span>!</p>
                    </div>
                    <img src="/home/mobilephone.webp" className="shadow-md rounded-xl max-h-[50vh]" />
                </div>
                <div className="h-[70vh] flex items-center justify-center flex-col max-w-[1200px] mx-auto p-4">
                    <div className="shadow-xl flex flex-col items-center justify-center bg-zinc-200 p-4 w-[900px] max-w-[100%] rounded-xl text-zinc-800 h-[250px]">
                        <h2 className="text-4xl pb-2 bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">Signup today!</h2>
                        <p className="mb-2 text-balance text-center">And start using note wherever, whenever.</p>
                        <div className="mt-4">
                            <Button className="min-w-[200px]" filled onClick={() => window.location.replace("/auth/signup")}>
                                Signup
                            </Button>
                        </div>
                    </div>
                </div>
                <footer className="w-full min-h-[200px] items-center flex justify-between p-4 border-t">
                    <ul aria-label="Footer navigation links" className="gap-2 flex-col flex">
                        <li>
                            <Link href={"/"}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href={"/auth/login"}>
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link href={"/auth/signup"}>
                                Signup
                            </Link>
                        </li>
                        <li>
                            <Link href={"/auth/logout"}>
                                Force Logout
                            </Link>
                        </li>
                    </ul>
                    <ul aria-label="Policy's and terms" className="gap-2 flex-col flex">
                        <li>
                            <Link href={"/auth/terms-and-conditions"}>
                                Terms and Conditions
                            </Link>
                        </li>
                        <li>
                            <Link href={"/auth/privacy-policy"}>
                                Privacy policy
                            </Link>
                        </li>
                        <li>
                            <Link href={"https://github.com/jfmow/noti"}>
                                Github
                            </Link>
                        </li>
                    </ul>
                </footer>
            </div>
        </>
    )
}

function HeadHeader() {
    return (
        <Head>
            <title>Note | An open-source note editor</title>
            <link rel='icon' type='image/png' href={`/logo-small.webp`} />
            <link rel="apple-touch-icon" href={`/logo-small.webp`} />
            <link rel="shortcut icon" href={`/logo-small.webp`} />
            <link rel="manifest" href="/manifest.json"></link>
            <meta name="description" content="Note an easy to use note storage and editor solution. Open source and easy to use." />
            <meta name="keywords" content="Note, suddsy, note, editor, note editor, text, text editor, school, highschool"></meta>
            <link rel="canonical" href="https://p.suddsy.dev/"></link>
            <meta name="robots" content="nofollow"></meta>
            <meta property="og:title" content="Note - Your note editor!" />
            <meta property="og:url" content="https://p.suddsy.dev/" />
            <meta property="og:description" content="Note an easy to use note storage and editor solution. Open source and easy to use." />
            <meta property="og:image" content="https://p.suddsy.dev/logo-small.webp" />
        </Head>
    )
}

function Navigation() {
    return (
        <nav className="fixed bg-zinc-100 top-0 w-full h-[70px] shadow p-4 flex items-center justify-between">
            <div className="flex items-center">
                <div className="flex items-center mr-2">
                    <img alt="Logo" src="/logo-small.webp" className="w-10 h-10 mr-2" />
                    <span className="font-bold text-2xl sm:block hidden">Note</span>
                </div>
            </div>
            <div>
                <ul className="flex items-center gap-4" aria-label="Feature only navigation links">
                    <li>
                        <Link href={"#features"}>
                            Features
                        </Link>
                    </li>
                    <li>
                        <Link href={"/demo"}>
                            Demo
                        </Link>
                    </li>
                    <li>
                        <Link href={"https://github.com/jfmow/noti"}>
                            Github
                        </Link>
                    </li>
                </ul>
            </div>
            <div>
                <ul className="flex gap-2" aria-label="Authentication links">
                    <li>
                        <Link href={"/auth/login"}>
                            <Button>
                                Login
                            </Button>
                        </Link>
                    </li>
                    <li className="sm:block hidden">
                        <Link href={"/auth/signup"}>
                            <Button inverted filled>
                                Signup
                            </Button>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

function Header() {
    return (
        <header className="h-screen flex items-center justify-center flex-col max-w-[1200px] mx-auto p-4">
            <hero className="overflow-hidden">
                <img alt="Preview of note, phone and desktop" className="object-contain max-h-[50vh]" src="/home/full-preview.webp" />
            </hero>
            <div>
                <h1 className="text-6xl text-balance text-center p-2 bg-gradient-to-r from-cyan-400 to-violet-700 bg-clip-text text-transparent">Write your notes,<br /> your way!</h1>
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                    <Button onClick={() => window.location.replace("/demo")}>
                        Try A Demo
                    </Button>
                    <Button inverted filled onClick={() => window.location.replace("/auth/signup")}>
                        Signup
                    </Button>
                </div>
            </div>
        </header>
    )
}