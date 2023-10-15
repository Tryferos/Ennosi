import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, Project, User } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { UploadPartner, UploadProject } from 'types/misc'

export type ProfileProject = (Project & {partners: {user: UploadPartner}[];author: Pick<User, 'firstName' | 'lastName' | 'id' | 'image'>})


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{projects: ProfileProject[]}>
) {
    const {userId} = req.query as {userId: string}
    const session = await getServerSession(req, res, authOptions);

    const projects= await prisma.project.findMany({
        where: {
            authorId: userId
        },
        include: {
            partners: {
                select: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            image: true
                        },
                    },
                },
            },
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true
                },
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) as unknown as ProfileProject[]

    return res.json({projects: projects});
    
}
