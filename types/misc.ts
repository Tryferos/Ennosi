import { Comment, Connection, Like, Profile, Project, ProjectPartners, User } from "@prisma/client";

export enum Popup{
    None,
    Bio,
    Project,
}
export type Connected = {
    connection: Connection | null;
}
export type UserProfile = User & Profile & {ownProfile?: boolean} & Connected

export type Wrapper = {
    children: React.ReactNode;
}

export type PopupData<T> = {
    data: T;
}

export const RequestJsonOptions: RequestInit = {
    headers: {'Content-Type': 'application/json'},
    method: 'POST',
}

export type Notifications = {
    friendRequests: Array<Pick<Connection, 'id' | 'createdAt' | 'userId'>>;
    projectLikes: Array<Omit<Like, 'hasLiked'>>;
    projectComments: Array<Comment>;
    projectCollaborations: Array<Pick<Project, 'authorId' | 'updatedAt' | 'createdAt' | 'thubmnailUrl' | 'id' | 'title'>>
}


export type UploadProject = Partial<Pick<Project, 'demoUrl' | 'description' | 'title' | 'thubmnailUrl' | 'githubUrl' | 'id' | 'published' | 'imagesUrl'>>;
export type UploadPartner = Pick<ProjectPartners, 'userId'> & Pick<User, 'firstName' | 'lastName'> & Partial<Pick<User, 'image'>>;