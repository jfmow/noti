import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='manifest' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/manifest.json`} />
        <link rel='icon' type='image/png' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/logo.webp`} />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
