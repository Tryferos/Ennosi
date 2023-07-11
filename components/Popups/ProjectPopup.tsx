import Image from 'next/image'
import { FC, Fragment } from 'react'
import { PopupFrame } from './PopupElement'
import { Project } from '@prisma/client'

const ProjectPopup: FC<Project | null> = (props) => {

    const handleSubmit = () => {

    }

    return (
        <PopupFrame title='Create a new Project' form={true} onSubmit={handleSubmit}>
            <form className='py-4 px-6 text-primary flex flex-col gap-y-6'>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='title'>Project Title<span aria-label='required'>*</span></label>
                    <input placeholder="Enter Project's title" type='text' name='title' id='title' className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' required />
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='description'>Project Description<span aria-label='required'>*</span></label>
                    <textarea placeholder="Enter Project's description" name='description' id='description' className='w-full h-[100px] max-h-[200px] outline outline-1 focus:outline-gray-400 min-h-[75px] outline-gray-200 rounded-md py-2 px-4' required></textarea>
                </div>
                <div className='flex w-full gap-x-10'>
                    <div className='flex flex-col gap-y-2 w-full'>
                        <label className='text-gray-600 font-wotfard-md' htmlFor='github'>Github URL</label>
                        <input placeholder="Enter Github url" type='text' name='github' id='github' className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' />
                    </div>
                    <div className='flex flex-col gap-y-2 w-full'>
                        <label className='text-gray-600 font-wotfard-md' htmlFor='demo'>Demo URL</label>
                        <input placeholder="Enter Demo url" type='text' name='demo' id='demo' className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' />
                    </div>
                </div>
                <div className='flex gap-x-10'>
                    <div className='basis-[50%] flex flex-col gap-y-4'>
                        <label htmlFor='connections' className='font-wotfard-md'>Project Partners</label>
                        <input placeholder="Search people" type='text' name='connections' id='connections' 
                        className='outline outline-1 outline-gray-300 py-2 rounded px-4 focus:outline-gray-400' />

                    </div>
                    <div className='flex flex-col gap-y-4 basis-[50%]'>
                        <label htmlFor='privacy' className='font-wotfard-md'>Who can see this Project?</label>
                        <ul className='flex flex-col gap-y-2'>
                            <li className='flex gap-x-2 font-wotfard-md cursor-pointer'>
                                <input className='accent-secondary scale-110 cursor-pointer -mt-4' type="radio" name="privacy" id="public" />
                                <label htmlFor='public' className='flex flex-col '>
                                    <p className='font-wotfard-md'>Public</p>
                                    <p className='font-wotfard text-gray-400 text-sm'>This project visible by everyone.</p>
                                </label>
                            </li>
                            <li className='flex gap-x-2 font-wotfard-md cursor-pointer items-start'>
                                <input className='accent-secondary scale-110 cursor-pointer mt-2' type='radio' name='privacy' id='friends'/>
                                <label htmlFor='friends' className='flex flex-col p-'>
                                    <p className='font-wotfard-md'>Friends</p>
                                    <p className='font-wotfard text-gray-400 text-sm'>This project is only visible by people you are connected with.</p>
                                </label>
                            </li>
                            <li className='flex gap-x-2 font-wotfard-md cursor-pointer'>
                                <input className='accent-secondary scale-110 cursor-pointer -mt-4' type="radio" name="privacy" id="private" />
                                <label htmlFor='private' className='flex flex-col p-'>
                                    <p className='font-wotfard-md'>Private</p>
                                    <p className='font-wotfard text-gray-400 text-sm'>This project is only visible by you.</p>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex items-center gap-x-4'>
                    <div className="shrink-0">
                        <img className="h-16 w-16 object-cover rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" alt="Current profile photo" />
                    </div>
                    <label className="block">
                        <span className="sr-only">Choose profile photo</span>
                        <input type="file" className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-violet-50 file:text-secondary
                            hover:file:bg-violet-100
                            "/>
                    </label>
                </div>
            </form>
        </PopupFrame>
    )
}

export default ProjectPopup