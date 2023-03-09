import { useState, useEffect, ChangeEvent, Key } from "react";
import { Button, Dialog, DialogTitle, Grid, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Add, Close } from '@mui/icons-material/';
import AnnouncementCard from "../components/announcement-card";
import MeetAppbar from "../components/app-bar";
import AnnouncementForm from "../components/announcement-form";
import Announcement from "../models/Announcement";
import './bg.css';
import './an-list.css'
import Swal from 'sweetalert2'

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { db } from "../fireBaseConfig"
import { collection, getDocs, DocumentData, setDoc, getCountFromServer, doc } from "firebase/firestore";

function AnnouncementList() {
  const [annList, setAnnList] = useState<DocumentData>(new Document);
  const [searchFilter, setSearchFilter] = useState('');
  const [createFormPopup, setCreateFormPopup] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const fetchAnnouncementList = async () => {
    await getDocs(collection(db, "Meets"))
      .then((querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) =>({...doc.data(), id: doc.id}));
          setAnnList(newData);
      })
  }

  const handleChangeSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(event.target.value);
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const onCreateAnnouncement = async (ann: any) => {
    if (ann.id === undefined) {
      const coll = collection(db, "Meets");
      const snapshot = await getDocs(coll);
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      const lastId = lastDoc ? lastDoc.id : "0";
      const newId = (parseInt(lastId) + 1).toLocaleString();
      ann.id = newId;
      setCreateFormPopup(false);
      await setDoc(doc(db, "Meets", newId), ann);
      fetchAnnouncementList();
      Toast.fire({
        icon: "success",
        title: "เพิ่มรายการประชุมสำเร็จ !!",
      });
    }
  };

  useEffect(() => {
    fetchAnnouncementList()

    const listen = onAuthStateChanged(auth, (user) =>  {
      if (user?.email !== "6510110060@psu.ac.th")
      {
        navigate('/home');
        window.location.reload();
      }
    });

      return () => {
        listen();
      }
  }, [searchFilter, annList])

  return (
    <div className="page-layout">
      <div className='app-bar'>
        <MeetAppbar></MeetAppbar>
      </div>
      <div className="info-layout">
        <div className="page-header">
          <h1>นัดหมายการประชุม</h1>
        </div>
        <div className="card-layout">
      <TextField sx={{ m: 2, minWidth: 120 }} label="ค้นหา" placeholder="หัวข้อการประชุม" variant="outlined" value={searchFilter} onChange={handleChangeSearchFilter} />
      <Button sx={{ m: 2, float: 'right',borderRadius:5,fontFamily:'Kanit',fontWeight:400 }} variant="contained" onClick={() => setCreateFormPopup(true)}>
        <Add /> ประกาศการประชุม
      </Button>
      <h4 style={{fontFamily:'Kanit',fontWeight:600,marginBottom:10}}>การประชุมที่ยังไม่ถึง</h4>
      <hr></hr>
      {annList.length ?
      <div className="ann-con">
        <Grid container sx={{ p: 2 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 10 }}>
        {annList.filter((ann: Announcement) => !ann.end).map((ann: Announcement, index : Key) => (
          <Grid item xs={2} sm={4} md={4} lg={3} xl={2} key={index}>
            <AnnouncementCard announcement={ann} callbackFetchFn={fetchAnnouncementList}></AnnouncementCard>
          </Grid>
      ))}
      </Grid>
      </div>

        :
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150 }} marginRight={20}>
          <Typography variant="body2" color="text.secondary" sx={{fontFamily:'Kanit'}}>ไม่พบรายการการประชุม</Typography>
        </Box>
      }

      <h4 style={{fontFamily:'Kanit',fontWeight:600,marginBottom:10}}>การประชุมที่จบไปเเล้ว</h4>
      <hr></hr>
      {annList.length ?
      <div className="ann-con">
        <Grid container sx={{ p: 2 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 10 }}>
        {annList.filter((ann: Announcement) => ann.end).map((ann: Announcement, index : Key) => (
          <Grid item xs={2} sm={4} md={4} lg={3} xl={2} key={index}>
            <AnnouncementCard announcement={ann} callbackFetchFn={fetchAnnouncementList}></AnnouncementCard>
          </Grid>
      ))}
      </Grid>
      </div>

        :
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 150 }} marginRight={20}>
          <Typography variant="body2" color="text.secondary" sx={{fontFamily:'Kanit'}}>ไม่พบรายการการประชุม</Typography>
        </Box>
        }
      </div>

      <Dialog PaperProps={{ sx: { minWidth: "50%" } }} open={createFormPopup} onClose={() => setCreateFormPopup(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          ประกาศการประชุม
          <IconButton onClick={() => setCreateFormPopup(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <AnnouncementForm announcement={{}} callbackFn={onCreateAnnouncement}></AnnouncementForm>
      </Dialog>
    </div>
    </div>
  );
}

export default AnnouncementList;