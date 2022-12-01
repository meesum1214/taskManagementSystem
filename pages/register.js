import Link from "next/link"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebase/initFirebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ref, set } from "firebase/database";
import { getAdmins, getUsers } from "../firebase/FirebaseFunctions";

export default () => {

    useEffect(() => {
        if (localStorage.getItem('peretz-auth-token')) {
            router.push('/')
          }
    }, [])

    const [allUsers, setAllUsers] = useState([])
    const [allAdmins, setAllAdmins] = useState([]);

    useEffect(() => {
        getUsers(setAllUsers)
        getAdmins(setAllAdmins)
    }, [])


    const router = useRouter()
    const [Loading, setLoading] = useState(false);
    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onRegister = () => {
        setLoading(true)

        if (!username || !password) {
            alert('please enter both feilds!')
            setLoading(false)
            return
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('peretz-auth-token', user.accessToken)
                localStorage.setItem('peretz-user-id', user.uid)
                // console.log(user)
                if (!allUsers) {
                    set(ref(database, 'allUsers/'), [
                        {
                            fName: fName,
                            lName: lName,
                            email: email,
                            password: password,
                            id: user.uid,
                            role: 'admin'
                        }
                    ]).then(() => {
                        set(ref(database, 'roles/admins'), [{
                            id: user.uid,
                            name: fName + ' ' + lName
                        }])
                        router.push('/')
                        setLoading(false)
                    }).catch((error) => {
                        alert(error)
                        setLoading(false)
                    })
                }
                else {
                    set(ref(database, 'allUsers/'), [
                        ...allUsers,
                        {
                            fName: fName,
                            lName: lName,
                            email: email,
                            password: password,
                            id: user.uid,
                            role: 'admin'
                        }
                    ]).then(() => {
                        if (!allAdmins) {
                            set(ref(database, 'roles/admins'), [{
                                id: user.uid,
                                name: fName + ' ' + lName
                            }])
                        } else {
                            set(ref(database, 'roles/admins'), [
                                ...allAdmins,
                                {
                                    id: user.uid,
                                    name: fName + ' ' + lName
                                }
                            ])
                        }
                        router.push('/')
                        setLoading(false)
                    }).catch((error) => {
                        alert(error)
                        setLoading(false)
                    })
                }
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('Error Message: ', errorMessage)
                alert(errorMessage)
                setLoading(false)
            });
    }


    return (
        <div>

            {/* Loading Wheel */}
            <div className={`double-up fixed w-screen h-screen ${Loading ? 'flex' : 'hidden'} justify-center items-center bg-[#ffffff3b]`}></div>

            <div className="flex items-center justify-center h-screen">
                <div className="w-full max-w-md">
                    <div className="flex justify-between items-center w-full px-12 h-[60px] bg-[#242731] rounded-sm rounded-b-none">
                        <div className="text-xl text-white font-bold text-center">
                            Register
                        </div>
                    </div>
                    <div className="bg-[#16181D] shadow-md rounded-sm px-12 pt-6 pb-8 mb-4">
                        <div className="mb-4 flex justify-between items-center">
                            <div className="mr-2">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                    First Name
                                </label>

                                <input
                                    className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                    id="fname"
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={fName}
                                    onChange={(e) => setFName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                    Last Name
                                </label>

                                <input
                                    className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                    id="lname"
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={lName}
                                    onChange={(e) => setLName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                Email
                            </label>

                            <input
                                className="shadow appearance-none rounded-sm w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline bg-[#242731] border border-gray-500"
                                id="username"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.currentTarget.value)}
                            />

                        </div>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border border-gray-500  rounded-sm w-full py-2 px-3 text-gray-300 mb-3 leading-tight focus:outline-none focus:shadow-outline bg-[#242731]"
                                id="password"
                                type="password"
                                placeholder="******************"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') { onRegister() }
                                }}
                            />
                            {/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
                        </div>
                        <div className="flex items-center justify-between">
                            <button onClick={onRegister} className="bg-[#2DAA46] hover:bg-[#1c722d] transition-all text-white font-bold py-2 px-4 rounded-sm focus:outline-none focus:shadow-outline" type="button">
                                Register
                            </button>
                            <div className="align-baseline font-bold text-sm text-white hover:text-white flex">
                                Already have an account? &nbsp;
                                <Link href="/login">
                                    <div className="text-[#2DAA46] hover:text-[#36d155] transition-all">Login</div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}