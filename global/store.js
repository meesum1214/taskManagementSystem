import { configureStore } from '@reduxjs/toolkit'
import boardSlice from './slices/boardSlice'
import listSlice from './slices/listSlice'
import taskBoxSlice from './slices/taskBoxSlice'

export const store = configureStore({
  reducer: {
    board: boardSlice,
    cardList: listSlice,
    taskBox: taskBoxSlice,
  },
})