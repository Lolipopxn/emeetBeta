import { ChangeEvent, Key, useEffect, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MeetInfoCard from '../components/meetinfo-card';
import Announcement from '../models/Announcement';
import MeetAppbar from '../components/app-bar';
import './meet-info.css'

import { db } from "../fireBaseConfig"
import { collection, getDocs, DocumentData } from "firebase/firestore";

function MeetInfoList() {
    const [annList, setAnnList] = useState<Announcement[]>([])
    const [meetData, setMeetData] = useState<DocumentData>(new Document);
    const [selectFilter, setSelectFilter] = useState('')
    const [searchFilter, setSearchFilter] = useState('')

    const onUpdateAnn = (ann: Announcement) => {
        setAnnList(prevAnnList => prevAnnList.map(item => item.id === ann.id ? ann : item))}

    const fetchAnnList = async () => {
      await getDocs(collection(db, "Meets"))
      .then((querySnapshot) => {
          const newData = querySnapshot.docs.map((doc) =>({...doc.data(), id: doc.id}));
          setMeetData(newData);
      })
    }

    const handleChangeSearchFilter = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchFilter(event.target.value)
    }

    useEffect(() => {
        fetchAnnList()
    }, [selectFilter, searchFilter, annList])

    return (
      <div className="page-layout">
          <div className='app-bar'>
            <MeetAppbar></MeetAppbar>
          </div>
          <div className="info-layout">
           <div className="page-header">
            <h1>รายการการประชุม</h1>
           </div>
           <div className="card-layout">
            <TextField sx={{ m: 2, minWidth: 120 }} label="Search" placeholder="Topic" variant="outlined" value={searchFilter} onChange={handleChangeSearchFilter} />
            <h4 style={{fontFamily:'Kanit',fontWeight:600,marginBottom:10}}>การประชุมที่ยังไม่ถึง</h4>
            <hr></hr>
            {meetData.length 
            ?
            <div className="ann-con">
              <Grid container sx={{ p: 2 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 10 }}>
                {meetData.filter((announcement: Announcement) => !announcement.end).map((announcement: Announcement, index: Key) => (
                  <Grid item xs={2} sm={4} md={4} lg={3} xl={2} key={index}>
                    <MeetInfoCard announcement={announcement} onUpdateAnnouncement={onUpdateAnn}></MeetInfoCard>
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
              {meetData.length
              ?
              <div className="ann-con">
                <Grid container sx={{ p: 2 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 10 }}>
                  {meetData.filter((announcement: Announcement) => announcement.end).map((announcement: Announcement, index: Key) => (
                <Grid item xs={2} sm={4} md={4} lg={3} xl={2} key={index}>
                  <MeetInfoCard announcement={announcement} onUpdateAnnouncement={onUpdateAnn}></MeetInfoCard>
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
        </div>
      </div>
  )
}

export default MeetInfoList