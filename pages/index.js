import Link from "@/components/Link";
import { ArrowRight } from "lucide-react";
import Head from "next/head";
import PocketBase from 'pocketbase'
import { useEffect } from "react";
const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETURL)
export default function HOME() {
  useEffect(() => {
    if (pb.authStore.isValid) {
      window.location.replace('/page/firstopen')
    }
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
      <div className="w-full text-zinc-800">

        <div className="w-full min-h-screen  relative ">

          <div class="absolute top-0 z-[-2] h-full w-screen rotate-180 transform bg-white bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)]"></div>

          <nav className="p-3 fixed top-0 bg-zinc-50 shadow-lg text-zinc-700 items-center grid sm:grid-cols-3 z-[50] w-full ">
            <div className="w-full h-full hidden items-center sm:flex justify-start ">
              <div className="overflow-hidden w-6 h-6 object-contain">
                <img alt="Brand logo - mountians with lines" src="/logo-small.webp" />
              </div>
              <p className="ml-2 "><span className="font-semibold">Note</span></p>
            </div>
            <div className="w-full h-full flex items-center justify-center gap-3">
              <Link href={"/page/previewwelcome0"}>Demo</Link>
              <Link href="/auth/signup" className={"font-semibold"}>Get started</Link>
              <Link href={"https://github.com/jfmow/noti"}>Self-host</Link>
              <Link href={"/auth/login"}>Login</Link>
            </div>
            <div className="w-full h-full items-center justify-end hidden sm:flex">
              <Link href="/auth/signup" className="flex items-center justify-center text-white py-3 px-4 bg-blue-700 hover:bg-blue-500 rounded-lg transition-all font-semibold min-w-[120px]">
                Get Started
              </Link>
            </div>
          </nav>


          <div className="inline-flex justify-center items-center w-full h-[100dvh]">
            <div className="flex flex-col justify-center items-center w-full max-w-[1200px] px-5">
              <div className="mb-2 flex items-center justify-center w-full">
                <div className="border inline-flex h-full cursor-pointer justify-center items-center rounded-full bg-white px-3 py-1 text-xs font-medium leading-5 text-zinc-600 backdrop-blur-xl">
                  Explore the demo 🤯 <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
              <h1 className="text-center text-3xl font-medium text-gray-900 sm:text-6xl">Accelerate your thoughts, <br />become <span className="bg-gradient-to-r from-zinc-900 via-zinc-600 to-zinc-400 bg-clip-text text-transparent">more creative</span></h1>
              <div className="py-6 mt-4 flex items-center justify-center gap-6 flex-row mb-12 w-full">
                <Link href="/auth/signup" className="px-4 py-2 text-md bg-purple-600 text-zinc-100 rounded-md font-medium hover:bg-purple-700">
                  Get started
                </Link>
                <Link href="/page/previewwelcome0" className="px-4 py-2 text-md bg-zinc-100 text-zinc-800 rounded-md font-medium hover:bg-zinc-200">
                  View demo
                </Link>
              </div>

              <img alt="mobile page preview" width={200} height={423} className="md:hidden object-contain" src="/mobile-preview.webp" />
              <img alt="desktop and mobile together - page preview" loading="eager" width={2189} height={1190} className="hidden md:block" src="/desktop-preview.webp" />
            </div>
          </div>
        </div>
        <div className="w-full min-h-screen p-5 pb-10 justify-center flex-col flex items-center relative bg-slate-950">

          <div class="absolute top-0 z-[1] h-full w-full bg-white"><div class="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div></div>

          <div className="relative z-3 flex flex-col justify-center w-full max-w-[1200px] z-[2]">
            <h1 className="mb-8 pb-1 mt-8 text-xl md:text-6xl mb-6 text-center font-extrabold bg-gradient-to-r from-fuchsia-400 to-fuchsia-700 bg-clip-text text-transparent">Simplicity</h1>
            <p className="text-lg text-center sm:text-xl text-zinc-600  mb-12">
              Note is an editor which only has what you need. Nothing fancy, just the basics
            </p>

            <img alt="mobile feature preview - list of buttons" loading="lazy" className="md:hidden max-h-[50dvh] object-contain" src="/mobile-page-alone.webp" />
            <img alt="Desktop page preview" loading="lazy" className="hidden md:block rounded-xl" src="/page-alone.webp" />
          </div>

        </div>
        <div className="w-full min-h-screen justify-center flex-col flex items-center relative bg-zinc-50">
          <div className="flex flex-col justify-center w-full max-w-[1200px] px-5">
            <h1 className="mb-8 mt-8 text-6xl text-center">Get started Now!</h1>
            <div className="py-6 mt-4 flex items-center justify-center gap-6 flex-row mb-12">
              <Link href="/auth/signup" className="md:p-8 p-5 text-md md:text-4xl bg-purple-600 text-zinc-100 rounded-xl font-semibold hover:bg-purple-700">
                Get started
              </Link>
            </div>
          </div>
          <footer className="absolute bottom-0 w-full">
            <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">

              <div
                className="mt-16 border-t border-gray-100 pt-8 sm:flex sm:items-center sm:justify-between lg:mt-24"
              >
                <ul className="flex flex-wrap justify-center gap-4 text-xs lg:justify-end">
                  <li>
                    <a href="/auth/terms-and-conditions" className="text-gray-500 transition hover:opacity-75"> Terms & Conditions </a>
                  </li>

                  <li>
                    <a href="/auth/privacy-policy" className="text-gray-500 transition hover:opacity-75"> Privacy Policy </a>
                  </li>
                </ul>

                <ul className="mt-8 flex justify-center gap-6 sm:mt-0 lg:justify-end">

                  <li>
                    <a
                      href="https://github.com/jfmow"
                      rel="noreferrer"
                      target="_blank"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      <span className="sr-only">GitHub</span>

                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://jamesmowat.com/"
                      rel="noreferrer"
                      target="_blank"
                      className="text-gray-700 transition hover:opacity-75"
                    >
                      <span className="sr-only">James mowat</span>
                      <img alt="james mowat logo" className="h-6 w-6 rounded-xl" src="/jmlogo.svg" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </div>

    </>
  )
}