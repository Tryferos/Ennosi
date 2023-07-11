import { GetServerSidePropsContext, InferGetServerSidePropsType, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, Fragment } from 'react'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const session = await getSession(context)
    if(!session) return {
        redirect: {
            destination: '/signin',
            permanent: false
        }
    }
    const {user} = session;

    return {
        props: {}
    }
}

const Home: NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <article className='w-full h-full'>
            <h1 className='text-center font-wotfard-md text-xl'>Create a new Project</h1>
        </article>
    )
}

export default Home