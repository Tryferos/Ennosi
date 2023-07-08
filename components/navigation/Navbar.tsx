import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import SearchBar from './SearchBar'
import { UsernameIcon } from '@components/Icons/SignIn'
import Notifications from './Notifications'
import { UserImage, UserImageIcon } from './UserImage'
import { NotifactionIcon } from '@components/Icons/Navigation'
import { motion } from 'framer-motion'

const Navbar: FC = (props) => {
    const {data: session} = useSession()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserImage, setShowUserImage] = useState(false)
    const clickHandlerRef = useRef<((ev: MouseEvent) => void) | null>(null)
    const handleToggle = (index: number) => {
        if(index==0){
            setShowUserImage(!showUserImage)
            setShowNotifications(false)
            return;
        }
        if(index==1){
            setShowUserImage(false)
            setShowNotifications(!showNotifications)
            return;
        }

    }
    useEffect(() => {

        const clickHandler = (ev: MouseEvent) => {
            setShowUserImage(false)
            setShowNotifications(false)
        }
        clickHandlerRef.current = clickHandler

        window.addEventListener('click', clickHandlerRef.current);

        return () => {
            window.removeEventListener('click', clickHandlerRef.current!);
        }

    }, [])
    return (
    <nav className='fixed z-[100000] flex justify-between top-0 left-0 w-[100%] px-10 small:px-4 h-[75px] bg-white shadow-below border-b-[1px] border-b-gray-300 items-center'>
        <figure></figure>
        <SearchBar/>
        <ul className='flex justify-between items-center gap-x-4 flex-row-reverse'>
            {
                [[<UserImageIcon/>, <UserImage/>], [<NotifactionIcon/>,<Notifications/>]].map(([icon, component], i) => {
                        const show = i==0 ? showUserImage : showNotifications
                        return (
                            <li key={i} onClick={(ev) => {handleToggle(i); ev.stopPropagation()}}
                            className='w-[40px] text-primary text-lg font-wotfard-md h-[40px] group hover:bg-gray-300 cursor-pointer fill-primary flex justify-center items-center rounded-full bg-gray-200 relative'>
                                {icon}
                                <motion.ul onClick={(e) => e.stopPropagation()}
                                className={`absolute cursor-default top-11 right-0 w-[calc(225px+100%)] p-2 px-3 flex-col
                                rounded-md outline outline-1 outline-gray-300 min-h-[175px] bg-white shadow-allsides ${show ? 'flex' : 'hidden'}`}>
                                    {component}
                                </motion.ul>
                            </li>
                        )
                }
                    )
            }
        </ul>
    </nav>
    )
}

export default Navbar

