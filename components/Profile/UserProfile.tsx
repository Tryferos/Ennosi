import { Profile, User } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { FC, Fragment, ReactNode, useEffect, useState } from 'react'
import Bio from './Bio'
import { UsernameSkeleton } from '@components/Skeletons/Profile'
type UserProfileProps = {
    userId: string,
    ownProfile: boolean
}
const UserProfile: FC<UserProfileProps> = (props) => {
    const [user, setUser] = useState<User & Profile>()
    const router = useRouter()
    useEffect(() => {
        if(user) return;
        (async () => {
            if(user) return;
            const res = await fetch(`/api/user/${props.userId}`)
            if(res.status !== 200 ){
                router.push('/404')
            }
            const userRes = await res.json() as User & Profile
            setUser(userRes);
        })();
    }, [props])
    return (
        <ProfileSectionWrapper>
            <aside className='h-[150px] w-full bg-gradient-to-r rounded-t-xl from-orange-200 to-fuchsia-300 via-yellow-100 bg-opacity-20'></aside>
            <figure className='w-[150px] absolute h-[150px] rounded-full bg-gray-200 border-4 border-white top-[75px] left-5'>
                <Image src='/images/person.jpg' fill={true} style={{objectFit: 'cover'}} alt='Profile Picture' className='rounded-full'/>
            </figure>
            <div className='p-5 px-6 font-wotfard flex flex-col gap-y-4 mt-[75px]'>
                {
                    user ?
                    <p className='font-wotfard-sb text-xl'>{user.firstName} {user.lastName}</p>
                    :
                    <UsernameSkeleton/>
                }
                {user && <Bio {...{...user, id: user.id as string}}/>}
            </div>
        </ProfileSectionWrapper>
    )
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