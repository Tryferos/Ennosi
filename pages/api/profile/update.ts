import { PrismaClient, Profile, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<null>
) {
    const {nationality, city, bio, gender, userId} = req.body as Omit<Profile, 'id'>
    const profile = await prisma.profile.findUnique({
        where: {
            userId: userId
        }
    });
    if(profile){
       await prisma.profile.update({
            where: {
                id: profile.id
            },
            data: {
                nationality: nationality,
                city: city,
                bio: bio,
                gender: gender
            }
        })
        
        return res.status(200).end();
    }
    await prisma.profile.create({
        data: {
            userId: userId,
            nationality: nationality,
            city: city,
            bio: bio,
            gender: gender
        }
    });
    return res.status(200).end();
}
