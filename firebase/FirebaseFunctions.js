import { database } from "./initFirebase";
import { ref, onValue, set, remove } from "firebase/database";


export const getBoards = ({ setBoards, setLoading }) => {
    const dbRef = ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
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


export const addNewBoard = (boardTitle, setBoardTitle, boards) => {
    set(ref(database, `${boardTitle}/`), {
        tasks: [
            null,
            {
                "content": "Sample Task",
                "id": 1,
                "img": "/img1.jpg"
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

    if (boards) {
        set(ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`), [
            ...boards, { boardName: boardTitle }
        ])
    }
    else {
        set(ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`), [
            { boardName: boardTitle }
        ])
    }

    setBoardTitle('')
}

export const deleteBoard = (boardName, newBoard) => {
    remove(ref(database, boardName))
        .then(() => {
            console.log('Board deleted');
            set(ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`), newBoard)
                .then(() => {
                    console.log('Board deleted from accessUser');
                    // alert('Board deleted')
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
            // console.log('assignedBoards', data)
            setAssignedBoards(data)
        });
    }
    catch (err) {
        console.log(err)
        setAssignedBoards([])
        alert(err)
    }
}