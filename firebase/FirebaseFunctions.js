import { database } from "./initFirebase";
import { ref, onValue, set, remove } from "firebase/database";


export const getBoards = ({ setBoards, setLoading }) => {
    const dbRef = ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data)
            setBoards(data)
            setLoading(false)
        });
    }
    catch (err) {
        console.log(err)
        setBoards([])
        setLoading(false)
    }
}

export const getBoardsData = (boardName, setBoardsData) => {
    const boardData = ref(database, `${boardName}/`);
    onValue(boardData, (snapshot) => {
        let data = snapshot.val();
        // console.log('board data ======', data)
        data?.columnOrder?.map((item) => {
            data.columns[item].taskIds?.includes("no tasks") ? data.columns[item].taskIds = [] : data.columns[item].taskIds
        })
        setBoardsData(data)
    })
}


export const deleteColumn = (slug, columnId, newColumnOrder) => {

    set(ref(database, slug + '/columnOrder'), newColumnOrder)
        .then(() => {

            remove(ref(database, slug + '/columns/' + columnId))
                .then(() => {
                    console.log('Column deleted');

                })
                .catch((error) => {
                    console.log(error);
                    alert(error)

                })


        })
        .catch((error) => {
            console.log(error);
            alert(error)

        })


}

export const getCustomerBoards = (customerId, setCustomerBoards) => {
    const dbRef = ref(database, `accessUser/${customerId}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log(data)
            setCustomerBoards(data)
        });
    }
    catch (err) {
        console.log(err)
        setCustomerBoards([])
    }
}


export const addNewBoard = (boardTitle, setBoardTitle, boards, boardPrice, setBoardPrice, selectedCustomer, setSelectedCustomer, customerBoards) => {
    set(ref(database, `${boardTitle}/`), {
        tasks: [
            null,
            {
                "content": "Sample Task",
                "id": 1,
                "img": "/img1.jpg",
                "price": 100,
            }
        ],
        columns: {
            "column-1": {
                id: "column-1",
                title: "TO-DO",
                taskIds: [1],
            },
        },
        columnOrder: ["column-1"],
    });

    let customerName = ref(database, `allUsers/`)
    onValue(customerName, (snapshot) => {
        const data = snapshot.val();

        data.map((item) => {
            if (item.id === selectedCustomer) {
                // customerName = item.name
                // console.log('customerName: ', item);
                if (!customerBoards) {
                    set(ref(database, `accessUser/${selectedCustomer}/`), [
                        { boardName: boardTitle, boardPrice: boardPrice, customer: item.fName + " " + item.lName, customerId: item.id }
                    ])
                } else {
                    set(ref(database, `accessUser/${selectedCustomer}/`), [
                        ...customerBoards,
                        { boardName: boardTitle, boardPrice: boardPrice, customer: item.fName + " " + item.lName, customerId: item.id }
                    ])
                }



                if (boards) {
                    set(ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`), [
                        ...boards, { boardName: boardTitle, boardPrice: boardPrice, customer: item.fName + " " + item.lName, customerId: item.id }
                    ])
                }
                else {
                    set(ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`), [
                        { boardName: boardTitle, boardPrice: boardPrice, customer: item.fName + " " + item.lName, customerId: item.id }
                    ])
                }
            }
        })
    });



    setBoardTitle('')
    setBoardPrice(null)
    setSelectedCustomer(null)
}

export const deleteBoard = (boardName, newBoard, customerId, newCustomerBoards) => {
    remove(ref(database, boardName))
        .then(() => {
            console.log('Board deleted');
            set(ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`), newBoard)
                .then(() => {
                    set(ref(database, `accessUser/${customerId}/`), newCustomerBoards)
                    return
                })
                .catch((error) => {
                    console.log(error);
                    alert(error)
                    return
                })

        })
        .catch((error) => {
            console.log(error);
            alert(error)
        })
}


export const getUsers = (setAllUsers) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('users', data)
            setAllUsers(data)
        });
    }
    catch (err) {
        console.log(err)
        setAllUsers([])
    }
}

export const getAdmins = (setAllAdmins) => {
    const dbRef = ref(database, `roles/admins/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('workers', data)
            setAllAdmins(data)
        });
    }
    catch (err) {
        console.log(err)
        setAllAdmins([])
    }
}

export const getWorkers = (setWorkers) => {
    const dbRef = ref(database, `roles/workers`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('workers', data)
            setWorkers(data)
        });
    }
    catch (err) {
        console.log(err)
        setWorkers([])
    }
}

export const getAssignedBoards = (selectedWorker, setAssignedBoards) => {
    const dbRef = ref(database, `accessUser/${selectedWorker}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('assignedBoards>>>> ', data)
            setAssignedBoards(data)
        });
    }
    catch (err) {
        console.log(err)
        setAssignedBoards([])
        alert(err)
    }
}

export const getWorkerBoards = (workerId, setWorkerBoards) => {
    const dbRef = ref(database, `accessUser/${workerId}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('Assigned Worker Boards >>>>>>>>>>', data)
            setWorkerBoards(data)
        });
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

export const getAllUsers = (id, router) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('allUsers', data)
            // setAllUsers(data)
            data.map((item) => {
                if (item.id === id) {
                    if (item.role !== 'admin') {
                        alert('you dont have access rights')
                        localStorage.removeItem('peretz-user-id')
                        localStorage.removeItem('peretz-auth-token')
                        router.push('/login')
                    }
                }
            })
        });
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

export const getUserData = (id, setUserData) => {
    const dbRef = ref(database, `allUsers/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('allUsers', data)
            data.map((item) => {
                if (item.id === id) {
                    setUserData(item)
                    // console.log('userData: ', item)
                }
            })
        });
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

export const getCustomers = (setCustomers) => {
    const dbRef = ref(database, `roles/customers`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('customers: ', data)
            setCustomers(data)
        });
    }
    catch (err) {
        console.log(err)
        setCustomers([])
    }
}