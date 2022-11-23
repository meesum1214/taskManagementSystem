import { TextInput } from "@mantine/core";
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { database } from "../firebase/initFirebase";

export default ({ setColumnState, columnId, setLoading, taskIds }) => {
    const router = useRouter();

    const [listTitle, setListTitle] = useState('')

    const handleAddCard = () => {
        setLoading(true)

        if (listTitle === '') {
            alert('please enter a title')
            return
        }

        set(ref(database, `${router.query.slug}/columns/${columnId}/`), {
            id: columnId,
            title: listTitle,
            taskIds: taskIds
        })
            .then(() => {
                setColumnState(false)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                alert(err)
                setColumnState(false)
                setLoading(false)
            })
    }

    return (
        <div className="w-full bg-[#242731] p-2 rounded-md">
            <TextInput
                placeholder="Enter list title..."
                className="w-full"
                value={listTitle}
                onChange={(e) => setListTitle(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') { handleAddCard(); setColumnState(false) }
                }}
            />
            <div className="mt-2 flex items-center">
                <button className="bg-[#238636] text-sm text-white font-semibold rounded-sm px-2 py-1 mr-2"
                    onClick={handleAddCard}
                >Add List</button>
                <RiCloseLine size={30} className="cursor-pointer text-gray-300" onClick={() => setColumnState(false)} />
            </div>
        </div>
    )
}