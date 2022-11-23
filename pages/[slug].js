import { ScrollArea } from "@mantine/core";
import { ref, set } from "firebase/database";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import AddColumn from "../components/AddColumn";
import NavBar from "../components/NavBar";
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
    const [Loading, setLoading] = useState(true);
    const [boardsData, setBoardsData] = useState({})

    useEffect(() => {
        if (!localStorage.getItem('peretz-auth-token')) {
            router.push('/login')
        }

        if (router.query.slug) {
            getBoardsData(router.query.slug, setBoardsData)
            setTimeout(() => {
                setLoading(false)
            }, 700);
        }
    }, [router.query.slug])

    const onDragEnd = (result) => {
        const { destination, source } = result;
        // if(source.drop)

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







        // If the user moves from one column to another column
        const startTaskIds = Array.from(sourceCol.taskIds);
        const [removed] = startTaskIds.splice(source.index, 1);
        // console.log("removed =======================>", removed);
        // console.log("startTaskIds =======================>", startTaskIds);

        var test = startTaskIds
        if (test.length === 0) { test = ["no tasks"] }



        const newStartCol = {
            ...sourceCol,
            taskIds: test,
        };



        // if (destinationCol.taskIds[0] === "no tasks") {
        //     const endTaskIds = [];
        //     endTaskIds.splice(destination.index, 0, removed);
        //     const newEndCol = {
        //         ...destinationCol,
        //         taskIds: endTaskIds,
        //     };

        //     const newState = {
        //         ...boardsData,
        //         columns: {
        //             ...boardsData.columns,
        //             [newStartCol.id]: newStartCol,
        //             [newEndCol.id]: newEndCol,
        //         },
        //     };
        //     set(ref(database, `${router.query.slug}/`), newState);
        // }
        // else {
        // if(destinationCol.taskIds.includes("no tasks")) {

        //     // destinationCol.taskIds.splice(destinationCol.taskIds.indexOf("no tasks"), 1)
        // }
        let endTaskIds = Array.from(destinationCol.taskIds);

        // if (endTaskIds[0] === "no tasks") {
        //     endTaskIds = [];
        // }


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
        // }
    };

    return (
        <div>
            {/* Loading Wheel */}
            <div className={`double-up fixed w-screen h-screen z-50 ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`} style={{ display: !Loading && "none" }}></div>

            <NavBar />

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex justify-center bg-[#0E1012] min-h-screen w-full text-white pt-10">
                    <div className="max-w-[1100px] w-full">
                        <div className="w-full flex justify-between items-center pb-6">
                            <div className="text-3xl font-bold">
                                {router.query.slug}
                            </div>
                            <Link href="/"><button className="text-white text-lg px-4 py-1 rounded-sm bg-[#238636] hover:bg-[#2daa46] active:bg-[#238636] ">Go Back</button></Link>
                        </div>


                        <ScrollArea className="w-full pb-6">
                            <div className="w-full flex">
                                {
                                    boardsData ?
                                        boardsData.columnOrder?.map((columnId) => {
                                            const column = boardsData.columns[columnId];
                                            // const tasks = column.taskIds.includes("no tasks") ? null : column?.taskIds?.map((taskId) => boardsData.tasks[taskId]);

                                            if (!column.taskIds) {
                                                set(ref(database, `${router.query.slug}/columns/${columnId}/taskIds`), ["no tasks"])
                                            }

                                            const taskIds = column?.taskIds;

                                            const tasks = column?.taskIds?.map((taskId) => boardsData.tasks[taskId]);
                                            return <Column key={column.id} column={column} tasks={tasks} columnId={columnId} allTasks={boardsData.tasks} setLoading={setLoading} taskIds={taskIds} />;
                                        })
                                        :
                                        <AddColumn boardsData={boardsData} />
                                }
                                <AddColumn boardsData={boardsData} />
                            </div>
                        </ScrollArea>
                    </div>
                </div >
            </DragDropContext >
        </div>
    );
}