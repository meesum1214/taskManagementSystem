import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { title: 'Board1' },
]

export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        addNewBoard: (state, action) => {
            state.push({ title: action.payload })
        },
    },
})

// Action creators are generated for each case reducer function
export const { addNewBoard } = boardSlice.actions

export default boardSlice.reducer