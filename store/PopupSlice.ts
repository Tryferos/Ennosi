import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Popup } from 'types/misc';

type PopupProps = {
    popup: Popup;
    data: unknown;
}

const initialState: PopupProps = { popup: Popup.None, data: null }

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Payload = PayloadAction<PartialBy<PopupProps, 'data'>>

export const PopupsSlice = createSlice( {
    name: 'popups',
    initialState: initialState,
    reducers: {
        changePopup: ( state, action: Payload ) => {
            return { ...action.payload, data: action.payload.data ?? state.data }
        },
        changeData: ( state, action: PayloadAction<unknown> ) => {
            return { ...state, data: action.payload }
        }
    },
} )



export const { changeData, changePopup } = PopupsSlice.actions
export default PopupsSlice.reducer