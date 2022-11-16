import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { id: 1, img: '/img1.jpg', msg: 'Text of card one!' },
]

export const listSlice = createSlice({
    name: 'cardList',
    initialState,
    reducers: {
        addNewListCard: (state, action) => {
            state.push(action.payload)
        },
        removeListCard: (state, action) => {
            state.splice(action.payload, 1)
        }
    },
})

// Action creators are generated for each case reducer function
export const { addNewListCard, removeListCard } = listSlice.actions

export default listSlice.reducer