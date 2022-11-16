import { TextInput } from "@mantine/core"
import Link from "next/link"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { addNewBoard } from "../global/slices/boardSlice"


export default () => {

  const currentBoard = useSelector(state => state.board)
  const [boardTitle, setBoardTitle] = useState('')

  const dispatch = useDispatch()

  return (
    <div className="flex flex-col items-center pt-8">

      <div className="w-[90%] mt-10 mb-4">
        <div className="text-5xl text-gray-200 font-bold mb-4">Create your board</div>

        <TextInput
          placeholder="Your Board Title..."
          className="w-96"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && boardTitle !== '') {
              dispatch(addNewBoard(boardTitle))
              setBoardTitle('')
            }
          }}
        />
      </div>


      <div className="w-[90%] grid grid-cols-5 gap-4">
        {
          currentBoard.map((board, i) => (
            <Link key={i} href={`/${board.title}`}>
              <div
                className="cursor-pointer h-60 bg-[#FFFF00] shadow-md flex justify-center items-center font-semibold text-red-500">{board.title}
              </div>
            </Link>
          ))
        }
      </div>


    </div>
  )
}