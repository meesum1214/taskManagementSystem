import { TextInput } from "@mantine/core";
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { RiCloseLine } from "react-icons/ri";
import { database } from "../firebase/initFirebase";

export default ({ boardsData }) => {

    const router = useRouter();
    const [state, setState] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')




    const handleAddCard = () => {



        // set(ref(database, `${router.query.slug}/`), {
        //     ...boardsData,
        //     columns: {
        //         ...boardsData.columns,
        //         [newCol.id]: newCol
        //     },
        //     columnOrder: [
        //         ...boardsData.columnOrder,
        //         newCol.id,
        //     ]
        // })

        setState(false)
        setListTitle('')
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
                    <div className="w-72 bg-[#242731] p-2 rounded-md">
                        <TextInput
                            placeholder="Enter list title..."
                            className="w-full"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.currentTarget.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && listTitle !== '') { handleAddCard(); setState(false) }
                            }}
                        />
                        <div className="mt-2 flex items-center">
                            <button className="bg-[#238636] text-sm text-white font-semibold rounded-sm px-2 py-1 mr-2" onClick={handleAddCard}>Add List</button>
                            <RiCloseLine size={30} className="cursor-pointer text-gray-300" onClick={() => setState(false)} />
                        </div>
                    </div>
            }
        </div>
    )
}