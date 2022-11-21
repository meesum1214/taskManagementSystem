import { database } from "./initFirebase";
import { ref, onValue } from "firebase/database";


export const getBoards = ({setBoards}) => {
    const dbRef = ref(database, 'accessUser/dsafjsdfsdfsdfh/');

     try{onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        // console.log('alotted boards', data)
        setBoards(data)
    });}
    catch(err){
        console.log(err)
        setBoards([])
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
    data.columnOrder.map((item, b)=>{           
            // console.log(a.columns[item])
            data.columns[item].taskIds?.includes("no tasks") ? data.columns[item].taskIds = [] : data.columns[item].taskIds
        })
        setBoardsData(data)

        
    })
}