import Link from "@/components/Link";
import Head from "next/head";

export default function Home() {
  return (
    <>

      <Head>
        <title>Note - By James Mowat</title>
      </Head>

      <div className="w-full relative bg-slate-50 h-screen overflow-hidden">

        <nav className="px-5 py-3 sm:py-0 text-black items-center grid sm:grid-cols-3 sticky top-0 left-0 right-0 h-[60px] z-50 w-full border-b bg-slate-50">
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
            <Link href={"/auth/signup"} className="py-3 px-4 bg-slate-200 hover:bg-slate-300 rounded-lg transition-all font-semibold min-w-[120px]">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="h-screen oveflow-hidden w-full relative bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 flex justify-center background-animate">
          <div className="max-w-[1401px] overflow-hidden">
            <div className=" text-slate-800 mx-auto flex max-w-[980px] px-5 flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
              <Link href={"/page/rzz50e2mnhgwof2"} className={"py-1 text-sm font-medium px-4 rounded-[99999px] bg-slate-200"}>🎉 | Welcome to note! Note's for you</Link>
              <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]"><span className="from-pink-600 via-orange-600 to-red-600 bg-gradient-to-r bg-clip-text text-transparent">Unleash</span> Your Creativity with <span className="from-pink-600 via-purple-600 to-blue-600 bg-gradient-to-r bg-clip-text text-transparent">Beautiful</span> Notes</h1>
              <h2 className="max-w-[750px] text-center text-sm text-muted-foreground sm:text-xl">Step into a world where your thoughts become vibrant expressions. Craft notes that reflect your unique creativity and personality. Immerse yourself in a personalized experience that turns every detail into a visual masterpiece.</h2>
              <div className="flex items-center jsutify-center gap-5 flex-wrap mt-3">
                <Link href={"/auth/signup"} className={"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-slate-300 hover:bg-black/90 h-10 px-4 py-2"}>Get Started</Link>
                <Link href={"/page/rzz50e2mnhgwof2"} className={"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-none border shadow-md text-slate-300 hover:bg-black/10 h-10 px-4 py-2"}>Explore the demo</Link>
              </div>
            </div>
            <div className="w-full h-full flex justify-center overflow-hidden">
              <div className="w-[1400px] min-w-[1000px]">
                <img src="/page.png" className="rounded-xl" />
              </div>
            </div>
          </div>
        </div>

      </div>

    </>
  )
}