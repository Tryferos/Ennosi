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
                username: { label: "username", type: "text", placeholder: "jsmith" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                const dbUser = await db.user.findFirst({
                    where: {
                        OR: [
                            {email: credentials?.username},
                            {username: credentials?.username}
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
                username: { label: "username", type: "text", placeholder: "jsmith" },
                email: { label: "email", type: "email", placeholder: "example@yahoo.gr"},
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, req) {
                const dbUser = await db.user.findFirst({
                    where: {
                        OR: [
                            {email: credentials?.email},
                            {username: credentials?.username}
                        ]
                    }
                })

                if(dbUser || !credentials?.username || !credentials?.email || !credentials?.password){
                    return null;
                }

                const newUser = await db.user.create({
                    data: {
                        username: credentials?.username,
                        email: credentials?.email,
                        password: credentials?.password,
                    }
                })

                return { id: newUser.id, username: newUser.username, email: newUser.email };
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
            if(!dbUser.name){
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        name: nanoid(12),
                    }
                });
            }
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image,
                username: dbUser.username,
            }
        },
        redirect() {
            return '/'
        }
    },
}

export const getAuthSession = () => getServerSession(authOptions);