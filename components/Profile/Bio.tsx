import { SignInIcon } from '@components/Icons/Navigation'
import { EditIcon } from '@components/Icons/Profile'
import { Profile, User } from '@prisma/client'
import Image from 'next/image'
import { FC, Fragment } from 'react'

const Bio: FC<Profile & User> = (props) => {
    if(!props.bio){
        return <div className='text-gray-500 w-full flex justify-between items-center'>
            <p>You have not added your bio yet.</p>
            <div className='p-2 hover:bg-gray-100 cursor-pointer rounded-full'><EditIcon/></div>
            </div>
    }
    return (
        <></>
    )
}

export default Bio