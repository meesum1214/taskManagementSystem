import dynamic from "next/dynamic";
import { useState } from "react";
import { resetServerContext } from "react-beautiful-dnd";

const DragDropContext = dynamic(
    () =>
        import('react-beautiful-dnd').then(mod => {
            return mod.DragDropContext;
        }),
    { ssr: false },
);
const Droppable = dynamic(
    () =>
        import('react-beautiful-dnd').then(mod => {
            return mod.Droppable;
        }),
    { ssr: false },
);
const Draggable = dynamic(
    () =>
        import('react-beautiful-dnd').then(mod => {
            return mod.Draggable;
        }),
    { ssr: false },
);


let initialData = {
    columns: [
        {
            id: 1,
            title: "TO-DO",
            taskIds: [
                { id: 1, content: "Configure Next.js application" },
                { id: 2, content: "Configure Next.js and tailwind " },
                { id: 3, content: "Create sidebar navigation menu" },
            ],
        },
        {
            id: 2,
            title: "IN-PROGRESS",
            taskIds: [
                { id: 4, content: "Create page footer" },
                { id: 5, content: "Create page navigation menu" },
            ],
        },
        {
            id: 3,
            title: "COMPLETED",
            taskIds: [
                { id: 6, content: "Create page layout" },
            ],
        },
    ],
};

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
    const newTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = newTaskIds.splice(startIndex, 1);
    newTaskIds.splice(endIndex, 0, removed);

    const newColumn = {
        ...sourceCol,
        taskIds: newTaskIds,
    };

    return newColumn;
};


export default () => {

    const [state, setState] = useState(initialData);

    const onDragEnd = (result) => {
        const { destination, source } = result;

        // If user tries to drop in an unknown destination
        if (!destination) return;

        // if the user drags and drops back in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // If the user drops within the same column but in a different positoin
        const sourceCol = state.columns[source.droppableId];
        const destinationCol = state.columns[destination.droppableId];

        if (sourceCol.id === destinationCol.id) {
            const newColumn = reorderColumnList(
                sourceCol,
                source.index,
                destination.index
            );

            const newState = {
                ...state,
                columns: {
                    ...state.columns,
                    [newColumn.id]: newColumn,
                },
            };
            setState(newState);
            return;
        }

        // If the user moves from one column to another
        const startTaskIds = Array.from(sourceCol.taskIds);
        const [removed] = startTaskIds.splice(source.index, 1);
        const newStartCol = {
            ...sourceCol,
            taskIds: startTaskIds,
        };

        const endTaskIds = Array.from(destinationCol.taskIds);
        endTaskIds.splice(destination.index, 0, removed);
        const newEndCol = {
            ...destinationCol,
            taskIds: endTaskIds,
        };

        const newState = {
            ...state,
            columns: {
                ...state.columns,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            },
        };

        setState(newState);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {/* <button className="px-8 py-4 bg-orange-600 rounded-md"
                onClick={() => {
                    console.log(initialData.);
                }}
            >Check</button> */}
            <div className="p-8 flex flex-wrap justify-center w-full">
                {   // All Lists
                    state.columns.map((column, index) => (

                        <Droppable droppableId={`${column.id}`} key={column.id}>
                            {(provided, snapshot) => (
                                <div
                                    key={index}
                                    className="bg-[#161B22] text-white rounded-md p-4 w-[250px] m-4 flex flex-col items-center cursor-pointer"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <div className="mb-2 text-lg font-bold">{column.title}</div>
                                    {   // All Tasks
                                        column.taskIds.map((task, index) => (
                                            <Draggable key={task.id} draggableId={`${task.id}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        key={index}
                                                        className="w-full bg-gray-600 mb-3 rounded-md text-white p-4 flex justify-center cursor-pointer"
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >{task.content}</div>
                                                )}
                                            </Draggable>
                                        ))
                                    }
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                    ))
                }
            </div>
        </DragDropContext>
    )
}


// let initialData = {
//     columns: [
//         {
//             id: 1,
//             title: "TO-DO",
//             taskIds: [
//                 { id: 1, content: "Configure Next.js application" },
//                 { id: 2, content: "Configure Next.js and tailwind " },
//                 { id: 3, content: "Create sidebar navigation menu" },
//             ],
//         },
//         {
//             id: 2,
//             title: "IN-PROGRESS",
//             taskIds: [
//                 { id: 4, content: "Create page footer" },
//                 { id: 5, content: "Create page navigation menu" },
//             ],
//         },
//         {
//             id: 3,
//             title: "COMPLETED",
//             taskIds: [
//                 { id: 6, content: "Create page layout" },
//             ],
//         },
//     ],
// };

export const getServerSideProps = async ({ query }) => {

    resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

    return { props: { data: [] } }

}