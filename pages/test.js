import { resetServerContext } from "react-beautiful-dnd";
import dynamic from 'next/dynamic';
import { useState } from "react";
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

export default () => {

    const [state, setState] = useState([
        { text: '1. Create a new page in the pages folder.' },
        { text: '2. Create a new component in the components folder.' },
        { text: '3. Create a new slice in the slices folder.' },
        { text: '4. Create a new store in the store folder.' },
        { text: '5. Create a new reducer in the reducer folder.' },
        { text: '6. Create a new action in the action folder.' },
    ])

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = Array.from(state);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setState(items);
    }
    
    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                    {
                        (provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="m-4 bg-gray-500 p-3 rounded-md"
                            >
                                {
                                    state.map(({text}, index) => (
                                        <Draggable key={text} draggableId={text} index={index}>
                                            {
                                                (provided) => (
                                                    <li
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        className="bg-white rounded-md px-4 py-6 my-4 text-lg"
                                                    >
                                                        {text}
                                                    </li>
                                                )
                                            }
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </ul>
                        )
                    }

                </Droppable>
            </DragDropContext>
        </div>
    )
}

export const getServerSideProps = async ({ query }) => {

    resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

    return { props: { data: [] } }

}