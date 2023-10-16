import { authOptions } from 'libs/auth';
import { Like, PrismaClient, Profile, Project, User } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { UploadPartner, UploadProject } from 'types/misc'

export type ProjectLike = Like & {user: Pick<User, 'username' | 'image'>}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{likes: ProjectLike[]; hasLiked: boolean}>
) {
    const {id} = req.query as {id: string}
    const session = await getServerSession(req, res, authOptions);

    const likes = await prisma.like.findMany({
        where: {
            projectId: id,
            hasLiked: true
        },
        include: {
            user: {
                select: {
                    username: true,
                    image: true,
                }
            },
        }
    })

    const hasLiked = likes.some(like => like.userId===session?.user.id && like.hasLiked)

    return res.json({likes: likes, hasLiked: hasLiked});
    
}
