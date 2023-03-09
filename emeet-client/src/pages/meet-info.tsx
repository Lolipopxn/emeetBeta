import { ChangeEvent, Key, useEffect, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import MeetInfoCard from '../components/meetinfo-card';
import Announcement from '../models/Announcement';
import Repo from '../repositories'
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
          {meetData.length
            ?
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 10}}>
              {meetData.map((announcement: Announcement, index: Key | null | undefined) => 
                  <Grid item xs={2} sm={4} md={4} lg={3} xl={2} key={index}>
                      <MeetInfoCard announcement={announcement} onUpdateAnnouncement={onUpdateAnn}></MeetInfoCard>
                  </Grid>
              )}
            </Grid>
            :
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400}}>
              <Typography variant='body2' color='text.secondary'>ไม่พบรายการการประชุม</Typography>
            </Box>
          }
          </div>
        </div>
      </div>
  )
}

export default MeetInfoList