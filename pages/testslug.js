import { SimpleGrid, TextInput } from "@mantine/core";
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { VscChromeClose } from "react-icons/vsc";
import { useSelector, useDispatch, Provider } from 'react-redux'
// import { addNewListCard, removeListCard, updateListCard } from "../global/slices/listSlice";
import { removeTaskBox, selectTaskBoxId } from "../global/slices/taskBoxSlice";
import { resetServerContext } from "react-beautiful-dnd";
import dynamic from 'next/dynamic';
import { getBoardsData } from "../firebase/FirebaseFunctions";
// import { database } from "../firebase/initFirebase";

import { database, storage } from "../firebase/initFirebase";
import { ref, onValue, set } from "firebase/database";



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
    const router = useRouter()

    const [newCard, setNewCard] = useState(false)

    const [boardsData, setBoardsData] = useState({})

    const [uploadImg, setUploadImg] = useState([])
    const [uploadMsg, setUploadMsg] = useState('')

    // const dispatch = useDispatch()

    // const taskBox = useSelector((state) => state.taskBox)
    // const cardList = useSelector(state => state.cardList)

    // console.log('>> ', taskBox[0])

    const previews = uploadImg.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <img
                alt="Uploaded image"
                key={index}
                src={imageUrl}
                imageprops={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
                width="100%"
            />
        );
    });


    // create card list array of objects
    const [cardListArray, setCardListArray] = useState([
        { id: '1', img: '/img1.jpg', msg: 'Text of card one!' },
        // { id: '2', img: '/img2.jpg', msg: 'Text of card two!' },
        // { id: '3', img: '/img3.jpg', msg: 'Text of card three!' },
    ])



    // useEffect to get data from realtime firebase database

    // const [boardData, setBoardData] = useState()

    // const [boardData, setBoardData] = useState()


    useEffect(() => {
        // const dbRef = ref(database, 'accessUser/dsafjsdfsdfsdfh/');
        // onValue(dbRef, (snapshot) => {
        //     const data = snapshot.val();
        //     // console.log('alotted boards', data)

        // getBoardsData(router.query.slug, setBoardsData)


        // });



        // set(dbRef, {
        //     accessUser: {
        //         dsafjsdfsdfsdfh: [
        //             { boardName: 'Board1' },
        //         ]
        //     },
        //     Board1: {
        //         lists: [
        //             {
        //                 cards:[
        //                     { img: '/img1.jpg', msg: 'Text of card one!' },
        //                     { img: '/img2.jpg', msg: 'Text of card two!' },
        //                 ]
        //             },
        //             {
        //                 cards:[
        //                     { img: '/img2.jpg', msg: 'Text of card two!' },
        //                 ]
        //             },
        //         ]
        //     }
        // })



    }, [])






    // Add a new data to firebase realtime database
    // set(dbRef, {
    //     ...data,

    //     card1: {
    //         image: 'hello',
    //         message: 'hello'
    //     }

    // });


    // Add Data in database
    // set(dbRef, {
    //     list: {
    //         card: {
    //             image: 'hello',
    //             message: 'hello'
    //         }
    //     }
    // });











    const handleDragEnd = (result) => {
        if (!result.destination) return;

        console.log('result: ', result)

        console.log('board Data:   >', boardsData[+result.destination.droppableId].data)

        const items = Array.from(boardsData[+result.destination.droppableId].data);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        console.log('items: ', items)

        // dispatch(updateListCard(items))
        // setCardListArray(items)
        // console.log(items)
        //  boardsData[+result.destination.droppableId] = item

        // setBoardData([...boardData, items])
        set(ref(database, `${router.query.slug}/${+result.destination.droppableId}/data/`), items)




        // If the user moves from one column to another
        // const startTaskIds = Array.from(boardsData[+result.destination.droppableId].data);
        // const [removed] = startTaskIds.splice(result.source.index, 1);
        // const newStartCol = {
        //     ...sourceCol,
        //     taskIds: startTaskIds,
        // };

        // const endTaskIds = Array.from(destinationCol.taskIds);
        // endTaskIds.splice(destination.index, 0, removed);
        // const newEndCol = {
        //     ...destinationCol,
        //     taskIds: endTaskIds,
        // };

        // const newState = {
        //     ...state,
        //     columns: {
        //         ...state.columns,
        //         [newStartCol.id]: newStartCol,
        //         [newEndCol.id]: newEndCol,
        //     },
        // };
    }


    return (
        <div className="p-2">
            <div className="text-red-700 text-lg underline"><Link href="/">Go Back</Link></div>
            {/* <div className="text-3xl font-bold">{router.query.slug}</div> */}

            <button
                onClick={() => console.log('setBoardsData>>> ', boardsData.columns)}
            >check</button>


            <div className="w-full grid grid-cols-3 gap-4">
                {
                    boardsData.columns?.map((item, i) => {
                        // const taskBoxId = useSelector((state) => selectTaskBoxId(state, item.id))

                        return (
                            <div key={i + 'list'} className="w-80 bg-[#DFE3E6] rounded-sm shadow-sm p-2">
                                <div className="w-full flex justify-between items-center pb-4">
                                    <div className="font-semibold">{item.listName}</div>
                                    <AiFillDelete className="text-gray-500 cursor-pointer" size={20}
                                    // onClick={() => console.log('task Box>> ', taskBoxId)}
                                    />
                                </div>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId={i.toString()}>
                                        {
                                            (provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    {
                                                        item.data?.map((item, i) => {
                                                            return (
                                                                <Draggable key={(i + 'card').toString()} index={i} draggableId={(i + 'card').toString()}>
                                                                    {
                                                                        (provided) => (
                                                                            <div className="mb-4 bg-white p-2"
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                            >
                                                                                <div className="flex flex-1 justify-between">
                                                                                    <div className="font-semibold text-gray-500 mb-2">{item.card.msg}</div>
                                                                                    <AiFillDelete
                                                                                        className="text-gray-500 cursor-pointer"
                                                                                        size={20}
                                                                                        onClick={() => {
                                                                                            // dispatch(removeListCard(i, 1))
                                                                                            // setCardListArray(cardListArray.filter((item, index) => index !== i))
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                <img
                                                                                    src={item.card.img}
                                                                                    width="100%"
                                                                                    className="rounded-sm"
                                                                                />
                                                                            </div>
                                                                        )
                                                                    }
                                                                </Draggable>
                                                            )
                                                        })
                                                    }
                                                    {provided.placeholder}
                                                </div>
                                            )
                                        }
                                    </Droppable>
                                </DragDropContext>

                                {
                                    !newCard ?
                                        <div className="text-gray-500 flex items-center cursor-pointer"
                                            onClick={() => setNewCard(true)}
                                        ><AiOutlinePlus size={20} className="pr-1" /> Add another card</div>
                                        :
                                        <div>
                                            <TextInput
                                                placeholder="Enter a title for this card..."
                                                className="w-full"
                                                value={uploadMsg}
                                                onChange={(e) => setUploadMsg(e.currentTarget.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && uploadMsg.length > 0 && uploadImg.length > 0) {
                                                        setCardListArray(cardListArray.concat({ id: 's', img: uploadImg[0].name, msg: uploadMsg }))
                                                        setNewCard(false)
                                                        setUploadImg([])
                                                        setUploadMsg('')
                                                    }
                                                }}
                                            />
                                            {
                                                uploadImg.length === 0 ?


                                                    <Dropzone
                                                        onDrop={setUploadImg}
                                                        accept={IMAGE_MIME_TYPE}
                                                        sx={(theme) => ({
                                                            width: '100%',
                                                            // marginTop: '6px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            fontWeight: 600,
                                                            border: '1px solid black',
                                                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],

                                                            '&[data-accept]': {
                                                                color: theme.white,
                                                                backgroundColor: theme.colors.blue[6],
                                                            },

                                                            '&[data-reject]': {
                                                                color: theme.white,
                                                                backgroundColor: theme.colors.red[6],
                                                            },
                                                        })}
                                                    >
                                                        <div>Upload Image</div>
                                                    </Dropzone>
                                                    :
                                                    <SimpleGrid
                                                        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                                        mt={previews.length > 0 ? 'xl' : 0}
                                                    >
                                                        {previews}
                                                    </SimpleGrid>
                                            }

                                            <div className="flex items-center">
                                                <button
                                                    className="bg-[#12ac1f] text-white font-semibold rounded-md px-4 py-2 mt-4"
                                                    onClick={() => {
                                                        if (uploadMsg.length > 0 && uploadImg.length > 0) {
                                                            setCardListArray(cardListArray.concat({ id: 's', img: uploadImg[0].name, msg: uploadMsg }))
                                                            setNewCard(false)
                                                            setUploadImg([])
                                                            setUploadMsg('')
                                                        }
                                                    }}
                                                >
                                                    Submit
                                                </button>
                                                <VscChromeClose
                                                    className="ml-4 mt-2 cursor-pointer"
                                                    size={22}
                                                    onClick={() => setNewCard(false)}
                                                />
                                            </div>
                                        </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}



export const getServerSideProps = async ({ query }) => {

    resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

    return { props: { data: [] } }

}