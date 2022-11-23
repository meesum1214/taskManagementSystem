import { SimpleGrid, Text, TextInput } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";

export default ({setLoading, setTaskState}) => {

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

        if (taskTitle === '' && file.length == 0) {
            alert('please enter a title or upload a file')
            return
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
                    if (e.key === 'Enter') { handleAddCard(); setState(false) }
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