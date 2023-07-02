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
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                return null
            }
        })
    ],
    callbacks: {
        async session({token, session}) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.picture;
            session.user.username = token.username;
            return session
        },
        async jwt({token, user}) {
            const dbUser = await db.user.findFirst({
                where: {
                    email: token.email!,
                }
            })
            if(!dbUser){
                token.id = user!.id;
                return token;
            }
            if(!dbUser.username){
                await db.user.update({
                    where: {
                        id: dbUser.id,
                    },
                    data: {
                        username: nanoid(12),
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
        redirect({url, baseUrl}) {
            return url.startsWith(baseUrl) ? url : baseUrl
        }
    },
}

export const getAuthSession = () => getServerSession(authOptions);