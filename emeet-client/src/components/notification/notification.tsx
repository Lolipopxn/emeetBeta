import { useState, useEffect } from "react";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { Close } from '@mui/icons-material/';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';

import NotificationPopup from "./notificationPopup"
import Announcement from "../../models/Announcement";

import { db } from "../../fireBaseConfig"
import { collection, getDocs, DocumentData } from "firebase/firestore";

function Notifications() {
    const [popup, setPopup] = useState(false);
    const [count, setCount] = useState(0);
    const [annList, setAnnList] = useState<DocumentData>(new Document);
    const [dataEnd, setDataEnd] = useState([])

    const fetchAnnList = async () => {
        await getDocs(collection(db, "Meets"))
        .then((querySnapshot) => {
            const newData = querySnapshot.docs.map((doc) =>({...doc.data(), id: doc.id}));
            setAnnList(newData);
        })
        const data = annList.filter((announcement: Announcement) => !announcement.end == true)
        setDataEnd(data);
    }

    useEffect(() => {
        fetchAnnList()
        const unReadCount = dataEnd.length;
        setCount(unReadCount)
    }, [annList])

    return (
        <div>
            <div onClick={() => setPopup(true)}>
                <Badge badgeContent={count} color="error">
                    <NotificationsIcon sx={{color:'#ECF9FF',ml:1.5,cursor:'pointer'}}/> 
                </Badge>
                <span style={{cursor:'pointer'}} className="menu-text">แจ้งเตือนการประชุม</span>
            </div>

            <Dialog PaperProps={{ sx: { minWidth: "740px" } }} open={popup} onClose={() => setPopup(false)}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between',backgroundColor: '#002E74', color: '#ECF9FF', fontFamily: 'Kanit'}}>
                    แจ้งเตือนการประชุม
                    <IconButton sx={{ color: '#ECF9FF' }}onClick={() => setPopup(false)}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <NotificationPopup/>
            </Dialog>
        </div>
    )
}

export default Notifications;