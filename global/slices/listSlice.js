import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { id: 'message1', img: '/img1.jpg', msg: 'Text of card one!' },
    { id: 'message2', img: '/img2.jpg', msg: 'Text of card two!' },
    { id: 'message3', img: '/img3.jpg', msg: 'Text of card three!' },
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
        },
        updateListCard: (state, action) => {
            state = action.payload
            console.log('>>> ', action.payload  )
        }
    },
})

// Action creators are generated for each case reducer function
export const { addNewListCard, removeListCard, updateListCard } = listSlice.actions

export default listSlice.reducer