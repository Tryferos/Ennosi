import { Connection, Profile, User } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import Bio from './Bio'
import { UsernameSkeleton } from '@components/Skeletons/Profile'
import { InferGetServerSidePropsType} from 'next'
import { getServerSideProps } from 'pages/account/[userId]'
import { FriendsIcon } from '@components/Icons/Profile'
import { RequestJsonOptions, UserProfile } from 'types/misc'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { fetchNotifications } from 'store/NotificationsSlice'

const UserProfile: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    const [user, setUser] = useState<UserProfile>()
    const router = useRouter()
    useEffect(() => {
        if(user) return;
        fetchUser();
    }, [props])
    const fetchUser = () => {
        (async () => {
            const res = await fetch(`/api/user/${props.userId}`)
            if(res.status !== 200 ){
                
                router.push('/404')
                return;
            }
            const userRes = await res.json() as UserProfile
            setUser(userRes);
        })();
    }
    return (
        <ProfileSectionWrapper>
            <aside className='h-[150px] w-full bg-gradient-to-r rounded-t-xl from-orange-200 to-fuchsia-300 via-yellow-100 bg-opacity-20'></aside>
            <figure className='w-[150px] absolute h-[150px] rounded-full bg-gray-200 border-4 border-white top-[65px] left-5'>
                <Image src='/images/person.jpg' fill={true} style={{objectFit: 'cover'}} alt='Profile Picture' className='rounded-full'/>
            </figure>
            {user && <ProfileFriendSection fetchUser={fetchUser} ownProfile={props.ownProfile} userId={props.userId} connection={user.connection}/>}
            <div className='p-5 px-6 font-wotfard flex flex-col gap-y-2 mt-[50px]'>
                {
                    user ?
                    <p className='font-wotfard-sb text-xl'>{user.firstName} {user.lastName}</p>
                    :
                    <UsernameSkeleton/>
                }
                {user && <Bio {...{...user, id: user.id as string, ownProfile: props.ownProfile}}/>}
            </div>
        </ProfileSectionWrapper>
    )
}

const ProfileFriendSection: FC<Pick<UserProfile, 'userId' | 'connection' | 'ownProfile'> & {fetchUser: () => void}> = (props) => {
    const notifications = useAppSelector(state => state.notifications)
    const dispatch = useAppDispatch()
    useEffect(() => {

        dispatch(fetchNotifications());

    }, [props])
    const handleFriendAdd = () => {
        (async () => {
            const res = await fetch('/api/profile/friend-request', {
                ...RequestJsonOptions,
                body: JSON.stringify({userId: props.userId})
            })
            const data = await res.json();
            if(data.success===true){
                props.fetchUser();
            }
        })();
    }
    const removeFriend = () => {
        (async () => {
            const res = await fetch('/api/profile/friend/remove', {
                ...RequestJsonOptions,
                body: JSON.stringify({userId: props.userId})
            })
            props.fetchUser();
            if(res.status !== 200) return;
            const data = await res.json();
        })();
    }
    const acceptFriend = () => {
        (async () => {
            const res = await fetch('/api/profile/friend/accept', {
                ...RequestJsonOptions,
                body: JSON.stringify({userId: props.userId})
            })
            const data = await res.json();
            if(data.success===true){
                props.fetchUser();
            }
        })();
    }
    if(props.ownProfile){
        return null;
    }
    if(notifications.friendRequests.some(item => item.userId===props.userId)){
        return <input onClick={acceptFriend} type='button' value='Accept Friend Request' className='absolute bg-green-500 cursor-pointer hover:bg-green-600 text-white font-wotfard-md rounded px-2 py-1 right-10 top-[170px]'/>
    }
    if(!props.connection){
        return <input onClick={handleFriendAdd} type='button' value='Add Friend' className='absolute bg-secondary cursor-pointer hover:bg-sky-700 text-white font-wotfard-md rounded px-2 py-1 right-10 top-[170px]'/>
    }
    if( props.connection && props.connection.accepted===false){
        return <div className='absolute bg-secondary hover:bg-red-500 cursor-pointer text-white font-wotfard-md rounded px-2 py-1 right-10 top-[170px] group'>
            <p className='group-hover:hidden contents'>Request Pending</p>
            <p onClick={removeFriend} className='group-hover:flex hidden'>Cancel Request</p>
        </div>
    }
    return <div className='absolute hover:bg-red-500 cursor-pointer text-white font-wotfard-md rounded px-2 py-1 right-10 top-[170px] group bg-green-500'>
    <p className='group-hover:hidden contents'>Friends</p>
    <p onClick={removeFriend} className='group-hover:flex hidden'>Remove Friend</p>
</div>
}

export const ProfileSectionWrapper: FC<{children: ReactNode}> = (props) => {
    const {children} = props;
    return (
        <section className='min-h-[20vh] rounded-xl w-full shadow-allsides-light bg-white flex flex-col relative gap-y-5'>
            {children}
        </section>
    )
};

export default UserProfile