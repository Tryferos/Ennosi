import { configureStore } from '@reduxjs/toolkit'
import { PopupsSlice } from './PopupSlice'
import { NotificationsSlice } from './NotificationsSlice'

export const store = configureStore({
  reducer: {
    popup: PopupsSlice.reducer,
    notifications: NotificationsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch