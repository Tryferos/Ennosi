import { Comment, Connection, Like, Profile, Project, User } from "@prisma/client";

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
