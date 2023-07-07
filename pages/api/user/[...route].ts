import { Profile, User } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User & Profile>
) {
const { query: { route } } = req
    const user = await prisma.user.findUnique({
        where: {
            id: route?.at(0) as string
        }
    })
    if(!user){
        return res.status(404).end()
    }
    const profile = await prisma.profile.findUnique({
        where: {
            userId: user.id
        }
    })
    if(!profile){
        return res.json(user as unknown as User & Profile);
    }
    return res.json({...user, bio: profile.bio ?? null, userId: profile.userId})
}
