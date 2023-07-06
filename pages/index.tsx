import Image from 'next/image'
import {motion} from 'framer-motion'
import {signIn} from  'next-auth/react'
import { useEffect } from 'react'
import { Prisma, PrismaClient } from '@prisma/client'


export default function Home() {
  return (
    <motion.p>
      <input type='button' value='Sign in' onClick={() => signIn()}/>
      

    </motion.p>
  )
}
