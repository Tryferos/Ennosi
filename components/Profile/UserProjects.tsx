import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { getServerSideProps } from 'pages/account/[userId]'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { ProfileSectionWrapper } from './UserProfile'
import { AddIcon, DemoIcon, FriendsIcon, GithubIcon, PrivateIcon, PublicIcon } from '@components/Icons/Profile'
import { useAppDispatch } from 'store/hooks'
import { changePopup } from 'store/PopupSlice'
import { Popup } from 'types/misc'
import { ProfileProject } from 'pages/api/project/get'
import Link from 'next/link'
import { Publicity } from '@prisma/client'
import { parseDate } from '@lib/dates'

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
            console.log(projects);
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
                    {cursorId && <LinksInfo {...projects.find(item => item.id == cursorId)} />}
                </div>
            </div>
        </section>
    )
}

export default UserProjects

const LinksInfo: FC<Partial<Pick<ProfileProject, 'demoUrl' | 'githubUrl' | 'partners'>>> = (props) => {
    if (!props) return null;
    return (
        <ul className='flex flex-col gap-y-6 justify-center items-center'>
            <div className='absolute top-0'>
                <p className='text-sm font-wotfard-md underline'>Links</p>
            </div>
            {props.githubUrl && <Link href={props.githubUrl} target='_blank' title='Github' className='hover:fill-purple-700 scale-150 cursor-pointer'><GithubIcon /></Link>}
            {props.demoUrl && <Link href={props.demoUrl} target='_blank' title='Live Demo' className='hover:fill-purple-700 scale-150 cursor-pointer'><DemoIcon /></Link>}
            {props.partners && props.partners.map((_p, _i) => {
                const { image, firstName, lastName, userId } = _p.user;
                return (
                    <Link key={_i} title={`${firstName} ${lastName}`} target='_blank' href={`/account/${userId}`}>
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
    props.published
    return (
        <Fragment>
            <li data-index={props.id} className='flex flex-col relative p-8 gap-y-5 rounded bg-white'>
                <div className='flex justify-between p-0 relative'>
                    <figure className='w-[64px] h-[64px] relative rounded-full bg-gray-200 border-4 border-white'>
                        <Image src={props.author.image ?? '/images/person.jpg'} fill={true} style={{ objectFit: 'cover' }} alt='Profile Picture' className='rounded-full' />
                    </figure>
                    <div className='flex flex-col text-center'>
                        <p className='font-wotfard-sb text-lg'>{props.author.firstName} {props.author.lastName}</p>
                        <p>{parseDate(props.createdAt)}</p>
                    </div>
                    <div className='scale-90'><Privacy published={props.published} ownProfile={props.ownProfile} /></div>
                </div>
                <figure className='w-full h-[400px] relative'>
                    <Image quality={100} src={props.thubmnailUrl ?? '/images/person.jpg'} fill={true} alt='Project Image' style={{ objectFit: 'cover' }} />
                </figure>
                <div className='flex gap-x-2 -mt-2'>
                    {props.imagesUrl.map((image, i) =>
                        <Image key={i} quality={100} src={image} width={80} height={80} className='outline outline-1 outline-gray-300 hover:scale-110 cursor-pointer' alt='Project Image' />)}

                </div>
                <div className='flex flex-col gap-y-2 text-center relative'>
                    <p className='text-xl font-wotfard-md'>{props.title}</p>
                    <p className='text-sm text-gray-500 font-wotfard'>{props.description}</p>
                </div>
            </li>
        </Fragment>
    )
}

const Privacy: FC<Pick<ProfileProject, 'published'> & { ownProfile: boolean }> = (props) => {
    const { ownProfile } = props;
    return <div title={props.published} className={`${ownProfile && 'cursor-pointer hover:fill-slate-800 hover:scale-110'} fill-slate-500`}>
        {
            (props.published == Publicity.Private) ? <PrivateIcon />
                : (props.published == Publicity.Public) ? <PublicIcon />
                    : (props.published == Publicity.Friends) ? <FriendsIcon />
                        : null
        }
    </div>
}