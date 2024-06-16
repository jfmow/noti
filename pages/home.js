import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
                </style>
            </Head>
            <div className="w-full h-[100svh] overflow-y-scroll relative bg-homebackground text-hometext">
                <nav className="w-full p-4 flex items-center justify-between border-b sticky top-0">
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
                        <p className="mt-2 text-xl opacity-70">Let Note handle the rembering for you,<br /> so you can focus on performing your best</p>
                    </div>

                    <div className="max-w-[1000px] mt-4 p-3">
                        <img alt="Desktop and mobile preview of note" src="/home/full-preview.webp" />
                    </div>

                    <div className="flex gap-4 items-center justify-center">
                        <a href="/demo" className="cursor-pointer hover:bg-homesecondary/70 px-6 py-3 rounded-lg bg-homesecondary/30">View the Demo</a>
                        <a href="/auth/signup" className="cursor-pointer hover:bg-homeprimary px-6 py-3 rounded-lg bg-homeprimary/70 text-homebackground">Get Started</a>
                    </div>

                </header>


            </div>
        </>
    )
}