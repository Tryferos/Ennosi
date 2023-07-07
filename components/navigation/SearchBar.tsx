import { SearchbarIcon } from '@components/Icons/Navigation'
import Image from 'next/image'
import { FC, Fragment, useRef, useState } from 'react'

const SearchBar: FC = (props) => {
    const ref = useRef<HTMLInputElement>(null)
    const handleClick = () => ref && ref.current && ref.current.focus();
    return (
    <div className='w-[40%] min-w-[150px] gap-x-2 flex px-4 py-2 focus-within:bg-gray-100 rounded-full  items-center'>
        <figure onClick={handleClick} className='cursor-pointer p-3 peer-focus:p-0 bg-gray-100 rounded-full'><SearchbarIcon/></figure>
        <input ref={ref} className='outline-none w-full h-full focus:bg-gray-100 focus:placeholder:visible placeholder:invisible peer' type='text' placeholder='Search'/>
    </div>
    )
}

export default SearchBar