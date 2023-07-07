import type {Session, User} from 'next-auth'
import type {JWT} from 'next-auth/jwt'
import type { SignInOptions } from 'next-auth/react'

type NextAuthUserExtra = {id: string;username?: string | null}

declare module 'next-auth' {
    interface Session {
        user: User & {
            id: string;
            username?: string | null;
            firstName: string;
            lastName: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT{
        id: string
        username?: string | null
        firstName: string
        lastName: string
    }
}

type SignInOptions = {
    firstName: string;
    lastName: string;
}
