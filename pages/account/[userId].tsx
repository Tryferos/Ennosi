import UserProfile from '@components/Profile/UserProfile'
import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, Fragment } from 'react'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { userId } = context.query
    const session = await getSession(context)
    return {
        props: {
            userId: userId as string,
            ownProfile: session?.user?.id === userId
        }
    }
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    const {userId, ownProfile} = props;
    return (
        <article className='flex w-[100%] min-h-[100vh] gap-x-10 p-5 text-primary'>
            <section className='w-[55%] flex flex-col gap-y-5'>
                <UserProfile {...props}/>

            </section>
            <section className='w-[30%] '>

            </section>
        </article>
    )
}

export default Home