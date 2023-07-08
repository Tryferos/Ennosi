import Image from 'next/image'
import { FC, Fragment } from 'react'
import { ProfileSectionWrapper } from './UserProfile'

const Collaborations: FC = (props) => {
    return (
    <ProfileSectionWrapper>
            <div className='p-8'>
                <p className='text-lg font-wotfard-md'>Project Collaborations</p>
            </div>
    </ProfileSectionWrapper>
    )
}

export default Collaborations