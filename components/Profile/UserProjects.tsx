import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { getServerSideProps } from 'pages/account/[userId]'
import { FC, Fragment } from 'react'
import { ProfileSectionWrapper } from './UserProfile'
import { AddIcon } from '@components/Icons/Profile'
import { useAppDispatch } from 'store/hooks'
import { changePopup } from 'store/PopupSlice'
import { Popup } from 'types/misc'

const UserProjects: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    const {userId, ownProfile} = props;
    const dispatch = useAppDispatch();
    const handleAddProject = () => dispatch(changePopup({popup: Popup.Project, data: null}))
    return (
        <ProfileSectionWrapper>
            <div className='p-8 relative'>
                <p className='text-lg font-wotfard-md'>Projects</p>
                <div onClick={handleAddProject} title='Add a new Project' className='absolute right-8 top-8 hover:bg-gray-100 p-1 rounded-full scale-125 cursor-pointer'><AddIcon/></div>
            </div>
        </ProfileSectionWrapper>
    )
}

export default UserProjects