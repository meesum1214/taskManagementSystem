import { useEffect, useState } from "react"
import { getWorkerBoards } from "../../firebase/FirebaseFunctions"

export default ({ worker }) => {
    const [workerBoards, setWorkerBoards] = useState([])

    useEffect(() => {
        getWorkerBoards(worker.id, setWorkerBoards)
    }, [])
    

    return (
        <div className="flex items-center w-full p-3 border-b border-gray-400">
            <div className="text-gray-300 font-bold px-3 w-52">{worker.name}</div>
            <div className="text-gray-300 font-bold px-3">{
                workerBoards ?
                    workerBoards.map((board, i) => (
                        <div key={i} className="inline-block mr-2">{board.boardName},</div>
                    ))
                    :
                    <div className="inline-block mr-2">No board assigned!</div>
            }</div>
        </div>
    )
}