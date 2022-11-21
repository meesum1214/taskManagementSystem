import { TextInput, Text, Image, SimpleGrid } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import { database, storage } from "../firebase/initFirebase";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ref, set } from "firebase/database";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import storageeRef from "../firebase/initFirebase";

export default ({ column, columnId, allTasks }) => {

    const [boardsData, setBoardsData] = useState({})

    // useEffect(() => {
    //     getBoards
    //     console.log( ': =============== ', boardsData.columns)
    //     // console.log('============= ', boardsData.columns[column].taskIds)
    // }, [])


    const router = useRouter();
    const [state, setState] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [file, setFile] = useState([]);

    const [url, setUrl] = useState(null);

    const previews = file.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });


    const handleAddCard = () => {

        if (!taskTitle && !file) {
            alert('Please add a title and image')
            return
        }

        const metadata = {
            contentType: 'image/jpeg'
        };

        const storageRef = ref_storage(storage, 'taskimages/' + file[0].name);
        const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        console.log('User doesn\'t have permission to access the object');
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        console.log('User canceled the upload');
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        console.log('Unknown error occurred, inspect error.serverResponse');
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setUrl(downloadURL)
                    return downloadURL
                }).then((url) => {
                    console.log(allTasks)
                    if (column.taskIds.length === 0) {
                        let b = allTasks[allTasks.length-1].id + 1
                        let t = {...allTasks};
                        // t.unshift(null);

                    
                        t[b] =   {
                            id: allTasks[allTasks.length-1].id + 1,
                            content: taskTitle,
                            img: url
                        }
                        set(ref(database, router.query.slug+'/tasks/'), t).then(() => {
                            set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                                ...column,
                                taskIds: [
                                    
                                    allTasks[allTasks.length-1].id + 1
                                ]
                            })
                        })
                    }

                    else{
                        let b = allTasks[allTasks.length-1].id + 1
                        let t = {...allTasks};
                        // t.unshift(null);

                    
                        t[b] =   {
                            id: allTasks[allTasks.length-1].id + 1,
                            content: taskTitle,
                            img: url
                        }
                        set(ref(database, router.query.slug+'/tasks/'), t).then(() => {
                            set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                                ...column,
                                taskIds: [
                                    ...column.taskIds,
                                    allTasks[allTasks.length-1].id + 1
                                ]
                            })
                        })
                    }
                    
                    // if (column.taskIds == "no tasks") {
                    //     set(ref(database, `${router.query.slug}/`), {
                    //         ...boardsData,
                    //         columns: {
                    //             ...boardsData.columns,
                    //             [column]: {
                    //                 ...boardsData.columns[column],
                    //                 taskIds: [taskTitle]
                    //             }
                    //         },
                    //         tasks: [
                    //             ...boardsData.tasks,
                    //             {
                    //                 id: tasks.length + 1,
                    //                 title: taskTitle,
                    //                 img: url
                    //             }
                    //         ]

                    //     })
                    // }
                    //  else {
                    //     set(ref(database, `${router.query.slug}/`), {
                    //         ...boardsData,
                    //         columns: {
                    //             ...boardsData.columns,
                    //             [column]: {
                    //                 ...boardsData.columns[column],
                    //                 taskIds: [...boardsData.columns[column].taskIds, taskTitle]
                    //             }
                    //         },
                    //         tasks: [
                    //             ...boardsData.tasks,
                    //             {
                    //                 id: tasks.length + 1,
                    //                 title: taskTitle,
                    //                 img: url
                    //             }
                    //         ]

                    //     })
                    // }
                })
            },
        );

        setState(false)
        setTaskTitle('')
        setFile([])
        setUrl(null)


        // if (column.taskIds == "no tasks") {
        //     set(ref(database, `${router.query.slug}/`), {
        //         ...boardsData,
        //         columns: {
        //             ...boardsData.columns,
        //             [column]: {
        //                 ...boardsData.columns[column],
        //                 taskIds: [taskTitle]
        //             }
        //         },
        //         tasks: [
        //             ...boardsData.tasks,
        //             {
        //                 id: tasks.length + 1,
        //                 title: taskTitle,
        //                 img: taskImg
        //             }
        //         ]

        //     })
        // }

        // set(ref(database, `${router.query.slug}/`), {
        //     ...boardsData,
        //     columns: {
        //         ...boardsData.columns,
        //         [column]: {
        //             ...boardsData.columns[column],
        //             taskIds: [...boardsData.columns[column].taskIds, taskTitle]
        //         }
        //     },
        //     columnOrder: [
        //         ...boardsData.columnOrder,
        //         newCol.id,
        //     ]
        // })


    }

    return (
        <div>
            {/* <button className="text-white text-lg px-4 py-2 rounded-sm bg-[#238636]" onClick={() => console.log(keysLength)}>check</button> */}
            {
                !state ?
                    <div className="flex items-center px-4 py-2 rounded-sm text-white bg-[#c5c5c513] cursor-pointer" onClick={() => setState(true)}>
                        <BsPlusLg size={16} />
                        <div className="ml-2">Add new task</div>
                    </div>
                    :
                    <div className="w-full bg-[#242731] p-2 rounded-md">
                        <TextInput
                            placeholder="Enter list title..."
                            className="w-full"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && listTitle !== '') { handleAddCard(); setState(false) }
                            }}
                        />
                        <div className="my-4">
                            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFile}
                                sx={(theme) => ({
                                    height: 40,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: 0,
                                })}
                            >
                                <Text align="center" className="text-gray-900">Drop image here</Text>
                            </Dropzone>

                            <SimpleGrid
                                cols={4}
                                breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                mt={previews.length > 0 ? 'sm' : 0}
                            >
                                {previews}
                            </SimpleGrid>
                        </div>
                        <div className="flex items-center">
                            <button className="bg-[#238636] text-sm text-white font-semibold rounded-sm px-2 py-1 mr-2" onClick={handleAddCard}>Add List</button>
                            <RiCloseLine size={30} className="cursor-pointer text-gray-300" onClick={() => {
                                setState(false)
                                setTaskTitle('')
                                setFile([])
                            }} />
                        </div>
                    </div>
            }
        </div>
    )
}