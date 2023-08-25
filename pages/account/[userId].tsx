import Collaborations from '@components/Profile/Collaborations'
import UserProfile from '@components/Profile/UserProfile'
import UserProjects from '@components/Profile/UserProjects'
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next'
import { getCsrfToken, getSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, Fragment, useEffect } from 'react'
import { useAppDispatch } from 'store/hooks'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { userId } = context.query
    const session = await getSession(context)
    const csrfToken = await getCsrfToken(context)
    return {
        props: {
            userId: userId as string,
            ownProfile: session?.user?.id === userId,
            csrfToken
        }
    }
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    const { userId, ownProfile } = props;

    return (
        <article className='flex w-[100%] min-h-[100vh] gap-x-5 p-5 text-primary'>
            <section className='w-[55%] flex flex-col gap-y-5 basis-[150%]'>
                <UserProfile {...props} />
                <UserProjects {...props} />
            </section>
            <section className='w-[40%] basis-[75%]'>
                <Collaborations />
            </section>
        </article>
    )
}

export default Home