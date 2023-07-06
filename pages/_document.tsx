import Navbar from '@components/navigation/Navbar'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className='w-[100%] font-wotfard'>
          <Main />
          <NextScript />
      </body>
    </Html>
  )
}
