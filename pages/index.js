import { TextInput } from "@mantine/core"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { addNewBoard } from "../global/slices/boardSlice"
import { database, storage } from "../firebase/initFirebase";
import { ref, onValue, set } from "firebase/database";
import { getBoards } from "../firebase/FirebaseFunctions"

export default () => {

  // const currentBoard = useSelector(state => state.board)
  const [boardTitle, setBoardTitle] = useState('')

  const [boards, setBoards] = useState([])



  // const dispatch = useDispatch()

  useEffect(() => {

    getBoards({ setBoards })




















    // setBoards(getBoards())
    // console.log('boards', getBoards(set))

    // const dbRef = ref(database, 'accessUser/dsafjsdfsdfsdfh/');

    // onValue(dbRef, (snapshot) => {
    //   const data = snapshot.val();
    //   console.log('alotted boards', data)
    //   setBoards(data)

    //   data.map((item) => {
    //     const boardData = ref(database, `${item.boardName}`);
    //     onValue(boardData, (snapshot) => {
    //       const data = snapshot.val();
    //       // console.log('board data', data)
    //       setBoardData(data)
    //     })
    //   })

    // });


    // set(ref(database, 'project task board3/'),
    //   {
    //     tasks: {
    //       "1": { id: 1, content: "Configure Next.js application" },
    //       "2": { id: 2, content: "Configure Next.js and tailwind " },
    //       "3": { id: 3, content: "Create sidebar navigation menu" },
    //       "4": { id: 4, content: "Create page footer" },
    //       "5": { id: 5, content: "Create page navigation menu" },
    //       "6": { id: 6, content: "Create page layout" },
    //     },
    //     columns: {
    //       "column-1": {
    //         id: "column-1",
    //         title: "TO-DO",
    //         taskIds: [1, 2, 3, 4, 5, 6],
    //       },
    //       "column-2": {
    //         id: "column-2",
    //         title: "IN-PROGRESS",
    //         taskIds: [],
    //       },
    //       "column-3": {
    //         id: "column-3",
    //         title: "COMPLETED",
    //         taskIds: [],
    //       },
    //     },
    //     // Facilitate reordering of the columns
    //     columnOrder: ["column-1", "column-2", "column-3"],
    //   }
    // )


    // set(ref(database, 'accessUser/dsafjsdfsdfsdfh/'), [
    //   { boardName: 'project task board' },
    //   { boardName: 'project task board1' },
    // ])


  }, [])



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
              // dispatch(addNewBoard(boardTitle))

              const newDb = ref(database, `${boardTitle}/`);
              set(newDb, {
                list: "empty"
              });

              set(ref(database, 'accessUser/dsafjsdfsdfsdfh/'), [
                ...boards, { boardName: boardTitle }

              ])

              setBoardTitle('')
            }
          }}
        />
      </div>


      <div className="w-[90%] flex flex-wrap">
        {
          boards?.map((board, i) => (
            <Link key={i} href={`/${board.boardName}`}>
              <div
                className="cursor-pointer w-52 h-32 m-2 bg-[#161B22] shadow-md flex justify-center items-center font-semibold text-white rounded-md border border-gray-400">{board.boardName}
              </div>
            </Link>
          ))
        }
      </div>


    </div>
  )
}