import { SignInIcon } from '@components/Icons/Navigation'
import { EditIcon } from '@components/Icons/Profile'
import { Profile, User } from '@prisma/client'
import Image from 'next/image'
import { FC, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import { changePopup } from 'store/PopupSlice'
import { useAppDispatch } from 'store/hooks'
import { Popup } from 'types/misc'

const Bio: FC<Profile & User & {ownProfile: boolean}> = (props) => {
    const dispatch = useAppDispatch()
    const handleEdit = () => props.ownProfile && dispatch(changePopup({popup: Popup.Bio, data: props}));
    if(!props.bio){
        return (
        <div className='text-gray-500 w-full flex justify-between items-center'>
            {props.ownProfile ? <p>You have not added your bio yet.</p> : <p>This user has not added a bio yet. But we are sure they are awesome 😀</p>}
            {props.ownProfile && <div onClick={handleEdit} className='p-2 hover:bg-gray-100 cursor-pointer rounded-full'><EditIcon/></div>}
        </div>
        )
    }
    return (
        <></>
    )
}

export default Bio