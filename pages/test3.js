import { useState } from 'react';
import { Text, Image, SimpleGrid } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, FileWithPath } from '@mantine/dropzone';
import { storage } from '../firebase/initFirebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default () => {
    const [files, setFiles] = useState([]);

    const previews = files.map((file, index) => {
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
        // console.log(files[0].name)
        const metadata = {
            contentType: 'image/jpeg'
        };

        const storageRef = ref(storage, 'taskimages/' + files[0].name);
        const uploadTask = uploadBytesResumable(storageRef, files[0], metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
                });
            }
        );

    }

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center">
            <Dropzone accept={IMAGE_MIME_TYPE} onDrop={setFiles}>
                <Text align="center">Drop images here</Text>
            </Dropzone>

            <SimpleGrid
                cols={4}
                breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                mt={previews.length > 0 ? 'sm' : 0}
            >
                {previews}
            </SimpleGrid>

            <button className="bg-[#238636] text-sm text-white font-semibold rounded-sm px-2 py-1 mr-2" onClick={handleAddCard}>Add List</button>
        </div>
    )
}