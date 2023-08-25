import { authOptions } from 'libs/auth';
import { Profile, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { Connected, UserProfile } from 'types/misc'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserProfile>
) {
const { query: { route } } = req
    const session = await getServerSession(req, res, authOptions);
    let connection;
    if(session && session.user.id !== route?.at(0)){
        connection = await prisma.user.findUnique({
            where: {id: session.user.id},
        }).connectionsUser({where: {connectedToId: route?.at(0) as string}})
        if(!connection || connection.length==0){
            connection = await prisma.user.findUnique({
                where: {id: route?.at(0) as string},
            }).connectionsTo({where: {userId: session.user.id}})
        }
    }
    const user = await prisma.user.findUnique({
        where: {
            id: route?.at(0) as string
        }
    })
    if(!user){
        return res.status(404).end()
    }
    let profile;
    try{
        profile = await prisma.profile.findUnique({
            where: {
                userId: user.id
            }
        })
    }catch(err){

    }

    connection = connection ? connection.length===0 ? null : connection : connection
    if(!profile){
        return res.json({...user, connection: connection ? connection[0] : null} as unknown as UserProfile);
    }
    const con = {connection: connection} as Connected
    return res.json({...user, ...con,...profile, bio: profile.bio ?? null})
}
