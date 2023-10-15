import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, Project, User } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { UploadPartner, UploadProject } from 'types/misc'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) {
    const id = (req.body as Pick<Project, 'id'>).id
    const session = await getServerSession(req, res, authOptions);
    if(!session || !id) return res.json({success: false})

    const project = await prisma.project.findUnique({
        where: {
            id: id,
        },
    });

    if(!project || !project.authorId || session.user.id != project.authorId) return res.json({success: false});

    const partners = await prisma.projectPartners.deleteMany({
        where: {
            projectId: id,
        }
    })

    const result = await prisma.project.delete({
        where: {
            id: id,
        }
    })

    if(!result) return res.json({success: false});
    return res.json({success: true});
}
