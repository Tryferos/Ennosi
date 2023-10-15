import { PrismaClient, Profile, User } from '@prisma/client'
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import formidable, { IncomingForm } from "formidable";
import cloudinary from 'cloudinary';
import { uploadImage } from '@lib/cloudinary';

export const config = {
    api: {
        bodyParser: false
    }
}


export async function getImage(formData: NextApiRequest) {
  const data: {files: formidable.Files,fields: formidable.Fields} = await new Promise(function (resolve, reject) {
    const form = new IncomingForm({ keepExtensions: true });
    form.parse(formData, function (err, fields, files) {
        if (err) return reject(err);
      resolve({ fields, files });
    });
  });

  return data.files.image;
}

export type QueryType = {
    id: string;
    type: 'thumbnail';
} | {
    id: string;
    type: 'images';
    index: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{success: boolean}>
) {
    const imageUploaded = await getImage(req);
    const q = req.query as QueryType;
    if(!imageUploaded || !imageUploaded[0] || !imageUploaded[0].filepath){
        return res.status(400).json({success: false})
    }
    const imageData = await uploadImage(imageUploaded[0].filepath);
    if(q.type==='images'){
        if(q.index==0){
            await prisma.project.update({
                where: {
                    id: q.id
                },
                data: {
                    imagesUrl: {
                        set: []
                    }
                }
            })
        }
        await prisma.project.update({
            where: {
                id: q.id
            },
            data: {
                imagesUrl: {
                    push: imageData.secure_url
                }
            }
        })
        return res.json({success: true})
    }
    if(q.type === 'thumbnail'){
        await prisma.project.update({
            where: {
                id: q.id
            },
            data: {
                thubmnailUrl: imageData.secure_url
            }
        })
        return res.json({success: true})
    }
    
    return res.json({success: false})
    
    
}
