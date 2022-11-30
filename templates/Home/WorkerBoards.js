import { ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { AiFillDelete } from "react-icons/ai"
import { getWorkerBoards } from "../../firebase/FirebaseFunctions"
import { database } from "../../firebase/initFirebase"

export default ({ worker }) => {
    const [workerBoards, setWorkerBoards] = useState([])

    useEffect(() => {
        getWorkerBoards(worker.id, setWorkerBoards)
    }, [])

    return (
        <div className="flex items-center w-full p-3 border-b border-gray-400">
            <div className="text-gray-300 font-bold px-3 w-52">{worker.name}</div>
            <div className="text-gray-300 font-bold px-3 flex">
                {
                    workerBoards ?
                        workerBoards.map((board, i) => (
                            <div key={i} className="mr-2 flex">
                                <div>{board.boardName}</div>
                                <AiFillDelete
                                    size={10}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        let temp = workerBoards.filter((item) => item.boardName !== board.boardName)
                                        // console.log(temp)
                                        set(ref(database, `accessUser/${worker.id}/`), temp)
                                    }}
                                />
                                ,
                            </div>
                        ))
                        :
                        <div className="inline-block mr-2">No board assigned!</div>
                }
            </div>
        </div>
    )
}