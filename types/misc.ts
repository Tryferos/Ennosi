import { Profile, User } from "@prisma/client";

export enum Popup{
    None,
    Bio,
}

export type UserProfile = User & Profile & {ownProfile?: boolean}

export type Wrapper = {
    children: React.ReactNode;
}

export type PopupData<T> = {
    data: T;
}
