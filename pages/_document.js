import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel='manifest' href='https://noti.jamesmowat.com/manifest.json'/>
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
