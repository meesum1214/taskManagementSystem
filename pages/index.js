import { TextInput } from "@mantine/core"
import Link from "next/link"
import { useEffect, useState } from "react"
import { database } from "../firebase/initFirebase";
import { ref, set } from "firebase/database";
import { getBoards } from "../firebase/FirebaseFunctions"

export default () => {

  const [boardTitle, setBoardTitle] = useState('')

  const [boards, setBoards] = useState([])

  useEffect(() => {

    getBoards({ setBoards })

    // set(ref(database, 'project task board4/'),
    //   {
    //     tasks: {
    //       1: { id: 1, content: "Configure Next.js application", img: "/img1.jpg" },
    //       2: { id: 2, content: "Configure Next.js and tailwind ", img: "/img2.jpg" },
    //       3: { id: 3, content: "Create sidebar navigation menu", img: "/img3.jpg" },
    //       4: { id: 4, content: "Create page footer", img: "/img4.jpg" },
    //       5: { id: 5, content: "Create page navigation menu", img: "/img5.jpg" },
    //       6: { id: 6, content: "Create page layout", img: "/img6.jpg" },
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
    //         taskIds: ["no tasks"],
    //       },
    //       "column-3": {
    //         id: "column-3",
    //         title: "COMPLETED",
    //         taskIds: ["no tasks"],
    //       },
    //     },
    //     // Facilitate reordering of the columns
    //     columnOrder: ["column-1", "column-2", "column-3"],
    //   }
    // )


    // set(ref(database, 'accessUser/dsafjsdfsdfsdfh/'), [
    //   { boardName: 'project task board4' },
    // ])

    // set(ref(database, 'project task board5/'), {
    //   tasks: {
    //     1: { id: 1, content: "Configure Next.js application", img: "/img1.jpg" },
    //   },
    //   columns: {
    //     "column-1": {
    //       id: "column-1",
    //       title: "TO-DO",
    //       taskIds: [1],
    //     },
    //   },
    //   columnOrder: ["column-1"],
    // });
  }, [])

  const onPressEnter = () => {
    set(ref(database, `${boardTitle}/`), {
      tasks: {
        1: { id: 1, content: "Sample Task", img: "/img1.jpg" },
      },
      columns: {
        "column-1": {
          id: "column-1",
          title: "TO-DO",
          taskIds: [1],
        },
      },
      columnOrder: ["column-1"],
    });

    if(boards){
      set(ref(database, 'accessUser/dsafjsdfsdfsdfh/'), [
        ...boards, { boardName: boardTitle }
      ])
    }
    else{
      set(ref(database, 'accessUser/dsafjsdfsdfsdfh/'), [
         { boardName: boardTitle }
      ])
    }

    setBoardTitle('')
  }

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
            if (e.key === 'Enter' && boardTitle !== '') { onPressEnter() }
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