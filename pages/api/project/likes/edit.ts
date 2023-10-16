import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, User } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { UploadPartner, UploadProject } from 'types/misc'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) {
    const {id: projectId} = req.body as {id: string}
    const session = await getServerSession(req, res, authOptions);
    if(!session) return res.json({success: false})

    const like = await prisma.like.findFirst({
        where: {
            projectId: projectId,
            userId: session.user.id
        }
    })


    if(!like){
        await prisma.like.create({
            data: {
                projectId: projectId,
                userId: session.user.id,
                hasLiked: true,
            }
        })
        return res.json({success: true})
    }

    await prisma.like.update({
        where: {
            id: like.id
        },
        data: {
            hasLiked: !like.hasLiked
        }
    })
    return res.json({success: true})
}
