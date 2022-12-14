import { TextInput, Text, Image, SimpleGrid, NumberInput } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { BsCurrencyDollar, BsPlusLg } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import { database, storage } from "../../firebase/initFirebase";
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { ref, set } from "firebase/database";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default ({ column, columnId, allTasks }) => {

    const [percent, setPercent] = useState(0)

    const router = useRouter();
    const [state, setState] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [taskPrice, setTaskPrice] = useState(null)
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
        if (!taskPrice) {
            alert('Price is mandatory')
            return
        }

        if (taskTitle !== '' && file.length !== 0) {
            const metadata = {
                contentType: 'image/jpeg'
            };

            const storageRef = ref_storage(storage, 'taskimages/' + file[0].name);
            const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    // console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            // console.log('Upload is paused');
                            setPercent(progress)
                            break;
                        case 'running':
                            // console.log('Upload is running');
                            setPercent(progress)
                            break;
                    }
                },
                (error) => {
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
                        // console.log('File available at', downloadURL);
                        setUrl(downloadURL)
                        return downloadURL
                    }).then((url) => {
                        // console.log(allTasks)
                        if (column.taskIds.length === 0) {
                            // let b = allTasks[allTasks.length - 1].id + 1
                            // let t = { ...allTasks };


                            // t[b] = {
                            //     id: allTasks[allTasks.length - 1].id + 1,
                            //     content: taskTitle,
                            //     img: url
                            // }

                            let tempTask = {
                                id: Math.floor(Math.random() * 90000) + 10000,
                                content: taskTitle,
                                img: url,
                                price: taskPrice
                            }
                            set(ref(database, router.query.slug + '/tasks/'), {
                                ...allTasks,
                                [tempTask.id]: tempTask
                            }).then(() => {
                                set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                                    ...column,
                                    taskIds: [
                                        tempTask.id,
                                    ]
                                })
                            })
                        } else {
                            // let b = allTasks[allTasks.length - 1].id + 1
                            // let t = { ...allTasks };


                            // t[b] = {
                            //     id: allTasks[allTasks.length - 1].id + 1,
                            //     content: taskTitle,
                            //     img: url
                            // }

                            let tempTask = {
                                id: Math.floor(Math.random() * 90000) + 10000,
                                content: taskTitle,
                                img: url,
                                price: taskPrice
                            }


                            set(ref(database, router.query.slug + '/tasks/'), {
                                ...allTasks,
                                [tempTask.id]: tempTask
                            }).then(() => {
                                set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                                    ...column,
                                    taskIds: [
                                        ...column.taskIds,
                                        tempTask.id
                                    ]
                                })
                            })
                        }
                    })
                },
            );
        } else if (taskTitle !== '' && file.length === 0) {
            if (column.taskIds.length === 0) {
                let tempTask = {
                    id: Math.floor(Math.random() * 90000) + 10000,
                    content: taskTitle,
                    img: "No Image",
                    price: taskPrice
                }
                set(ref(database, router.query.slug + '/tasks/'), {
                    ...allTasks,
                    [tempTask.id]: tempTask
                }).then(() => {
                    set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                        ...column,
                        taskIds: [
                            tempTask.id,
                        ]
                    })
                })
            } else {
                let tempTask = {
                    id: Math.floor(Math.random() * 90000) + 10000,
                    content: taskTitle,
                    img: "No Image",
                    price: taskPrice
                }

                set(ref(database, router.query.slug + '/tasks/'), {
                    ...allTasks,
                    [tempTask.id]: tempTask
                }).then(() => {
                    set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                        ...column,
                        taskIds: [
                            ...column.taskIds,
                            tempTask.id
                        ]
                    })
                })
            }
        } else if (file.length !== 0 && taskTitle === '') {

            const metadata = {
                contentType: 'image/jpeg'
            };

            const storageRef = ref_storage(storage, 'taskimages/' + file[0].name);
            const uploadTask = uploadBytesResumable(storageRef, file[0], metadata);

            uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    // console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            // console.log('Upload is paused');
                            setPercent(progress)
                            break;
                        case 'running':
                            // console.log('Upload is running');
                            setPercent(progress)
                            break;
                    }
                },
                (error) => {
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
                        // console.log('File available at', downloadURL);
                        setUrl(downloadURL)
                        return downloadURL
                    }).then((url) => {
                        // console.log(allTasks)
                        if (column.taskIds.length === 0) {
                            let tempTask = {
                                id: Math.floor(Math.random() * 90000) + 10000,
                                content: "No Title",
                                img: url
                            }
                            set(ref(database, router.query.slug + '/tasks/'), {
                                ...allTasks,
                                [tempTask.id]: tempTask
                            }).then(() => {
                                set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                                    ...column,
                                    taskIds: [
                                        tempTask.id,
                                    ]
                                })
                            })
                        } else {
                            let tempTask = {
                                id: Math.floor(Math.random() * 90000) + 10000,
                                content: "No Title",
                                img: url,
                                price: taskPrice
                            }

                            set(ref(database, router.query.slug + '/tasks/'), {
                                ...allTasks,
                                [tempTask.id]: tempTask
                            }).then(() => {
                                set(ref(database, `${router.query.slug}/columns/${columnId}`), {
                                    ...column,
                                    taskIds: [
                                        ...column.taskIds,
                                        tempTask.id
                                    ]
                                })
                            })
                        }
                    })
                },
            );

        }


        setState(false)
        setTaskTitle('')
        setFile([])
        setUrl(null)
    }

    return (
        <div>
            {/* <button className="text-white text-lg px-4 py-2 rounded-sm bg-[#238636]" onClick={() => console.log(keysLength)}>check</button> */}
            {
                !state ?
                    <div>
                        <div className="flex items-center px-4 py-2 mb-3 rounded-sm text-white bg-[#c5c5c513] cursor-pointer" onClick={() => setState(true)}>
                            <BsPlusLg size={16} />
                            <div className="ml-2">Add new task</div>
                        </div>
                        {percent > 0 && <div className="text-white text-sm text-center font-semibold">Uploading Image : {percent} %</div>}
                        {percent === 100 && setPercent(0)}
                    </div>
                    :
                    <div className="w-full bg-[#242731] p-2 rounded-md">
                        <TextInput
                            placeholder="Enter list title..."
                            className="w-full"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') { handleAddCard(); setState(false) }
                            }}
                        />
                        <div className="my-4">
                            <NumberInput
                                placeholder="Task Price..."
                                className="w-full"
                                icon={<BsCurrencyDollar />}
                                value={taskPrice}
                                onChange={setTaskPrice}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { handleAddCard(); setState(false) }
                                }}
                            />
                        </div>
                        <div className="mb-4">
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