import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) {
    const {userId: friendId} = req.body as Pick<Profile, 'userId'>;
    const session = await getServerSession(req, res, authOptions);
    if(!session){
        return res.json({success: false})
    }

    const {user: {id: userId}} = session;
    let connection = await prisma.user.findUnique({
        where: {id: userId},
    }).connectionsUser({where: {connectedToId: friendId}})
    

    if(!connection || connection.length===0){
        connection = await prisma.user.findUnique({
            where: {id: friendId},
        }).connectionsUser({where: {connectedToId: userId}})
    }

    if(!connection || connection.length===0){
        return res.json({success: false})
    }

    await prisma.user.update({
        where: {id: userId},
        data: {
            connectionsUser: {
                delete: {
                    id: connection[0].id
                }
            }
        }
    })

    const friendConnection = await prisma.user.findUnique({
        where: {id: friendId},
    }).connectionsUser({where: {connectedToId: userId}});

    if(!friendConnection || friendConnection.length==0)return res.json({success: false});

    await prisma.user.update({
        where: {id: friendId},
        data: {
            connectionsUser: {
                delete: {
                    id:friendConnection[0].id
                }
            }
        }
    })

    return res.json({success: true});
}
