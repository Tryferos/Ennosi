import { useFetch } from '@components/Hooks/useFetch'
import { SignInIcon } from '@components/Icons/Navigation'
import { EditIcon } from '@components/Icons/Profile'
import { Profile, User } from '@prisma/client'
import Image from 'next/image'
import { FC, Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { changePopup } from 'store/PopupSlice'
import { useAppDispatch } from 'store/hooks'
import { Popup, RequestJsonOptions } from 'types/misc'

const Bio: FC<Profile & User & {ownProfile: boolean}> = (props) => {
    const dispatch = useAppDispatch()
    const handleEdit = () => props.ownProfile && dispatch(changePopup({popup: Popup.Bio, data: props}));
        return (
        <div className='text-gray-500 w-full flex justify-between items-start relative flex-col gap-y-2'>
            {
                props.bio ? <BioText {...props}/> : 
                (props.ownProfile ? <p>You have not added your bio yet.</p> : <p>This user has not added a bio yet. But we are sure they are awesome 😀</p>)
            }
            {props.ownProfile && <div onClick={handleEdit} className='p-2 hover:bg-gray-100 cursor-pointer rounded-full absolute top-0 right-0'><EditIcon/></div>}
        </div>
        )
}

export default Bio

const BioText: FC<Omit<Profile, 'userId' | 'id'>>  = (props) => {
    const {bio, city, nationality, gender} = props;
    const [loading, setIsLoading] = useState<boolean>(false);
    const ref = useRef<HTMLTextAreaElement>(null);
    const [url, setUrl] = useState<string>()
    useEffect(() => {
        if(ref.current === null) return;
        ref.current.style.height = `${bio.split('\n').length * 1.5}em`;    
        
    }, [bio, ref.current])
    useEffect(() => {
        if(url) return;
        (async () => {
            const res = await fetch(
                'https://countriesnow.space/api/v0.1/countries/iso',
                {
                    ...RequestJsonOptions,
                    body: JSON.stringify({
                        country: nationality
                    })
                }
            )
            if(res.status!=200)return;
            const {data: {Iso2}}: {data: {Iso2: string}} = await res.json();
            setUrl(`https://flagcdn.com/256x192/${Iso2.toLowerCase()}.png`)
        })()

    }, [nationality])
    return (
        <Fragment>
            <figure className='font-wotfard-md flex gap-x-2'>
                {url && <Image src={url} alt='Nationality Icon' width={32} height={24} className='rounded-md scale-80'/>}
                <p>{nationality}, {city}  </p>  
            </figure>
            <textarea ref={ref} value={bio} readOnly className='resize-none overflow-y-hidden w-full big:max-w-[800px] small:max-w-[350px] focus:outline-none font-wotfard'>
            </textarea>
        </Fragment>
    )
}