import { Gender, Profile } from '@prisma/client'
import Image from 'next/image'
import { FC, Fragment, use, useEffect, useState } from 'react'
import { PopupData, UserProfile } from 'types/misc'
import { PopupFrame } from './PopupElement'
import { useFetch } from '@components/Hooks/useFetch'

const BioPopup: FC<PopupData<UserProfile>> = (props) => {
    const {data: user} = props;
    const [bio, setBio] = useState<string>(user.bio ?? '')
    const [nationality, setNationality] = useState<string>()
    const [city, setCity] = useState<string>()
    const [gender, setGender] = useState<Gender>(Gender.Male)
    const [nations, setNations] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {post} = useFetch();
    if(user.ownProfile===false){
        return null;
    }
    useEffect(() => {
        user.nationality && setNationality(user.nationality);
        user.city && setCity(user.city);
        if(nations.length!=0) return;
        (async () => {
            setIsLoading(true)
            const data = await fetch('https://countriesnow.space/api/v0.1/countries', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
        })
            const {data: countries} = await data.json();
            const c = countries.map((c: {country: string}) => c.country);
            setNations(c);
            user.nationality ?? setNationality(c[0]);
            setIsLoading(false)
        })()
    }, [])
    useEffect(() => {
        if(nationality===undefined) return;
        if(nations.length==0) return;
        (async () => {
            setIsLoading(true)
            const data = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    country: nationality
                }),
        })
            const {data: cities} = await data.json();
            if(nationality===user.nationality){
                user.city ? setCity(user.city) : setCity(cities[0]);
            }
            setCities(cities);
            setIsLoading(false)
        })()
    }, [nationality, nations])
    const handleSubmit = () => {
        if(bio.length>200) return alert('Bio must be less than 200 characters.');
        if(bio.split('\n').length>5) return alert('Bio must be less than 5 lines.');
        (async () => {
            post(
                '/api/profile/update',
                {bio, nationality, city, gender, userId: user.userId ?? user.id},
                (res: unknown) => {
                    if(res!==null){
                        window.location.reload();
                    }
                }
            )
        })()

    }
    const handleTextArea: React.ChangeEventHandler<HTMLTextAreaElement> = (ev) => {
        if(ev.target.value.split('\n').length>5) return;
        setBio(ev.target.value)
    }
    return (
        <PopupFrame title={`Change your bio.`} form={true} onSubmit={handleSubmit}>
            <form className='py-4 px-6 text-primary flex flex-col gap-y-6'>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='bio'>Enter your Bio</label>
                    <textarea placeholder='No bio yet.' name='bio' id='bio' className='w-full h-[100px] max-h-[200px] border-2 focus:outline-none min-h-[75px] border-gray-200 rounded-md p-2' value={bio} onChange={handleTextArea}></textarea>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='nationality'>Pick your Nationality <span aria-label="required">*</span></label>
                    <select disabled={isLoading} onChange={(ev) => setNationality(ev.target.value)} value={nationality} name='nationality' id='nationality' className='focus:outline-none cursor-pointer rounded-md px-2 shadow-below py-2 font-wotfard-md'>
                        {
                            nations.map((nation, i) => <option key={i} value={nation}>{nation}</option>)
                        }
                    </select>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='city'>Pick your City<span aria-label="required">*</span></label>
                    <select disabled={isLoading} onChange={(ev) => setCity(ev.target.value)} value={city} id='city' name='city'className='focus:outline-none cursor-pointer rounded-md px-2 shadow-below py-2 font-wotfard-md'>
                        {
                            cities.map((city, i) => <option key={i} value={city}>{city}</option>)
                        }
                    </select>
                </div>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='gender'>Pick your Gender<span aria-label="required">*</span></label>
                    <select onChange={(ev) => setGender(ev.target.value as Gender)} value={gender} id='gender' name='gender' className='focus:outline-none font-wotfard-md cursor-pointer rounded-md px-2 shadow-below py-2'>
                        {
                            Object.values(Gender).map((gender, i) => <option key={i} value={gender}>{gender}</option>)
                        }
                    </select>
                </div>
            </form>
        </PopupFrame>
    )
}

export default BioPopup