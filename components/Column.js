
import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";
import { AiFillEdit } from "react-icons/ai";
import EditColumn from "./EditColumn";
import EditTask from "./EditTask";

const Column = ({ column, tasks, columnId, allTasks, setLoading, taskIds }) => {

    const [columnEdit, setColumnEdit] = useState(false)
    const [taskID, setTaskID] = useState(null)

    const [columnState, setColumnState] = useState(false)
    const [taskState, setTaskState] = useState(false)

    const [percent, setPercent] = useState(0)

    return (
        <div className="rounded-sm bg-[#16181D] flex flex-col mr-6 w-64 ">
            {
                !columnState ?
                    <div
                        onMouseOver={() => {
                            setColumnEdit(true)
                        }}
                        onMouseLeave={() => {
                            setColumnEdit(false)
                        }}
                        className="flex justify-between items-center w-full px-6 h-[60px] bg-[#242731] rounded-sm rounded-b-none"
                    >
                        <div className="text-[17px] font-bold text-subtle-text">
                            {column.title}
                        </div>

                        <AiFillEdit size={18} onClick={() => setColumnState(true)} className={`cursor-pointer transition-all ${columnEdit ? "block" : "hidden"}`} />
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
                                            >
                                                <div className="w-full flex justify-between">
                                                    <div className="w-[95%]">{task.content}</div>
                                                    <AiFillEdit
                                                        size={18}
                                                        className={`cursor-pointer transition-all`}
                                                        onClick={() => {
                                                            setTaskID(task.id)
                                                            task.id == taskID && setTaskState(true)
                                                        }}
                                                    />
                                                </div>
                                                <img
                                                    src={task.img}
                                                    alt={task.img}
                                                    className="w-[100%] rounded-sm mt-2"
                                                />
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
