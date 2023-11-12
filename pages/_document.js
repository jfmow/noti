import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='manifest' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/manifest.json`} />
        <link rel='icon' type='image/png' href={`${process.env.NEXT_PUBLIC_CURRENTURL}/favicon2.png`} />
        {process.env.NEXT_PUBLIC_CURRENTURL === 'https://note.suddsy.dev' && (
          <script async src="https://analytics.eu.umami.is/script.js" data-website-id="d1ea6e9a-aad1-4a03-8b11-b0d30ae20441"></script>
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
