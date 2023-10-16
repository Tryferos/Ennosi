import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { getServerSideProps } from 'pages/account/[userId]'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { ProfileSectionWrapper } from './UserProfile'
import { AddIcon, DemoIcon, EditIcon, FriendsIcon, GithubIcon, PrivateIcon, PublicIcon, DeleteIcon, LikeIcon, CommentIcon, ReportIcon, ViewIcon } from '@components/Icons/Profile'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { changePopup } from 'store/PopupSlice'
import { Popup, RequestJsonOptions } from 'types/misc'
import { ProfileProject } from 'pages/api/project/get'
import Link from 'next/link'
import { Publicity } from '@prisma/client'
import { formatNumber, parseDate } from '@lib/dates'
import { MenuDotsIcon, SettingsIcon } from '@components/Icons/Navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { ProjectLike } from 'pages/api/project/likes/get'
import {MoreOptions, Privacy, ProjectStats} from '@components/Profile/Project/Info'

const UserProjects: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
    const { userId, ownProfile } = props;
    const dispatch = useAppDispatch();
    const [projects, setProjects] = useState<ProfileProject[]>([])
    const ref = useRef<HTMLUListElement>(null);
    const listenerRef = useRef<(ev: Event) => void>();
    const infoRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState<number>(0)
    const [cursorId, setCursorId] = useState<string | null>(null)
    const handleAddProject = () => dispatch(changePopup({ popup: Popup.Project, data: null }))
    useEffect(() => {
        if (!ref || !ref.current) return;
        listenerRef.current = (ev: Event) => {
            const target = ev.target as HTMLElement;
            if (!target.dataset.index) return;
            var rect = target.getBoundingClientRect();
            var bodyRect = document.body.getBoundingClientRect()
            const offset = rect.top - bodyRect.top - rect.height / 2 + 50;
            setCursorId(target.dataset.index)
            setOffset(offset);
        }
        const l = ref.current.addEventListener('mousemove', listenerRef.current)

        return () => removeEventListener('mousemove', () => listenerRef.current);


    }, [ref])
    useEffect(() => {

        if (!infoRef || !infoRef.current) return;

        infoRef.current.style.transform = `translateY(${offset}px)`

    }, [infoRef, offset])
    useEffect(() => {

        (async () => {
            const res = await fetch(`/api/project/get?userId=${userId}`)
            if (res.status !== 200) {
                return;
            }
            const projects = await res.json() as { projects: ProfileProject[] }
            setProjects(projects.projects);
        })();

    }, [props])
    return (
        <section className='min-h-[20vh] rounded-xl w-full flex flex-col relative gap-y-5'>
            <div className='p-0 relative bg-transparent flex flex-col gap-y-2'>
                <p className='text-lg font-wotfard-md p-8 bg-white rounded-md'>Projects</p>
                <div onClick={handleAddProject} title='Add a new Project' className='absolute right-8 top-8 hover:bg-gray-100 p-1 rounded-full scale-125 cursor-pointer'><AddIcon /></div>
                {
                    <ul ref={ref} className='flex flex-col gap-y-2  bg-transparent'>
                        {
                            projects.map(project => <Project key={project.id} {...project} ownProfile={ownProfile} />)
                        }
                    </ul>
                }
                <div ref={infoRef} className={`${offset < 50 && 'hidden'} absolute top-0 duration-400 transition-transform -right-20 h-[200px] items-center flex w-10`}>
                    {cursorId && <LinksInfo project={{ ...projects.find(item => item.id == cursorId) }} ownProfile={props.ownProfile} />}
                </div>
            </div>
        </section>
    )
}

export default UserProjects

const LinksInfo: FC<{ project: Partial<Pick<ProfileProject, 'demoUrl' | 'githubUrl' | 'partners'>> } & { ownProfile: boolean }> = (props) => {
    const dispatch = useAppDispatch();
    const handleEdit = () => {
        dispatch(changePopup({ popup: Popup.Project, data: props.project }))
    }
    if (!props) return null;
    const project = props.project;
    return (
        <ul className='flex flex-col gap-y-6 justify-center items-center'>
            <div className={`${project.partners && project.partners.length > 0 ? 'h-10' : 'h-0'}`}></div>
            {
                props.ownProfile &&
                <div onClick={handleEdit} className='absolute top-0 h-6 w-6 flex items-center justify-center hover:scale-110 hover:brightness-200 rounded-full cursor-pointer'><EditIcon /></div>
            }
            <div className='absolute top-10'>
                <p className='text-sm font-wotfard-md underline'>Links</p>
            </div>
            {project.githubUrl && <Link href={project.githubUrl} target='_blank' title='Github' className='hover:fill-purple-700 scale-150 cursor-pointer'><GithubIcon /></Link>}
            {project.demoUrl && <Link href={project.demoUrl} target='_blank' title='Live Demo' className='hover:fill-purple-700 scale-150 cursor-pointer'><DemoIcon /></Link>}
            {project.partners && project.partners.map((_p, _i) => {
                const { image, firstName, lastName, id } = _p.user;
                return (
                    <Link key={_i} title={`${firstName} ${lastName}`} target='_blank' href={`/account/${id}`}>
                        <figure title={`${firstName} ${lastName}`} className='w-8 h-8 relative rounded-full bg-gray-200 border-2 border-white scale-150 hover:scale-[1.6]'>
                            <Image src={image ?? '/images/person.jpg'} alt={`${firstName} ${lastName} Partner Image`} fill={true} style={{ objectFit: 'cover' }} className='rounded-full' />
                        </figure>
                    </Link>
                )
            })}
        </ul>
    )
}



const Project: FC<ProfileProject & { ownProfile: boolean }> = (props) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => setOpen(!open);
    const dispatch = useAppDispatch();
    const handleEdit = () => {
        dispatch(changePopup({ popup: Popup.Project, data: props }))
    }
    const handleDelete = () => {
        const promise = new Promise(async (resolve, reject) => {
            const res = await fetch('/api/project/delete', {
                ...RequestJsonOptions,
                body: JSON.stringify({ id: props.id })
            })
            const data = await res.json();
            if (!data.success) {
                return reject();
            }
            resolve(null);
            setTimeout(() => {
                window.location.reload();
            }, 1000)
            return;
        });

        toast.promise(promise, {
            pending: 'Deleting...',
            success: 'Project Deleted!',
            error: 'Error Deleting Project'
        })
    }
    return (
        <Fragment>
            <li data-index={props.id} className='flex flex-col relative p-8 gap-y-2 rounded bg-white'>
                <div className='flex justify-between p-0 relative'>
                    <div className='flex gap-x-2 items-center'>
                        <figure className='w-[64px] h-[64px] relative rounded-full bg-gray-200 border-4 border-white'>
                            <Image src={props.author.image ?? '/images/person.jpg'} fill={true} style={{ objectFit: 'cover' }} alt='Profile Picture' className='rounded-full' />
                        </figure>
                        <div className='flex flex-col'>
                            <p className='font-wotfard-sb text-base'>{props.author.firstName} {props.author.lastName}</p>
                            <div className='flex gap-x-2 items-center'>
                                <p className='text-sm text-gray-500'>{parseDate(props.createdAt)}</p>
                                <div className='w-1 h-1 rounded-full bg-gray-400'></div>
                                <div className='scale-90'><Privacy published={props.published} ownProfile={props.ownProfile} /></div>
                            </div>
                        </div>
                    </div>
                    <div onClick={handleClick} className='p-2 relative cursor-pointer w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-full'>
                        <MenuDotsIcon />
                        <MoreOptions ownProfile={props.ownProfile} open={open} handleEdit={handleEdit} handleDelete={handleDelete} />
                    </div>
                </div>
                <div className='flex flex-col gap-y-2 text-center relative'>
                    <p className='text-xl font-wotfard-md'>{props.title}</p>
                    <p className='text-sm text-gray-500 font-wotfard'>{props.description}</p>
                </div>
                <div className='items-center flex flex-col'>
                    <div className='w-full h-[1px] bg-gray-200 my-2'></div>
                    <figure className='w-full h-[400px] relative'>
                        <Image quality={100} src={props.thubmnailUrl ?? '/images/person.jpg'} fill={true} alt='Project Image' style={{ objectFit: 'contain' }} />
                    </figure>
                    <div className='w-full h-[1px] bg-gray-200 my-2'></div>
                </div>
                <div className='flex gap-x-2 -mt-2'>
                    {props.imagesUrl.map((image, i) =>
                        <Image key={i} quality={100} src={image} width={80} height={80} className='outline outline-1 outline-gray-300 hover:scale-110 cursor-pointer' alt='Project Image' />)}
                </div>
                {
                    props.imagesUrl.length > 0 && <div className='w-full h-[1px] bg-gray-200'></div>
                }
                <ProjectStats id={props.id} />
            </li>
        </Fragment>
    )
}