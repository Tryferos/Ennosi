import Button from "@components/Button";
import { EmailIcon, FacebookIcon, GoogleIcon, PasswordIcon, UsernameIcon } from "@components/Icons/SignIn";
import InputField from "@components/InputField";
import { authOptions } from "@libs/auth";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";



export default function Register(){
    const {data: session, status, update} = useSession()
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if(!(firstName.length>=4 && lastName.length>4 && password.length>4)) return
            signIn('register',{firstName: firstName, lastName: lastName, password: password, email: email},);
        }
    const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value)
    }
    const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value)
    }
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }
    return (
        <article className='w-full h-[100vh] flex flex-row-reverse bg-white'>
        <form className='w-[55%] h-full flex flex-col items-center pt-[200px] gap-y-10' onSubmit={handleSubmit}>
            <div className='w-[calc(200px+10vw)] h-full flex flex-col gap-y-10'>
            <header className='flex flex-col justify-start gap-y-5'>
                <h1 className='font-wotfard-md text-2xl'>Welcome back!</h1>
                <h3 className='text-gray-500'>Start sharing your projects with others</h3>
            </header>
            <fieldset className='flex flex-col gap-y-4'>
            <InputField icon={<UsernameIcon/>} label='First Name' type='text' value={firstName} onChange={handleFirstName} placeholder='First Name' required={true} id='firstName'/>
            <InputField icon={<UsernameIcon/>} label='Last Name' type='text' value={lastName} onChange={handleLastName} placeholder='Last Name' required={true} id='lastName'/>
            <InputField icon={<EmailIcon/>} label='email' type='email' value={email} onChange={handleEmail} placeholder='email' required={true} id='email'/>
            <InputField icon={<PasswordIcon/>} label='password' type='password' value={password} onChange={handlePassword} placeholder='password' required={true} id='password'/>
            </fieldset>
            <Button label='Register'/>
            <div className='items-center w-full flex text-gray-400'>
                <div className='w-[45%] h-[2px] bg-gray-200'></div>
                <p className='w-[10%] text-center'>or</p>
                <div className='w-[45%] h-[2px] bg-gray-200'></div>
            </div>
            <ul className='flex justify-between'>
                <li className='w-[48%] hover:outline-gray-400 cursor-pointer px-4 py-4 flex items-center justify-evenly rounded-xl outline outline-1 outline-gray-300 font-wotfard-md'>
                    <div className='w-5 h-5 relative justify-center items-center'><GoogleIcon/></div>
                    <p>Google</p>
                </li>
                <li className='w-[48%] hover:outline-gray-400 cursor-pointer px-2 py-4 flex items-center justify-evenly rounded-xl outline outline-1 outline-gray-300 font-wotfard-md'>
                    <div className='w-6 h-6 relative flex justify-center items-center scale-110'><FacebookIcon/></div>
                    <p>Facebook</p>
                </li>
            </ul>
            <p className='text-center text-gray-400'>
                Already have an account? <a href='/signin' className='text-secondary hover:underline'>Sign in</a>
            </p>
            </div>
        </form>
        <section className='w-[45%] h-full bg-gray-100'>
            
        </section>
        </article>
    )
}


export const getServerSideProps = async (context: GetServerSidePropsContext) => {

    const session = await getServerSession(context.req, context.res, authOptions);
    if(session){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    const crfsToken = await getCsrfToken(context)
    return {
        props: {
            csrfToken: crfsToken
        }
    }
}