import { database } from "./initFirebase";
import { ref, onValue } from "firebase/database";


export const getBoards = ({setBoards}) => {
    const dbRef = ref(database, 'accessUser/dsafjsdfsdfsdfh/');

     onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        // console.log('alotted boards', data)
        setBoards(data)
    });
}

export const getBoardsData = (boardName, setBoardsData) => {
    // console.log('boardName: ', boardName)
    const boardData = ref(database, `${boardName}/`);
    onValue(boardData, (snapshot) => {
        let data = snapshot.val();
        console.log('board data ======', data)
        // data.tasks.map((item) => {
        //     item.tasks
        // })
        setBoardsData(data)

        
    })
}