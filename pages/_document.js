import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='manifest' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/manifest.json`} />
        <link rel='icon' type='image/png' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/logo.png`} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
