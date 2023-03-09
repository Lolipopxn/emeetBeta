import { useState, useEffect } from "react";
import { Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Grid, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Close } from '@mui/icons-material/';
import Announcement from "../models/Announcement";
import './meetinfo-card.css'
import { VscFilePdf } from 'react-icons/vsc';

import { ref, getDownloadURL, listAll, getStorage } from "firebase/storage";
import { db } from "../fireBaseConfig"
import { getDoc, doc, DocumentData } from "firebase/firestore";

interface Prop {
  announcement: Announcement
  onUpdateAnnouncement : (announcement: Announcement) => void;
}

function MeetInfoCard(props: Prop) {
  const [meetData, setMeetData] = useState<DocumentData>();
  const announcement = props.announcement;
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const disable = announcement.end;
  const storage = getStorage();
  const [data, setData] = useState<string[]>([]);
  const [number, setNumber] = useState(0);
  const ListAll = (n : number) => {
    setData([]);
    setNumber(0);

    const fileRef = ref(storage, 'meetDoc/annId_'+ meetData?.id + '/agenId_' + n);
      listAll(fileRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            setData((arr: string[]) => [...arr, itemRef.name]);
            setNumber(n);
          })
        }).catch((error) => {
          // Uh-oh, an error occurred!
        });
      setPopup2(true);
  }

  const downloadURL = (n : number, name : string) => {
    // Create a reference under which you want to list
    const listRef = ref(storage, 'meetDoc/annId_'+ meetData?.id + '/agenId_' + n + '/' + name);

    getDownloadURL(listRef)
      .then((url) => {
              //console.log(url);
        window.open(url, "_blank");
      })
        
  }

  const fetchPost = async () => {
    const newData = await getDoc(doc(db, "Meets", announcement?.id.toLocaleString()));
    setMeetData(newData.data());
  }

  useEffect(() => {
    fetchPost();
  });

  return (
    <Box>
      {!disable
      ?
      <Card sx={{ maxWidth: 500, height: 250, borderRadius:7 }}>
        <CardHeader
          sx={{ height: '30%' }}
          title={<Typography variant="h6" sx={{fontFamily:'Kanit',fontWeight:500}}>{meetData?.topic}</Typography>}
          subheader={<Typography sx={{fontFamily:'Kanit',fontWeight:300,fontSize:17}}>{meetData?.date}</Typography>}
        />
        <CardActionArea sx={{ height: '56%' }} onClick={() => setPopup(true)}>
          <CardContent sx={{ height: '40%' }}>
            <Grid container spacing={2} columns={5}>
              <Grid item xs={3}>
                <Typography variant="h5" component="div" sx={{fontFamily:'Kanit',fontSize:22}}>
                  {meetData?.place}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{fontFamily:'Kanit',fontSize:17}}>
                  {meetData?.agendaRule}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Typography variant="button" color="primary" sx={{fontFamily:'Kanit'}}>รายละเอียด</Typography>
          </CardActions>
        </CardActionArea>
      </Card>
      :
      <Card sx={{ maxWidth: 500, height: 250, backgroundColor: '#EEEEEE', borderRadius:7}}>
        <CardHeader
          sx={{ height: '30%' }}
          title={<Typography variant="h6" sx={{fontFamily:'Kanit',fontWeight:500}}>{meetData?.topic}</Typography>}
          subheader={<Typography sx={{fontFamily:'Kanit',fontWeight:300,fontSize:17}}>{meetData?.date}</Typography>}
        />
        <CardActionArea sx={{ height: '56%' }} onClick={() => setPopup(true)}>
          <CardContent sx={{ height: '40%' }}>
            <Grid container spacing={2} columns={5}>
              <Grid item xs={3}>
                <Typography variant="h5" component="div" sx={{fontFamily:'Kanit',fontSize:22}}>
                  {meetData?.place}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{fontFamily:'Kanit',fontSize:17}}>
                  {meetData?.agendaRule}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Typography variant="button" color="primary" sx={{fontFamily:'Kanit'}}>รายละเอียด</Typography>
          </CardActions>
        </CardActionArea>
      </Card>}

      <Dialog PaperProps={{ sx: { minWidth: "50%", maxHeight: "100%" } }} open={popup} onClose={() => setPopup(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ mt: 1,fontFamily:'Kanit' }}>
            {meetData?.topic}
          </Typography>
          
          <IconButton onClick={() => setPopup(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        {meetData?.lastUpdated && (
          <Typography  variant="h6" sx={{ mt: 1}}  marginLeft={3}>
            สิ้นสุดการประชุมเวลา: <p>{new Date(meetData?.lastUpdated!.toDate()).toLocaleString()}</p>
          </Typography>
        )}
        <DialogContent dividers>

          <Typography variant="h6" sx={{ mt: 1,fontFamily:'Kanit',fontWeight:400 }}>
            ประชุมวันที่: {meetData?.date}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1,fontFamily:'Kanit',fontWeight:400 }}>
            สถานที่: {meetData?.place}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1,fontFamily:'Kanit',fontWeight:400 }}>
            ระเบียบการวาระประชุม: {meetData?.agendaRule}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1,fontFamily:'Kanit',fontWeight:400 }}>
            วาระการประชุม
          </Typography>
          <Button sx={{ fontFamily: "Kanit",fontWeight:400 }} onClick={() => ListAll(1)}>1. เรื่องแจ้งเพื่อทราบ</Button>
          <p><Button sx={{ fontFamily: "Kanit",fontWeight:400}} onClick={() => ListAll(2)}>2. รับรองรายงานการประชุม</Button></p>
          <p><Button sx={{ fontFamily: "Kanit",fontWeight:400 }} onClick={() => ListAll(3)}>3. เรื่องสืบเนื่องจากการประชุมครั้งที่แล้ว</Button></p>
          <p><Button sx={{ fontFamily: "Kanit",fontWeight:400 }} onClick={() => ListAll(4)}>4. เรื่องค้างเพื่อพิจารณา</Button></p>
          <p><Button sx={{ fontFamily: "Kanit",fontWeight:400 }} onClick={() => ListAll(5)}>5. เรื่องเสนอเพื่อพิจารณาใหม่</Button></p>
          <p><Button sx={{ fontFamily: "Kanit",fontWeight:400 }} onClick={() => ListAll(6)}>6. เรื่องอื่น</Button></p>
          <p><Button sx={{ fontFamily: "Kanit",fontWeight:400 }} onClick={() => ListAll(7)}>7. การเชิญประชุม</Button></p>
        </DialogContent>
      </Dialog>

      <Dialog PaperProps={{ sx: { minWidth: "20%", height: 350 , marginLeft:40 ,marginTop: 30 }} } open={popup2} onClose={() => setPopup2(false)}>
        <CardHeader 
          title={
          <Typography variant="h6" sx={{color:'white',textAlign:'center',fontFamily:'Kanit',fontWeight:300}}>เอกสารทั้งหมด
          </Typography>}
          sx={{height:'20%',maxwidth:'100%',backgroundColor:'#333333'}}>
        </CardHeader>

        <DialogContent dividers>
        {data.length > 0
          ?
          <Grid>
            {data.map((file) => (
              <Grid item mx={3} mb={1} sx={{ display: 'flex', alignItems: 'left', justifyContent: 'left', width: 'auto'}}>
                <VscFilePdf style={{ fontSize:27,marginRight:4}}/>
                <Button sx={{ fontFamily:'Kanit',fontWeight:400,color: '#2C3333','&:hover': {
            color:'white',backgroundColor:'#143B6C'} }} onClick={() => downloadURL(number, file)}>{file}</Button>
              </Grid>
            ))}
          </Grid>
          :
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        }
        </DialogContent>
      </Dialog>
    </Box>
    
  )
}


export default MeetInfoCard;