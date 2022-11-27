import { Image, SimpleGrid, Text, TextInput } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { ref, set } from "firebase/database";
import { ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { database, storage } from "../../firebase/initFirebase";

export default ({ setLoading, setTaskState, taskID, setPercent }) => {

    const router = useRouter();

    const [taskTitle, setTaskTitle] = useState('')
    const [file, setFile] = useState([])

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
        setLoading(true)

        if (taskTitle === '' && file.length === 0) {

            alert('Please fill atleat one feild!')
            setLoading(false)

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
                        // setUrl(downloadURL)
                        return downloadURL
                    }).then((url) => {
                        set(ref(database, router.query.slug + '/tasks/' + taskID + '/img/'), url)
                            .then(() => {
                                setTaskState(false)
                                setLoading(false)
                            })
                            .catch((error) => {
                                setTaskState(false)
                                alert(error)
                                setLoading(false)
                            })
                    })
                },
            );


        } else if (taskTitle !== '' && file.length === 0) {
            set(ref(database, `${router.query.slug}/tasks/${taskID}/content`), taskTitle)
                .then(() => {
                    setTaskState(false)
                    setLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    alert(error)
                    setLoading(false)
                })
        } else if (taskTitle !== '' && file.length !== 0) {
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
                }
            );

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                // console.log('File available at', downloadURL);
                // setUrl(downloadURL)
                return downloadURL
            }
            ).then((url) => {
                set(ref(database, `${router.query.slug}/tasks/${taskID}/img/`), url)
                    .then(() => {
                        set(ref(database, `${router.query.slug}/tasks/${taskID}/content`), taskTitle)
                            .then(() => {
                                setTaskState(false)
                                setLoading(false)
                            })
                            .catch((error) => {
                                console.log(error);
                                setTaskState(false)
                                alert(error)
                                setLoading(false)
                            })
                    })
                    .catch((error) => {
                        console.log(error);
                        setTaskState(false)
                        alert(error)
                        setLoading(false)
                    })
            })
        }

    }


    return (
        <div className="w-full bg-[#242731] p-2 rounded-md">
            <TextInput
                placeholder="Enter list title..."
                className="w-full"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') { handleAddCard(); setTaskState(false) }
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
                    setTaskState(false)
                    setTaskTitle('')
                    setFile([])
                }} />
            </div>
        </div>
    )
}