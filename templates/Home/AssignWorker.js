import { Select } from "@mantine/core"
import { ref, set } from "firebase/database"
import { useEffect, useState } from "react"
import { getAssignedBoards, getWorkers } from "../../firebase/FirebaseFunctions"
import { database } from "../../firebase/initFirebase"

export default ({ boards }) => {

    const [workers, setWorkers] = useState([])
    const [assignedBoards, setAssignedBoards] = useState([])

    const [selectedWorker, setSelectedWorker] = useState(null)
    const [selectedTaskName, setSelectedTaskName] = useState(null)

    useEffect(() => {
        getWorkers(setWorkers)
    }, [])

    const taskAssign = () => {
        if (!selectedWorker || !selectedTaskName) {
            alert('Please select worker and task name')
            return
        }

        // getAssignedBoards(selectedWorker, setAssignedBoards)

        if (assignedBoards) {
            if (!assignedBoards.map((item) => item.boardName).includes(selectedTaskName)) {
                set(ref(database, `accessUser/${selectedWorker}/`), [
                    ...assignedBoards,
                    { boardName: selectedTaskName }
                ]).then(() => {
                    // setSelectedWorker(null)
                    setSelectedTaskName(null)
                    // console.log('Board deleted from accessUser');
                    // console.log('assignedBoards: ', assignedBoards);
                }).catch((error) => {
                    setSelectedWorker(null)
                    setSelectedTaskName(null)
                    console.log(error);
                    alert(error)
                })
            } else {
                alert('Worker already assigned to this task')
            }
        } else {
            set(ref(database, `accessUser/${selectedWorker}/`), [
                { boardName: selectedTaskName }
            ]).then(() => {
                // setSelectedWorker(null)
                setSelectedTaskName(null)
                // console.log('Board deleted from accessUser');
                // console.log('assignedBoards: ', assignedBoards);
            }).catch((error) => {
                setSelectedWorker(null)
                setSelectedTaskName(null)
                console.log(error);
                alert(error)
            })
        }

    }


    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-3xl text-center text-gray-200 font-bold mb-4 mt-8">Assign Task to Worker</div>

            <div className="max-w-2/3 flex flex-col items-center">
                <div className="flex justify-center items-center mb-3">
                    <Select
                        placeholder="Select Worker"
                        data={
                            workers ?
                                workers.map((worker) => {
                                    return { label: worker.name, value: worker.id }
                                })
                                :
                                [{ label: 'No Workers', value: 'No Workers' }]
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
                        className="mr-2"
                        value={selectedWorker}
                        onChange={setSelectedWorker}
                    />

                    <Select
                        placeholder="Select Board"
                        data={
                            boards ?
                                boards.map((board) => {
                                    return { label: board.boardName, value: board.boardName }
                                })
                                :
                                [{ label: 'No Boards', value: 'No Boards' }]
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
                        className="mr-2"
                        value={selectedTaskName}
                        onChange={(e) => {
                            setSelectedTaskName(e)
                            getAssignedBoards(selectedWorker, setAssignedBoards)
                        }}
                    />
                </div>

                <button
                    className="text-white text-lg px-4 py-1 rounded-sm bg-[#238636] hover:bg-[#2daa46] active:bg-[#238636]"
                    onClick={taskAssign}
                >Done</button>
            </div>
        </div>
    )
}