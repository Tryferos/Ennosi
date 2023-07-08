import { Gender, Profile } from '@prisma/client'
import Image from 'next/image'
import { FC, Fragment, useEffect, useState } from 'react'
import { PopupData, UserProfile } from 'types/misc'
import { PopupFrame } from './PopupElement'

const BioPopup: FC<PopupData<UserProfile>> = (props) => {
    const {data: user} = props;
    const [bio, setBio] = useState<string>(user.bio ?? '')
    const [nationality, setNationality] = useState<string>()
    const [city, setCity] = useState<string>()
    const [gender, setGender] = useState<Gender>()
    const [nations, setNations] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    if(user.ownProfile===false){
        return null;
    }
    useEffect(() => {
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
            setNationality(c[0]);
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
            setCities(cities);
            setIsLoading(false)
        })()
    }, [nationality, nations])
    const handleSubmit = () => {


    }
    return (
        <PopupFrame title={`Change your bio.`} form={true} onSubmit={handleSubmit}>
            <form className='py-4 px-6 text-primary flex flex-col gap-y-6'>
                <div className='flex flex-col gap-y-2'>
                    <label className='text-gray-600 font-wotfard-md' htmlFor='bio'>Enter your Bio</label>
                    <textarea placeholder='No bio yet.' name='bio' id='bio' className='w-full h-[100px] border-2 max-h-[200px] focus:outline-none min-h-[75px] border-gray-300 rounded-md p-2' value={bio} onChange={(ev) => setBio(ev.target.value)}></textarea>
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