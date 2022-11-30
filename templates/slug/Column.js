
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import EditColumn from "./EditColumn";
import EditTask from "./EditTask";
import { ref, remove, set } from "firebase/database";
import { database } from "../../firebase/initFirebase";
import { deleteColumn } from "../../firebase/FirebaseFunctions";

const Column = ({ column, tasks, columnId, allTasks, setLoading, taskIds, slug, columnOrder }) => {



    const [columnEdit, setColumnEdit] = useState(false)
    const [taskID, setTaskID] = useState(null)

    const [columnState, setColumnState] = useState(false)
    const [taskState, setTaskState] = useState(false)

    const [taskDelete, setTaskDelete] = useState(false)
    const [taskIdHover, setTaskIdHover] = useState(null)
    const [columnIdHover, setColumnIdHover] = useState(null)

    const [taskIDs, setTaskIDs] = useState(null)

    const [percent, setPercent] = useState(0)




    const handleTaskDelete = (id) => {

        if (allTasks.length === 2 || Object.keys(allTasks).length === 1) {
            alert('You can not delete the last task but you cange it!')
        } else {
            set(ref(database, slug + `/columns/${columnId}/taskIds`), taskIds.filter((task) => task !== id))
                .then(() => {
                    remove(ref(database, slug + '/tasks/' + id))
                        .then(() => {
                            console.log('Task deleted');
                        })
                        .catch((error) => {
                            console.log(error);
                            alert(error)
                        })
                })
        }
    }

    const handleOnColumnDelete = (id) => {
        if (column.taskIds.length !== 0) {
            alert('Please delete all tasks in this column before deleting it')
        } else {

            let tempColumnOrder = columnOrder.filter((column) => column !== id)
            // console.log('tempColumnOrder: ', tempColumnOrder)

            deleteColumn(slug, id, tempColumnOrder)
        }
    }

    return (
        <div className="rounded-sm bg-[#16181D] flex flex-col mr-6 w-64 ">
            {
                !columnState ?
                    <div
                        onMouseOver={() => {
                            setColumnEdit(true)
                            setColumnIdHover(columnId)
                        }}
                        onMouseLeave={() => {
                            setColumnEdit(false)
                        }}
                        className="flex justify-between items-center w-full px-6 h-[60px] bg-[#242731] rounded-sm rounded-b-none"
                    >
                        <div className="text-[17px] font-bold text-subtle-text">
                            {column.title}
                        </div>

                        <div className="flex items-center">
                            <AiFillDelete
                                size={18}
                                className={`${columnEdit ? "block" : "hidden"} cursor-pointer transition-all text-white mr-1`}
                                onClick={() => handleOnColumnDelete(columnIdHover)}
                            />

                            <AiFillEdit size={18} onClick={() => setColumnState(true)} className={`cursor-pointer transition-all ${columnEdit ? "block" : "hidden"}`} />
                        </div>
                    </div>
                    :
                    <EditColumn setColumnState={setColumnState} columnId={columnId} setLoading={setLoading} taskIds={taskIds} />
            }

            <Droppable droppableId={column.id}>
                {(droppableProvided, droppableSnapshot) => (
                    <div
                        className="px-[1.5rem] flex-1 flex-col pt-6"
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                    >
                        {
                            tasks?.map((task, index) => (
                                <div key={task.id}>
                                    <Draggable draggableId={`${task.id}`} index={index}>
                                        {(draggableProvided, draggableSnapshot) => (
                                            <div
                                                className={`mb-[1rem] bg-[#242731] rounded-[3px] p-[1.5rem] ${taskState && task.id == taskID ? "hidden" : "block"}`}
                                                ref={draggableProvided.innerRef}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                onMouseOver={() => {
                                                    setTaskDelete(true)
                                                    setTaskIdHover(task.id)
                                                }}
                                                onMouseLeave={() => {
                                                    setTaskDelete(false)
                                                    setTaskIdHover(null)
                                                }}
                                            >
                                                <div className={`w-full flex ${task.content === "No Title" ? 'justify-end' : 'justify-between'}`}>
                                                    {
                                                        task.content !== "No Title" && <div className="w-[95%]">{task.content}</div>
                                                    }
                                                    <div className="flex">
                                                        <AiFillDelete
                                                            size={16}
                                                            className={`${taskDelete && task.id == taskIdHover ? "block" : "hidden"} cursor-pointer transition-all text-white mr-1`}
                                                            onClick={() => handleTaskDelete(task.id, task.content, task.img)}
                                                        />
                                                        <AiFillEdit
                                                            size={16}
                                                            className={`cursor-pointer transition-all`}
                                                            onClick={() => {
                                                                setTaskID(task.id)
                                                                task.id == taskID && setTaskState(true)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                {
                                                    task.img !== "No Image" && <img
                                                        src={task.img}
                                                        alt={task.img}
                                                        className="w-[100%] rounded-sm mt-2"
                                                    />
                                                }
                                                <div className="mt-2">Price: <span className="text-green-500">${task.price}</span></div>
                                            </div>
                                        )}
                                    </Draggable>
                                    <div className={`${taskState && task.id == taskID ? "block" : "hidden"} mb-[1rem]`}>
                                        <EditTask setLoading={setLoading} setTaskState={setTaskState} mapTaskId={task.id} taskID={taskID} setPercent={setPercent} />
                                    </div>
                                </div>
                            ))
                        }
                        {droppableProvided.placeholder}

                        {percent > 0 && <div className="text-white text-sm text-center font-semibold mb-4">Uploading Image : {percent} %</div>}
                        {percent === 100 && setPercent(0)}

                        <div className="mb-4">
                            <AddTask column={column} columnId={columnId} allTasks={allTasks} />
                        </div>
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;
