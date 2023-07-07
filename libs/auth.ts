import { NextAuthOptions, Session, User, getServerSession } from "next-auth";
import {PrismaAdapter} from '@next-auth/prisma-adapter'
import db from './db'
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { nanoid } from "@reduxjs/toolkit";



export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin",
    },
    providers: [
        Credentials({
            id: 'login',
            name: "Login Credentials",
            credentials: {
                email: { label: "email", type: "email", placeholder: "example@yahoo.coom" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                const dbUser = await db.user.findFirst({
                    where: {
                        OR: [
                            {email: credentials?.email},
                        ]
                    }
                })
                if(dbUser && dbUser.password === credentials?.password){
                    return dbUser;
                }
                return null
            }
        }),
        Credentials({
            id: 'register',
            name: "Register Credentials",
            credentials: {
                firstName: { label: "First Name", type: "text", placeholder: "jsmith" },
                lastName: { label: "Last Name", type: "text", placeholder: "jsmith" },
                email: { label: "email", type: "email", placeholder: "example@yahoo.gr"},
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                const dbUser = await db.user.findFirst({
                    where: {
                        OR: [
                            {email: credentials?.email},
                        ]
                    }
                })

                if(dbUser || !credentials?.firstName || !credentials.lastName || !credentials?.email || !credentials?.password){
                    return null;
                }

                const newUser = await db.user.create({
                    data: {
                        username: `${credentials?.firstName}_${credentials?.lastName}`.toLowerCase(),
                        email: credentials?.email,
                        password: credentials?.password,
                        firstName: credentials?.firstName,
                        lastName: credentials?.lastName,
                    }
                })


                return { id: newUser.id, username: newUser.username, email: newUser.email, firstName: newUser.firstName, lastName: newUser.lastName };
            }
        })
    ],
    callbacks: {
        async session({token, session}) {
            if(token){
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.username = token.username;
                session.user.firstName = token.firstName;
                session.user.lastName = token.lastName;
            }
            return session
        },
        async jwt({token, user}) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email!,
                }
            })
            if(!dbUser){
                return token;
            }
            return {
                id: dbUser.id,
                username: dbUser.username,
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
                email: dbUser.email,
                picture: dbUser.image,
            }
        },
        redirect() {
            return '/'
        }
    },
}

export const getAuthSession = () => getServerSession(authOptions);