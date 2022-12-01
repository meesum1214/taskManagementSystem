import { NumberInput, Select, TextInput } from "@mantine/core"
import Link from "next/link"
import { useEffect, useState } from "react"
import { addNewBoard, deleteBoard, getAllUsers, getBoards, getCustomerBoards, getCustomers, getWorkerBoards, getWorkers } from "../firebase/FirebaseFunctions"
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { AiFillDelete } from "react-icons/ai";
import AssignWorker from "../templates/Home/AssignWorker";
import WorkerBoards from "../templates/Home/WorkerBoards";
import { BsCurrencyDollar } from "react-icons/bs";
import { ref, set } from "firebase/database";
import { database } from "../firebase/initFirebase";


export default () => {
  const [workers, setWorkers] = useState([])
  const [customers, setCustomers] = useState([])
  const [customerBoards, setCustomerBoards] = useState([])

  const [boardTitle, setBoardTitle] = useState('')
  const [boardPrice, setBoardPrice] = useState(null)
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [boards, setBoards] = useState([])
  const [Loading, setLoading] = useState(true);

  const [boardState, setBoardState] = useState(false)
  const [boardName, setBoardName] = useState(null)

  const router = useRouter()

  useEffect(() => {
    // set(ref(database, '/'), null)

    getAllUsers(localStorage.getItem('peretz-user-id'), router)

    if (!localStorage.getItem('peretz-auth-token')) {
      router.push('/login')
    }
    getBoards({ setBoards, setLoading })
    getWorkers(setWorkers)
    getCustomers(setCustomers)
  }, [])

  const onPressEnter = () => {

    if (boardTitle && boardPrice && selectedCustomer) {
      let temp = boards?.map((item, i) => {
        return item.boardName
      }).includes(boardTitle)

      temp ? alert('Board already exists') : addNewBoard(boardTitle, setBoardTitle, boards, boardPrice, setBoardPrice, selectedCustomer, setSelectedCustomer, customerBoards)
    } else {
      alert('Please fill all fields')
    }
  }

  return (
    <div>
      {/* Loading Wheel */}
      <div className={`double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`} style={{ display: !Loading && "none" }}></div>

      <NavBar />
      <div className="flex flex-col items-center pt-8">

        <div className="w-[90%] mt-10 mb-4">
          <div className="text-5xl text-gray-200 font-bold mb-4">Create your board</div>

          <div className="flex">
            <TextInput
              placeholder="Your Board Title..."
              className="w-44 mr-2"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { onPressEnter() }
              }}
            />

            <Select
              placeholder="Select Customer..."
              data={
                customers ?
                  customers.map((customer) => {
                    return { label: customer.name, value: customer.id }
                  })
                  :
                  [{ label: 'No Customers', value: 'No Customers' }]
              }
              searchable
              clearable
              nothingFound="No options"
              styles={(theme) => ({
                item: {
                  // applies styles to selected item
                  '&[data-selected]': {
                    '&, &:hover': {
                      backgroundColor: 'gray',
                      color: "white",
                    },
                  },

                  // applies styles to hovered item (with mouse or keyboard)
                  '&[data-hovered]': {},
                },
              })}
              className="w-44 mr-2"
              value={selectedCustomer}
              onChange={(e) => {
                setSelectedCustomer(e)
                getCustomerBoards(e, setCustomerBoards)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { onPressEnter() }
              }}
            />

            <NumberInput
              placeholder="Total Amount..."
              className="w-40 mr-2"
              icon={<BsCurrencyDollar />}
              value={boardPrice}
              onChange={setBoardPrice}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { onPressEnter() }
              }}
            />

            <button
              className="text-white text-lg px-4 py-1 rounded-sm bg-[#238636] hover:bg-[#2daa46] active:bg-[#238636]"
              onClick={onPressEnter}
            >Add</button>
          </div>
        </div>

        <div className="w-[90%] flex flex-wrap">
          {
            boards ?
              boards.map((board, i) => (
                <div
                  key={i}
                  className="relative cursor-pointer w-52 h-32 m-2 bg-[#161B22] shadow-md font-semibold text-white rounded-md border border-gray-400"
                  onMouseOver={() => {
                    setBoardState(true)
                    setBoardName(board.boardName)
                    getCustomerBoards(board.customerId, setCustomerBoards)
                  }}
                  onMouseLeave={() => {
                    setBoardState(false)
                  }}
                >
                  <Link href={`/${board.boardName}`}>
                    <div className="absolute z-0 w-full h-full flex flex-col justify-center px-3">
                      <div className="text-sm">Board Name: {board.boardName}</div>
                      <div className="text-sm my-2">Customer: {board.customer}</div>
                      <div className="text-sm">Project Amount: <span className="text-green-500">${board.boardPrice}</span> </div>
                    </div>
                  </Link>

                  <AiFillDelete
                    size={16}
                    className={`${boardState && board.boardName === boardName ? 'block' : 'hidden'} cursor-pointer transition-all text-white absolute top-2 right-2 z-10`}
                    onClick={() => {
                      let newBoards = boards.filter((board) => board.boardName !== boardName)
                      let newCustomerBoards = customerBoards?.filter((board) => board.boardName !== boardName)
                      deleteBoard(boardName, newBoards, board.customerId, newCustomerBoards)
                    }}
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

        <div className="w-[90%] mb-8 border border-gray-400">
          <div className="flex items-center w-full p-3 border border-gray-400 text-lg bg-[#238636]">
            <div className="text-gray-300 font-bold px-3 w-52">Worker Name</div>
            <div className="text-gray-300 font-bold px-3">Alloted Boards</div>
          </div>
          {
            workers ?
              workers.map((worker, i) => (
                <WorkerBoards key={i} worker={worker} />
              ))
              :
              <div className="text-lg text-gray-300 font-bold mt-6">No Workers...</div>
          }
        </div>

      </div>
    </div>
  )
}