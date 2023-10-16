
import { AnimatePresence, motion } from 'framer-motion'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { AddIcon, DemoIcon, EditIcon, FriendsIcon, GithubIcon, PrivateIcon, PublicIcon, DeleteIcon, LikeIcon, CommentIcon, ReportIcon, ViewIcon } from '@components/Icons/Profile'
import { formatNumber, parseDate } from '@lib/dates'
import { MenuDotsIcon, SettingsIcon } from '@components/Icons/Navigation'
import { ProjectLike } from 'pages/api/project/likes/get'
import { Popup, RequestJsonOptions } from 'types/misc'
import { Publicity } from '@prisma/client'
import { ProfileProject } from 'pages/api/project/get'


export const ProjectStats: FC<{ id: string }> = (props) => {
    const [hasLiked, setHasLiked] = useState<boolean>(false)
    const [likes, setLikes] = useState<ProjectLike[]>([])
    useEffect(() => {

        (async () => {
            await fetchLikes();
        })();

    }, [props.id])


    const fetchLikes = async () => {
        const res = await fetch(`/api/project/likes/get?id=${props.id}`)
        if (res.status !== 200) {
            return;
        }
        const data = await res.json();
        setHasLiked(data.hasLiked)
        setLikes(data.likes);
    }

    const handleLike = async () => {

        const res = await fetch('/api/project/likes/edit', {
            ...RequestJsonOptions,
            body: JSON.stringify({ id: props.id })
        })
        const data = await res.json();
        if (!data || !data.success) return;
        await fetchLikes();

    }

    return (
        <div className='flex justify-between'>
            <div className='flex gap-x-1'>
                <div title='Total likes this post has received.' onClick={handleLike} className={`flex group gap-x-2 px-2 py-2 ${hasLiked && 'bg-purple-200'} hover:bg-purple-200 cursor-pointer rounded`}>
                    <div className={`fill-white`}>
                        <LikeIcon />
                    </div>
                    <p className={`group-hover:text-whitee font-wotfard-md`}>{formatNumber(likes.length)}</p>
                </div>
                <aside className='h-full w-[1px] bg-gray-200'></aside>
                <div title='Total comments this post has received.' className={`flex group gap-x-2 px-2 py-2 hover:bg-purple-200 cursor-pointer rounded`}>
                    <div className='fill-white'>
                        <CommentIcon />
                    </div>
                    <p className='group-hover:text-whitee font-wotfard-md'>{formatNumber(0)}</p>
                </div>
            </div>
            <div title='Number of views for this post.' className='flex group gap-x-2 px-2 py-2 cursor-pointer rounded'>
                <div className='fill-white'>
                    <ViewIcon />
                </div>
                <p className='group-hover:text-whitee font-wotfard-md'>{formatNumber(0)}</p>
            </div>
        </div>
    )

}

export const MoreOptions: FC<{ open: boolean; ownProfile: boolean } & { handleEdit: () => void } & { handleDelete: () => void }> = (props) => {
    if (!props.open) return null;
    return (
        <motion.ul
            initial={{ opacity: 0, height: '0px' }}
            transition={{ duration: 0.2 }}
            animate={{ opacity: 1, minHeight: props.ownProfile ? '160px' : '47px' }}
            exit={{ opacity: 0, height: '0px' }}
            className='absolute top-10 right-0 w-[12vw] min-w-[175px] bg-white rounded shadow-allsides-light flex flex-col gap-y-2 outline outline-1 outline-gray-200 z-[100000]'
        >
            {
                props.ownProfile &&
                <Fragment>
                    <motion.li
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.1 }}
                        animate={{ opacity: 1 }}
                        onClick={props.handleEdit} className='flex gap-x-3 py-3 hover:bg-gray-200 pl-2'>
                        <EditIcon />
                        <p>Edit Project</p>
                    </motion.li>
                    <motion.li
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                        animate={{ opacity: 1 }}
                        onClick={props.handleDelete} className='flex gap-x-3 py-3 hover:bg-gray-200 pl-2'>
                        <DeleteIcon />
                        <p>Delete Project</p>
                    </motion.li>
                </Fragment>
            }
            <motion.li
                initial={{ opacity: 0 }}
                transition={{ delay: props.ownProfile ? 0.3 : 0.1 }}
                animate={{ opacity: 1 }}
                className='flex gap-x-3 py-3 hover:bg-gray-200 pl-2 border-t-[1px]'>
                <ReportIcon />
                <p>Report an issue</p>
            </motion.li>
        </motion.ul>
    )
}

export const Privacy: FC<Pick<ProfileProject, 'published'> & { ownProfile: boolean }> = (props) => {
    const { ownProfile } = props;
    const title = props.published == Publicity.Private ? 'Private. Only you can see this post.' :
        props.published == Publicity.Public ? 'Public. Everyone can view this post.' : props.published == Publicity.Friends ? 'Friends. Only people who are connected with you can view this post.' : '';
    return <div title={title} className={`${ownProfile && 'cursor-pointer hover:fill-slate-800 hover:scale-110'} fill-slate-500`}>
        {
            (props.published == Publicity.Private) ? <PrivateIcon />
                : (props.published == Publicity.Public) ? <PublicIcon />
                    : (props.published == Publicity.Friends) ? <FriendsIcon />
                        : null
        }
    </div>
}