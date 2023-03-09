import { Typography, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect, Key } from "react";

import Announcement from "../../models/Announcement";
import NotificationCard from "./NotificationCard";

import { db } from "../../fireBaseConfig"
import { collection, getDocs, DocumentData } from "firebase/firestore";

function NotificationPopup() {
  const [annList, setAnnList] = useState<DocumentData>(new Document);

  const fetchAnnList = async () => {
    await getDocs(collection(db, "Meets"))
    .then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) =>({...doc.data(), id: doc.id}));
        setAnnList(newData);
    })
  }

  useEffect(() => {
      fetchAnnList();
  });

  return (
    <Box sx={{ 
      width: '100%', 
      height: 1000, 
      backgroundImage: `url('/image2.jpg')`, 
      backgroundSize: '100% 100%',    
      backgroundRepeat: 'no-repeat' 
    }}>
      <div>
        {annList.length
          ?
          <Grid
            container spacing={2}
          >
            {annList.filter((announcement: Announcement) => !announcement.end == true).map((announcement: Announcement, index: Key) => 
              <Grid item mx={10} key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', width: 660}}>
                  <NotificationCard announcement={announcement}></NotificationCard>
              </Grid>
            )}

          </Grid>
          :
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', minHeight: 500, width: 450}}>
            <Typography variant='body2' color='text.secondary'>ไม่พบรายการการประชุม</Typography>
          </Box>
        }
      </div>
    </Box>
  );
}

export default NotificationPopup;