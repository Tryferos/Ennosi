import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, Fragment, ReactNode } from 'react'
import SearchBar from './SearchBar'
import { UsernameIcon } from '@components/Icons/SignIn'
import Notifications from './Notifications'

export const UserImage: FC = () => {
    return (
        <Fragment>
            <UserImageLink/>
            <div className='w-full h-[1px] bg-gray-300 my-2'></div>
            <UserSettings/>
            <SessionChange/>
        </Fragment>
    )
}
const SessionChange: FC = () => {
    const {data: session} = useSession()
    if(session){
        return <SignOut/>
    }
    return <SignIn/>
}
const SignIn: FC = () => {
    const handleClick = () => signIn()
    return (
        <ItemWrapper onClick={handleClick}>
            <figure></figure>
            <p>Sign In</p>
        </ItemWrapper>
    )
}

const SignOut: FC = () => {
    const handleClick = () => signOut()
    return (
        <ItemWrapper onClick={handleClick}>
            <figure></figure>
            <p>Sign Out</p>
        </ItemWrapper>
    )
}
const ItemWrapper: FC<{children: ReactNode; onClick?: () => void}> = (props) => {
    const {children, onClick} = props
    return (
        <li onClick={onClick} className='flex justify-start text-base items-center gap-x-2 hover:bg-gray-100 py-4 px-2 rounded-md cursor-pointer'>
            {children}
        </li>
    )
}
const UserSettings: FC = () => {
    const {data: session} = useSession()
    if(!session){
        return null;
    }
    return (
        <ItemWrapper>
            <figure></figure>
            <p>Account Settings</p>
        </ItemWrapper>
    )
}
const UserImageLink: FC = () => {
    const {data: session} = useSession()
    const username = session ? session.user.username : 'Visitor'
    return (
        <li className='flex justify-start items-center gap-x-2 hover:bg-gray-100 py-4 px-2 rounded-md cursor-pointer'>
            <figure className='relative scale-110'><UserImageIcon/></figure>
            <p>{username}</p>
        </li>
    )
}
export const UserImageIcon: FC = () => {
    const {data: session} = useSession()
    if(session?.user.image){
        return (
                <Image src={session?.user?.image!} alt='profile picture' layout='fill' className='rounded-full'/>
        )
    }
    return <UsernameIcon/>
}
