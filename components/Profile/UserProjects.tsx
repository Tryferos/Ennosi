import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { getServerSideProps } from 'pages/account/[userId]'
import { FC, Fragment } from 'react'
import { ProfileSectionWrapper } from './UserProfile'

const UserProjects: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    const {userId, ownProfile} = props;
    return (
        <ProfileSectionWrapper>
            <div className='p-8'>
                <p className='text-lg font-wotfard-md'>Projects</p>
            </div>
        </ProfileSectionWrapper>
    )
}

export default UserProjects