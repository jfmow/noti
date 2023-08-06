import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='manifest' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/manifest.json`}/>
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
