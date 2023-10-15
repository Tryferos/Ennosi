import { authOptions } from 'libs/auth';
import { PrismaClient, Profile, User } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { UploadPartner, UploadProject } from 'types/misc'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{success: false} | {success: true, id: string}>
) {
    const proj = req.body as UploadProject & {partners: UploadPartner[]}
    const session = await getServerSession(req, res, authOptions);
    if(!session) return res.json({success: false})
    if(proj.id){
        const project = await prisma.project.findUnique({
            where: {
                id: proj.id
            }
        })
        if(!project || project.authorId!=session.user.id) return res.json({success: false});
        const result = await prisma.project.update({
            where: {
                id: proj.id,
            },
            data: {
                title: proj.title,
                description: proj.description,
                githubUrl: proj.githubUrl,
                demoUrl: proj.demoUrl,
                thubmnailUrl: proj.thubmnailUrl,
                published: proj.published,
                imagesUrl: proj.imagesUrl,
                }
        });
        if(result==null || !result.authorId) return res.json({success: false});
        await prisma.projectPartners.deleteMany({
            where: {
                projectId: proj.id
            }
        })
        for(let i=0; i<proj.partners.length; i++){
            await prisma.projectPartners.create({
                data: {
                    userId: proj.partners[i].userId,
                    projectId: proj.id
                }
            })
        }
        return res.json({success: true, id: result.id});
    }
    if(!proj || !proj.title) return res.json({success: false});
    try{
        const project = await prisma.project.create({
            data: {
                title: proj.title,
                description: proj.description,
                githubUrl: proj.githubUrl,
                demoUrl: proj.demoUrl,
                thubmnailUrl: proj.thubmnailUrl,
                published: proj.published,
                authorId: session.user.id,
                imagesUrl: proj.imagesUrl,
                partners: {
                    create: proj.partners.map(item => ({userId: item.userId,}))
                }
            }
        })
        return res.json({success: true, id: project.id});
    }catch(err){
        return res.json({success: false});
    }
    
}
