import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import AddTask from "./AddTask";

const Column = ({ column, tasks, columnId, allTasks }) => {
    return (
        <div className="rounded-sm bg-[#16181D] flex flex-col mr-6 w-64 ">
            <div className="flex justify-between items-center w-full px-[4rem] h-[60px] bg-[#242731] rounded-sm rounded-b-none">
                <div className="text-[17px] font-bold text-subtle-text">
                    {column.title}
                </div>
            </div>

            <Droppable droppableId={column.id}>
                {(droppableProvided, droppableSnapshot) => (
                    <div
                        className="px-[1.5rem] flex-1 flex-col pt-6"
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                    >
                        {
                            tasks?.map((task, index) => (
                                <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                    {(draggableProvided, draggableSnapshot) => (
                                        <div
                                            className="mb-[1rem] bg-[#242731] rounded-[3px] p-[1.5rem]"
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            <div>{task.content}</div>
                                            <img
                                                src={task.img}
                                                alt={task.img}
                                                className="w-[100%] rounded-sm mt-2"
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        {droppableProvided.placeholder}
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
