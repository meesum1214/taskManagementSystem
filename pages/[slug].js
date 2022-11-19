import { ref, set } from "firebase/database";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import AddColumn from "../components/AddColumn";
import { getBoardsData } from "../firebase/FirebaseFunctions";
import { database } from "../firebase/initFirebase";

const Column = dynamic(() => import("../components/Column"), { ssr: false });

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
    const router = useRouter();

    const [boardsData, setBoardsData] = useState({})

    useEffect(() => {
        if (router.query.slug) {
            getBoardsData(router.query.slug, setBoardsData)
        }
    }, [router.query.slug])

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
        const sourceCol = boardsData.columns[source.droppableId];
        const destinationCol = boardsData.columns[destination.droppableId];

        if (sourceCol.id === destinationCol.id) {
            const newColumn = reorderColumnList(
                sourceCol,
                source.index,
                destination.index
            );

            const newState = {
                ...boardsData,
                columns: {
                    ...boardsData.columns,
                    [newColumn.id]: newColumn,
                },
            };

            set(ref(database, `${router.query.slug}/`), newState);
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
            ...boardsData,
            columns: {
                ...boardsData.columns,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol,
            },
        };

        set(ref(database, `${router.query.slug}/`), newState);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col bg-[#0E1012] min-h-screen w-full text-white pb-[2rem]">
                <div className="p-[4rem] flex justify-between">
                    <div className="text-3xl font-bold">
                        Task Management System
                    </div>
                    <button className="text-white text-lg px-4 py-2 rounded-sm bg-[#238636]"><Link href="/">Go Back</Link></button>
                </div>

                <div className="flex px-[4rem]">
                    {
                        boardsData ?
                            boardsData.columnOrder?.map((columnId) => {
                                const column = boardsData.columns[columnId];
                                const tasks = column?.taskIds?.map((taskId) => boardsData.tasks[taskId]);

                                return <Column key={column.id} column={column} tasks={tasks} />;
                            })
                            :
                            <AddColumn boardsData={boardsData} />
                    }
                    <AddColumn boardsData={boardsData} />
                </div>
            </div>
        </DragDropContext>
    );
}