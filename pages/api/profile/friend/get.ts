import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { UploadPartner } from 'types/misc';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{partners: UploadPartner[]}>
) {
    const session = await getServerSession(req, res, authOptions);
    if(!session){
        return res.json({partners: []})
    }

    const {user: {id: userId}} = session;
    let connections = await prisma.user.findUnique({
        where: {id: userId},
    }).connectionsUser({where: {accepted: true}})

    if(!connections || connections.length===0){
        return res.json({partners: []})
    }

    let partners: UploadPartner[] = [];

    for(let i=0; i<connections.length; i++){
            const user = await prisma.user.findUnique({
                where: {id: connections[i].connectedToId},
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true
                }
            })
            if(!user) return;
            partners.push({...user, userId: user.id})

    }

    return res.json({partners: partners});
}
