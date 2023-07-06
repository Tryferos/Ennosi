import Image from 'next/image'
import { FC, Fragment } from 'react'

type ButtonProps = {
    label: string;
    onclick?: () => void;
}

const Button: FC<ButtonProps> = (props) => {
    const {label, onclick} = props
    return (
        <button onClick={onclick} className='py-3 px-10 w-full rounded-xl bg-secondary text-white hover:brightness-125 font-wotfard-sb'>{label}</button>
    )
}

export default Button