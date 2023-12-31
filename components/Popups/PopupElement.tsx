import Image from 'next/image'
import { FC, Fragment, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { Popup, UploadPartner, UserProfile, Wrapper } from 'types/misc';
import BioPopup from './BioPopup';
import { ExitIcon } from '@components/Icons/Profile';
import { changePopup } from 'store/PopupSlice';
import { Project } from '@prisma/client';
import ProjectPopup from './ProjectPopup';
import { ToastContainer } from 'react-toastify';

const PopupElement: FC = (props) => {
    const { popup, data } = useAppSelector(state => state.popup);
    const dispatch = useAppDispatch();
    const clickHandlerRef = useRef<((ev: MouseEvent) => void) | null>(null);
    useEffect(() => {
        if (popup === Popup.None) return;
        const handler = (ev: MouseEvent) => {
            if ((ev.target as HTMLElement).classList.contains('bg-gray-100')) {
                dispatch(changePopup({ popup: Popup.None, data: null }))
            }
        }
        clickHandlerRef.current = handler;

        window.addEventListener('click', clickHandlerRef.current);

        return () => {
            window.removeEventListener('click', clickHandlerRef.current!);
        }
    }, [popup])
    if (popup === Popup.None) return null;
    return (
        <PopupWrapper>
            {
                popup === Popup.Bio &&
                <BioPopup data={data as UserProfile} />
            }
            {
                popup === Popup.Project &&
                <ProjectPopup {...data as Project & {partners: {user: UploadPartner & {id: string}}[]}} />
            }
        </PopupWrapper>
    )
}

export const PopupWrapper: FC<Wrapper> = (props) => {
    return (
        <section className='w-[100vw] h-[100vh] fixed top-0 left-0 bg-gray-100 z-[999999999999999] bg-opacity-40 flex justify-center'>
            {props.children}
        </section>
    )
}
type PopupFrameProps = Wrapper & {
    title: string
    form?: boolean
    onSubmit?: () => void
}
export const PopupFrame: FC<PopupFrameProps> = (props) => {
    const { title, children } = props;
    const dispatcher = useAppDispatch();
    const handleExit = () => dispatcher(changePopup({ popup: Popup.None, data: null }))
    const handleSubmit = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.stopPropagation();
        props.onSubmit && props.onSubmit();
    }
    return (
        <div className='w-[40%] flex absolute top-[12.5%] flex-col bg-white rounded-xl shadow-allsides outline outline-1 outline-gray-300 min-w-[650px] md:min-w-[450px] sm:min-w-[350px] min-h-[200px] font-wotfard'>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            <div className='h-[20%] w-full flex justify-between py-4 px-6 font-wotfard-md border-b-2 text-lg'>
                <p>{title}</p>
                <div className='hover:fill-red-500 cursor-pointer scale-110' onClick={handleExit}>
                    <ExitIcon />
                </div>
            </div>
            <div className='h-[80%] overflow-y-auto scrollbar-dropdown w-full min-h-[200px] max-h-[60vh] z-[150]'>{children}</div>
            {
                props.form &&
                <div className='h-[10%] border-t-2 py-4 rounded-b-xl w-full flex justify-end items-center px-6 bg-white z-[200]'>
                    <button onClick={handleSubmit} className='bg-secondary hover:bg-sky-700 text-white rounded-md px-4 py-2'>Save</button>
                </div>
            }
        </div>
    )
}

export default PopupElement