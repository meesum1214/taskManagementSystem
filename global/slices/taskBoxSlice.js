import { createSlice } from '@reduxjs/toolkit'

const initialState = [
    { id: 1, title: 'Tasks to be done!' },
    { id: 2, title: 'Tasks on which working!' },
    { id: 3, title: 'Tasks that are done!' },
]

export const taskBoxSlice = createSlice({
    name: 'taskBox',
    initialState,
    reducers: {
        addNewTaskBox: (state, action) => {
            state.push({ title: action.payload })
        },
    },
})

// Action creators are generated for each case reducer function
export const { addNewTaskBox } = taskBoxSlice.actions

export const selectTaskBoxId = (state, id) => state.taskBox.find((item) => item.id === id)

export default taskBoxSlice.reducer