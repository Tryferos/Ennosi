import '../public/styles/globals.css'
import type { AppProps } from 'next/app'
import {Provider} from 'react-redux'
import { SessionProvider } from 'next-auth/react'
import { store } from 'store/store'
import { Session } from 'next-auth'
import { FC, ReactNode } from 'react'
import Navbar from '@components/navigation/Navbar'
import PopupElement from '@components/Popups/PopupElement'

export default function App({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={pageProps.session as Session} refetchInterval={5*60}>
      <Provider store={store}>
        <Wrapper>
          <Component {...pageProps} />
          <PopupElement/>
        </Wrapper>
      </Provider>
    </SessionProvider>
  )
}

const Wrapper: FC<{children: ReactNode}> = (props) => {
  return (
    <main className='w-full h-full bg-gray-100'>
      <Navbar/>
      <article className='mt-[75px] min-h-[60vh] w-full big:p-8 small:p-4'>
        {props.children}
      </article>
    </main>
  )
}
