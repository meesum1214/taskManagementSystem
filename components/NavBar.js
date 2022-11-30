import { signOut } from "firebase/auth";
import { useRouter } from "next/router"
import { auth } from "../firebase/initFirebase";
import { FaUserAlt } from "react-icons/fa";
import { Divider, HoverCard } from "@mantine/core";
import { useEffect, useState } from "react";
import { getUserData } from "../firebase/FirebaseFunctions";

export default () => {

    const [userData, setUserData] = useState('')

    useEffect(() => {
        getUserData(localStorage.getItem('peretz-user-id'), setUserData)
    }, [])


    const router = useRouter()

    const onLogout = () => {
        signOut(auth);
        localStorage.removeItem('peretz-auth-token')
        localStorage.removeItem('peretz-user-id')
        router.push('/login')
    }

    return (
        <div className="flex justify-center bg-gray-800">
            <nav className="w-[90%] flex items-center justify-between py-6">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="font-semibold text-xl tracking-tight cursor-pointer" onClick={() => router.push('/')}>Task Management System</span>
                    <span className="text-gray-600 text-sm font-semibold ml-2">(Admin)</span>
                </div>

                <HoverCard shadow="md">
                    <HoverCard.Target>
                        <div className="flex items-center">
                            <FaUserAlt size={17} className="text-white cursor-pointer" />
                            <div className="text-white text-lg font-semibold ml-2">Profile</div>
                        </div>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <div>
                            <div className="text-lg font-semibold">{userData.fName} {userData.lName}</div>
                            <Divider className="mt-2" />
                            <div
                                className="inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:text-white hover:bg-gray-800 mt-4 lg:mt-0 cursor-pointer transition-all"
                                onClick={onLogout}
                            >Logout</div>
                        </div>
                    </HoverCard.Dropdown>
                </HoverCard>
            </nav>
        </div>
    )
}