import { TextInput } from "@mantine/core"
import Link from "next/link"
import { useEffect, useState } from "react"
import { addNewBoard, deleteBoard, getBoards, getWorkers } from "../firebase/FirebaseFunctions"
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { AiFillDelete } from "react-icons/ai";
import AssignWorker from "../templates/Home/AssignWorker";

export default () => {
  const [workers, setWorkers] = useState([])

  const [boardTitle, setBoardTitle] = useState('')
  const [boards, setBoards] = useState([])
  const [Loading, setLoading] = useState(true);

  const [boardState, setBoardState] = useState(false)
  const [boardName, setBoardName] = useState(null)

  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem('peretz-auth-token')) {
      router.push('/login')
    }
    getBoards({ setBoards, setLoading })
    getWorkers(setWorkers)
  }, [])

  const onPressEnter = () => {
    addNewBoard(boardTitle, setBoardTitle, boards)
    // console.log(boards)
  }

  const handleDeleteBoard = () => {
    let newBoards = boards.filter((board) => board.boardName !== boardName)
    console.log('newBoards: ', newBoards)
    deleteBoard(boardName, newBoards)
  }

  return (
    <div>
      {/* Loading Wheel */}
      <div className={`double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`} style={{ display: !Loading && "none" }}></div>

      <NavBar />
      <div className="flex flex-col items-center pt-8">

        <div className="w-[90%] mt-10 mb-4">
          <div className="text-5xl text-gray-200 font-bold mb-4">Create your board</div>

          <TextInput
            placeholder="Your Board Title..."
            className="w-52"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && boardTitle !== '') { onPressEnter() }
            }}
          />
        </div>

        <div className="w-[90%] flex flex-wrap">
          {
            boards ?
              boards.map((board, i) => (
                <div
                  key={i}
                  className="relative cursor-pointer w-32 h-32 m-2 bg-[#161B22] shadow-md font-semibold text-white rounded-md border border-gray-400"
                  onMouseOver={() => {
                    setBoardState(true)
                    setBoardName(board.boardName)
                  }}
                  onMouseLeave={() => {
                    setBoardState(false)
                  }}
                >
                  <Link href={`/${board.boardName}`}>
                    <div className="absolute z-0 w-full h-full flex justify-center items-center">
                      {board.boardName}
                    </div>
                  </Link>

                  <AiFillDelete
                    size={16}
                    className={`${boardState && board.boardName === boardName ? 'block' : 'hidden'} cursor-pointer transition-all text-white absolute top-2 right-2 z-10`}
                    onClick={handleDeleteBoard}
                  />
                </div>
              ))
              :
              <div className="text-lg text-gray-300 font-bold mt-6">No Boards...</div>
          }
        </div>

        <div className="w-[90%] mb-8">
          <AssignWorker boards={boards} />
        </div>

        {/* <div className="w-[90%] mb-8 border border-gray-400">
          <div className="flex items-center w-full p-3 border border-gray-400">
            <div className="text-gray-300 font-bold p-3 w-[10%]">Worker Name</div>
            <div className="text-gray-300 font-bold p-3 w-[90%]">Alloted Boards</div>
          </div>
          {
            workers ?
              workers.map((worker, i) => (
                <div key={i} className="flex items-center w-full p-3">
                  <div className="text-gray-300 font-bold p-3 w-[10%]">{worker.name}</div>
                  <div className="text-gray-300 font-bold p-3 w-[90%]">{worker.id}</div>
                </div>
              ))
              :
              <div className="text-lg text-gray-300 font-bold mt-6">No Workers...</div>
          }
        </div> */}

      </div>
    </div>
  )
}