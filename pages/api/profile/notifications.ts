import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';
import { Notifications } from 'types/misc';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean} & Partial<Notifications>>
) {
    const session = await getServerSession(req, res, authOptions);
    if(!session){
        return res.json({success: false})
    }

    const {user: {id: userId}} = session;

    const requests = await prisma.user.findUnique({
        where: {id: userId},
    }).connectionsTo({where: {accepted: false}})

    return res.json({success: true, friendRequests: requests?.map(item => ({userId: item.userId, id: item.id, createdAt: item.createdAt}))});



}
