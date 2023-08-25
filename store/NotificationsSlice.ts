import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { Notifications, Popup, RequestJsonOptions } from 'types/misc';


const initialState: Notifications & {loading: boolean, error: Error | SerializedError | undefined} = {
    friendRequests: [],
    projectLikes: [],
    projectComments: [],
    projectCollaborations: [],
    loading: false,
    error: undefined,
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Payload = PayloadAction<Notifications>

export const fetchNotifications = createAsyncThunk( 'notifications/get', async (  ) => {
    const res = await fetch( '/api/profile/notifications', {
        ...RequestJsonOptions,
        method: 'GET'
    });
    const notifications = (await res.json()).friendRequests;
    
    return {
        friendRequests: notifications
    } as Notifications

} )

export const NotificationsSlice = createSlice( {
    name: 'notifications',
    initialState: initialState,
    extraReducers: ( builder ) => {
        builder.addCase( fetchNotifications.pending, ( state ) => {
            state.loading = true;
        } );
        builder.addCase( fetchNotifications.rejected, ( state, action ) => {
            state.loading = false;
            state.error = action.error
        } );
        builder.addCase( fetchNotifications.fulfilled, ( state, action ) => {            
            state['friendRequests'] = action.payload['friendRequests'];
            state.loading = false;
            state.error = undefined;
        } );
    },
    reducers: {
        addNotifications: ( state, action: Payload ) => {
            return { ...state, ...action.payload }
        },
        removeNotifications: ( state, action: PayloadAction<unknown> ) => {
            return { ...state, data: action.payload }
        }
    },
} )



export const { addNotifications, removeNotifications } = NotificationsSlice.actions
export default NotificationsSlice.reducer