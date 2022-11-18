import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

const Column = ({ column, tasks }) => {
    return (
        <div
            className="rounded-[3px] bg-[#1E2631] w-[400px] h-[620px] flex flex-col"
        >
            <div
                className="flex justify-between items-center px-[1.5rem] mb-[1.5rem]"
            >
                <div
                    className="text-gray-400 font-semibold text-lg"
                >
                    {column.title}
                </div>
            </div>

            <Droppable droppableId={column.id}>
                {(droppableProvided, droppableSnapshot) => (
                    <div
                        className="flex flex-col flex-1 px-[1.5rem]"
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                {(draggableProvided, draggableSnapshot) => (
                                    <div
                                        className="mb-[1rem] h-[72px] bg-[#2A3440] rounded-[3px] p-[1.5rem] outline-[2px] outline-solid outline-transparent"
                                        ref={draggableProvided.innerRef}
                                        {...draggableProvided.draggableProps}
                                        {...draggableProvided.dragHandleProps}
                                    >
                                        <div>{task.content}</div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {droppableProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default Column;