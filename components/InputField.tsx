import Image from 'next/image'
import { FC, Fragment, ReactNode } from 'react'
import Button from './Button';

type InputProps = {
    label: string;
    type: 'text' | 'password' | 'email' | 'number';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string
    icon: ReactNode
}
const InputField: FC<InputProps> = (props) => {
    const {label, type, value, onChange, placeholder, required, disabled, id, icon} = props
    return (
        <div className='flex outline outline-0 rounded-lg focus-within:outline-1 bg-gray-100 w-full outline-secondary font-wotfard text-primary py-1 p-2 items-center'>
            <div className='w-9 h-8 flex justify-center items-center fill-secondary bg-white p-[6px] rounded-md'>{icon}</div>
            <input className='bg-transparent rounded-md py-2 focus:outline-none placeholder:first-letter:uppercase w-full px-4'
            id={props.id} value={props.value} onChange={props.onChange} 
            name={props.label} type={props.type} placeholder={props.placeholder} required={props.required} disabled={props.disabled}/>
        </div>
    )
}

export default InputField