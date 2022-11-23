import { auth, database } from "./initFirebase";
import { ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";


export const getBoards = ({ setBoards, setLoading }) => {
    const dbRef = ref(database, `accessUser/${localStorage.getItem('peretz-user-id')}/`);

    try {
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.log('alotted boards', data)
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
    // console.log('boardName: ', boardName)
    const boardData = ref(database, `${boardName}/`);
    onValue(boardData, (snapshot) => {
        let data = snapshot.val();
        // console.log('board data ======', data)
        // data.tasks.map((item) => {
        //     item.tasks
        // })
        data?.columnOrder.map((item, b) => {
            // console.log(a.columns[item])
            data.columns[item].taskIds?.includes("no tasks") ? data.columns[item].taskIds = [] : data.columns[item].taskIds
        })
        setBoardsData(data)
    })
}

// export const getUserRecord = () => {
//     const userData = ref(database, 'accessUser/');
//     const temp = onValue(userData, (snapshot) => {
//         const data = snapshot.val();
//         console.log('user data: ', data)
//         return data
//     })
//     return temp
// }