import { Link } from "@/components/UX-Components"
import Head from "next/head"

export default function Home() {
  return (
    <>
      <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Note</title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <nav className="px-5 py-3 sm:py-0 text-black items-center grid sm:grid-cols-3 sticky top-0 left-0 right-0 h-[60px] z-50 w-full border-b bg-zinc-50">
        <div className="w-full h-full hidden items-center sm:flex justify-start ">
          <div className="overflow-hidden w-6 h-6 object-contain">
            <img src="/logo.png" />
          </div>
          <p className="ml-2 "><span className="font-semibold">Note</span></p>
        </div>
        <div className="w-full h-full flex items-center justify-center gap-3">
          <Link href={"/page/rzz50e2mnhgwof2"}>Demo</Link>
          <Link className={"font-semibold"}>Get started</Link>
          <Link href={"https://github.com/jfmow/noti"}>Self-host</Link>
          <Link href={"/auth/login"}>Login</Link>
        </div>
        <div className="w-full h-full items-center justify-end hidden sm:flex">
          <Link href={"/auth/signup"} className="flex items-center justify-center py-3 px-4 bg-zinc-200 hover:bg-zinc-300 rounded-lg transition-all font-semibold min-w-[120px]">
            Get Started
          </Link>
        </div>
      </nav>
      <Hero />
      <section className="bg-zinc-50 text-zinc-800">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
              <img
                alt="Party"
                src="/page-alone.png"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>

            <div className="lg:py-24">
              <h2 className="text-3xl font-bold sm:text-4xl">Supercharge Your Productivity</h2>

              <p className="mt-4 text-gray-600">
                Elevate your mindset and boost your productivity. Unleash the power of organized thinking and cultivate a growth-oriented mindset as you embark on a journey of self-improvement.

                Whether you're a student, professional, or lifelong learner, our app provides a seamless platform for capturing your thoughts, ideas, and inspirations. Say goodbye to scattered notes and welcome a focused, growth-driven approach to note-taking.
              </p>


              <a
                href="/auth/signup"
                className="mt-8 inline-block rounded bg-[#d935a5] px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-yellow-400"
              >
                Get Started Today
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="bg-zinc-50 flex flex-col items-center w-full h-full border-t border-b p-5">
        <div className="space-y-4 text-zinc-800 max-w-[800px] w-[90%]">
          <details className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden" open>
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h2 className="font-medium">How much does it cost?</h2>

              <span className="relative h-5 w-5 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 h-5 w-5 opacity-100 group-open:opacity-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 h-5 w-5 opacity-0 group-open:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </summary>

            <p className="mt-4 leading-relaxed text-gray-700">
              Note is completetly free. It's an open source app which currently is just self hosted by you which means you have your data and its free for you to use.
            </p>
          </details>

          <details className="group rounded-lg bg-gray-50 p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900">
              <h2 className="font-medium">Can I get a hosted version?</h2>

              <span className="relative h-5 w-5 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 opacity-100 group-open:opacity-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 opacity-0 group-open:opacity-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
            </summary>

            <p className="mt-4 leading-relaxed text-gray-700">
              Currently no. As there is no demand for it so to reduce the overall costs a hosted version is not
              available currently.
            </p>
          </details>
        </div>
      </div>
      <footer className="bg-zinc-50">
        <div className="mx-auto max-w-screen-xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-5xl">Unleash your mind!</h2>

            <p className="mx-auto mt-4 max-w-sm text-gray-500">
              Get started writing simple, meaningfull notes today. Don't wait until you've forgotten, remember now
            </p>

            <a
              href="/auth/signup"
              className="mt-8 inline-block rounded-full border border-indigo-600 px-12 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
            >
              Get Started
            </a>
          </div>

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

              {/**
                             * <li>
                                <a
                                    href="/"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="text-gray-700 transition hover:opacity-75"
                                >
                                    <span className="sr-only">Instagram</span>

                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/"
                                    rel="noreferrer"
                                    target="_blank"
                                    className="text-gray-700 transition hover:opacity-75"
                                >
                                    <span className="sr-only">Twitter</span>

                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path
                                            d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                                        />
                                    </svg>
                                </a>
                            </li>
                             */}

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
                  <img className="h-6 w-6 rounded-xl" src="/jmlogo.svg" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}


function Hero() {
  return (
    <div className="w-full min-h-screen bg-zinc-50 flex flex-col items-center p-5">
      <div className="max-w-[1000px] text-zinc-800 flex flex-col items-center justify-center">
        <h1 className="text-center text-5xl font-bold leading-tight tracking-tighter md:text-8xl lg:leading-[1.1]"><span className="from-pink-600 via-orange-600 to-red-600 bg-gradient-to-r bg-clip-text text-transparent">Unleash</span> Your Creativity with <span className="from-pink-600 via-purple-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">Beautiful</span> Notes</h1>
        <h2 className="w-[90%] md:max-w-[700px] mt-3 font-[500] text-center text-sm text-zinc-600 sm:text-xl">Step into a world where your thoughts become vibrant expressions. Craft notes that reflect your unique creativity and personality. Immerse yourself in a personalized experience that turns every detail into a visual masterpiece.</h2>
        <div className="flex items-center justify-center gap-5 p-4">
          <Link href="/page/rzz50e2mnhgwof2" className="text-zinc-50 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 shadow hover:bg-zinc-800/90 h-9 px-4 py-2">
            Demo
          </Link>
          <Link href="/page/signup" className="text-zinc-50 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 text-zinc-50 shadow hover:bg-zinc-800/90 h-9 px-4 py-2">
            Get started
          </Link>
        </div>
        <div className="w-full h-fit max-w-[900px] object-contain overflow-hidden bg-zinc-100 p-5 rounded-xl shadow-lg">
          <img className="w-full h-full" src="/page.png" />
        </div>
      </div>
    </div>
  )
}
