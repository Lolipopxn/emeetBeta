import { useState, useEffect } from "react";
import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Dialog, DialogTitle, Grid, IconButton, Tab, Tabs, Typography } from "@mui/material";
import { Box, fontFamily } from "@mui/system";
import { Close, Delete, Edit, Upload } from "@mui/icons-material";
import Announcement from "../models/Announcement";
import AnnouncementForm from "./announcement-form";
import Repo from '../repositories'
import { storage } from "../fireBaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from 'sweetalert2'

import { db } from "../fireBaseConfig"
import { doc, deleteDoc, getDocs, DocumentData, collection } from "firebase/firestore";

interface Prop {
  announcement: Announcement
  callbackFetchFn: () => void
  onUpdateAnnouncement : (announcement: Announcement) => void;
}

function AnnouncementCard(props: Prop) {
  const announcement = props.announcement
  const [popup, setPopup] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [fileSelected, setFile] = useState<File>();
  const [agendaSelected, setAgenda] = useState<number>();
  const disable = announcement.isMeetingEnd;
  const [meetData, setMeetData] = useState<DocumentData>(new Document);
  //const [downloadURL, setDownloadURL] = useState('');

  const fetchAnnList = async () => {
    await getDocs(collection(db, "Meets"))
    .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) =>({...doc.data(), id: doc.id}));
        setMeetData(newData);
    })
          
  }

  useEffect(() => {
    fetchAnnList()
})

  const onUpdate = async (ann: Partial<Announcement>) => {
      setPopup(false)
      Swal.fire({
        title: 'ต้องการแก้ไขหรือไม่?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'บันทึก',
        cancelButtonText: 'ยกเลิก',
        denyButtonText: `ละทิ้ง`,
      }).then((results) => {
        /* Read more about isConfirmed, isDenied below */
        if (results.isConfirmed) {
          Swal.fire('บันทึกเสร็จสิ้น!', '', 'success')
        } else if (results.isDenied) {
          Swal.fire('ข้อมูลไม่ถูกบันทึก', '', 'info')
        }
      })
  }

  

  const onDelete = async () => {
    await deleteDoc(doc(db, "Meets", announcement.id.toLocaleString()));

    await Swal.fire({
      title: 'ลบรายการประชุมหรือไม่?',
      text: "หากลบออกแล้วจะไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire(
            'ลบเสร็จสิ้น!',
            'รายการประชุมถูกลบออกจากฐานข้อมูลแล้ว',
            'success'
          );
        } catch (error) {
          console.error(error);
          Swal.fire(
            'เกิดข้อผิดพลาด!',
            'ไม่สามารถลบรายการประชุมได้',
            'error'
          );
        }
      }
    });
  };

  const handleMeeting = async () => {
    //const newData = await getDoc(doc(db, "Meets", announcement.id.toLocaleString()));
    //const data = newData.data();

    //const result = await Repo.announcements.MeetingEnd(announcement.id, true)
    //const datetime = await Repo.announcements.read(announcement.id)
    //if(result) {
      //props.onUpdateAnnouncement(result)
    //}
    //if(datetime){
      //props.onUpdateAnnouncement(datetime)
    //}
    setPopup(false);
  }

  const handleSelectedFile = (file : any, n : number) => {
    if(file && isImporting === false){
      setAgenda(n)
      setIsImporting(true)
      setFile(file[0])
    }
  }

  const handleCancelFile = () => {
    setIsImporting(false)
  }

  const handleImport = async (event: any) => {
    if (fileSelected && isImporting === true){
      setIsImporting(false)
      const name = fileSelected.name
      const storageRef = ref(storage, 'meetDoc/annId_'+ announcement.id + '/agenId_' + agendaSelected + '/' + name)
      const uploadTask = uploadBytesResumable(storageRef, fileSelected)

      uploadTask.on('state_changed', 
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //setDownloadURL(url)
          });
        }
      );
    }

    event.target.value = null
  }

  return (
    <Box>
      {!disable
      ?
      <Card sx={{ maxWidth: 500, height: 240, borderRadius:7}}>
        <CardHeader
          sx={{ height: '30%' }}
          title={<Typography variant="h6" sx={{fontFamily:'Kanit',fontWeight:500}}>{meetData?.topic}</Typography>}
          subheader={<Typography sx={{fontFamily:'Kanit',fontWeight:300,fontSize:17}}>{meetData?.date}</Typography>}
          header={meetData?.desc}
          action={
            <IconButton sx={{ '&:hover': { color: 'red' } }} onClick={onDelete}>
              <Delete />
            </IconButton>
          }
        />
        <CardActionArea sx={{ height: '56%' }} onClick={() => setPopup(true)}>
          <CardContent sx={{ height: '40%' }}>
            <Grid container spacing={2} columns={5}>
              <Grid item xs={3}>
              <Typography variant="h5" component="div" sx={{fontFamily:'Kanit',fontSize:22}}>
                  {meetData?.place}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Edit color="primary" />
          </CardActions>
        </CardActionArea>
      </Card>
      :
      <Card sx={{ maxWidth: 500, height: 240, backgroundColor: '#EEEEEE', borderRadius:7}}>
      <CardHeader
        sx={{ height: '30%' }}
        title={<Typography variant="h6" sx={{fontFamily:'Kanit',fontWeight:500}}>{meetData?.topic}</Typography>}
        subheader={<Typography sx={{fontFamily:'Kanit',fontWeight:300,fontSize:17}}>{meetData?.date}</Typography>}
        header={meetData?.desc}
      />
        <CardContent sx={{ height: '40%' }}>
          <Grid container spacing={2} columns={5}>
            <Grid item>
              {meetData?.end &&
              <Typography component="div">
                  <p style={{fontFamily:'Kanit',fontWeight:400,fontSize:22}}>สิ้นสุดการประชุมเมื่อ</p>
                  <p>{new Date(meetData?.recognizeTime!.toString()).toLocaleString("en-GB")}</p>
                </Typography>
              }
            </Grid>
          </Grid>
        </CardContent>
    </Card>
    }

      <Dialog PaperProps={{ sx: { minWidth: "50%", height: "55%" } }} open={popup} onClose={() => setPopup(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tabs value={tabIndex} onChange={(event: React.SyntheticEvent, newValue: number) => setTabIndex(newValue)} aria-label="basic tabs example">
            <Tab sx={{fontFamily:'Kanit'}} label="แก้ไขชื่อและวันที่" />
            <Tab sx={{fontFamily:'Kanit'}} label="อัปโหลดไฟล์เอกสาร" />
            <Tab sx={{fontFamily:'Kanit'}} label="สิ้นสุดการประชุม" />
          </Tabs>
          <IconButton onClick={() => setPopup(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <Box hidden={tabIndex !== 0}>
          <AnnouncementForm announcement={announcement} callbackFn={onUpdate}></AnnouncementForm>
        </Box>
        <Box hidden={tabIndex !== 1}>
          <Box sx={{ margin: 2 }}>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 1.เรื่องแจ้งเพื่อทราบ
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload />
              เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 1)} />
            </Button>
            {agendaSelected === 1 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 2.รับรองรายงานการประชุม
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload />
              เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 2)} />
            </Button>
            {agendaSelected === 2 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 3.เรื่องสืบเนื่องจากการประชุมครั้งที่แล้ว
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload />
              เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 3)} />
            </Button>
            {agendaSelected === 3 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 4.เรื่องค้างเพื่อพิจารณา
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload />
              เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 4)} />
            </Button>
            {agendaSelected === 4 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 5.เรื่องเสนอเพื่อพิจารณาใหม่
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload />
              เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 5)} />
            </Button>
            {agendaSelected === 5 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 6.เรื่องอื่นๆ
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload/>
                เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 6)} />
            </Button>
            {agendaSelected === 6 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
            <Typography variant="h6" sx={{ mt: 0.5,fontFamily:'Kanit',fontWeight:400 }}>
              วาระที่ 7.การเชิญประชุม
            </Typography>
            <Grid container sx={{ p:1 }}>
            <Button disabled={isImporting} variant="contained" component="label" sx={{ mx: 1,fontFamily:'Kanit',fontWeight:400,borderRadius:8 }}>
              <Upload />
              เลือกไฟล์
              <input hidden type="file" accept=".pdf" onChange={(file) => handleSelectedFile(file.target.files, 7)} />
            </Button>
            {agendaSelected === 7 && fileSelected &&<p>{fileSelected.name}</p>}
            </Grid>
          </Box>
          <Button disabled={!isImporting} variant="contained" component="label" sx={{ fontSize:18,ml:4,mt:5,mb:3 ,fontFamily:'Kanit',fontWeight:400,borderRadius:8,backgroundColor:'#5CB85C','&:hover':{backgroundColor:'#5CB85C'} }} onClick={handleImport}>
            อัปโหลด
          </Button>
          <Button disabled={!isImporting} variant="contained" component="label" sx={{ fontSize:18,float: 'right',mt:5,mb:3,mr:4, fontFamily:'Kanit',fontWeight:400,borderRadius:8,backgroundColor:'#ED5E68','&:hover':{backgroundColor:'#ED5E68'} }} onClick={handleCancelFile}>
            ยกเลิก
          </Button>
        </Box>
        <Box hidden={tabIndex !== 2}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <Button disabled={meetData?.end} variant="contained" sx={{ mx: 4, my: 1, verticalAlign: 'bottom', width: 200, height: 50,fontFamily:'Kanit',fontWeight:500,borderRadius:8,backgroundColor:'#ED5E68',fontSize:17,'&:hover':{backgroundColor:'#ED5E68'}}} onClick={handleMeeting}>
            สิ้นสุดการประชุม
          </Button>
        </div>
        {announcement.recognizeTime &&
        <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
              {new Date(announcement?.recognizeTime!.toString()).toLocaleString("en-GB")}
          </Typography>}
        </Box>
      </Dialog>
    </Box>
  )
}

export default AnnouncementCard;