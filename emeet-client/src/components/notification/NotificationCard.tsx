import { Button, Card, CardActionArea, CardHeader, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Close } from '@mui/icons-material/';
import { useState } from "react";

import Announcement from "../../models/Announcement";

interface Prop {
    announcement: Announcement
}

function NotificationCard(props: Prop) {
    const announcement = props.announcement;
    const [popup, setPopup] = useState(false);

    return(
        
        <Box sx={{ position: 'relative' }} color={announcement.end ? "success" : "disabled"}>
            <Card sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }}>
                <CardActionArea onClick={() => setPopup(true)}>
                    <CardHeader
                        sx={{ height: 100 ,width: 700}}
                        title={announcement.topic}
                        subheader={announcement.date}
                    />
                </CardActionArea>
            </Card>
            <Dialog PaperProps={{ sx: { minWidth: "50%", maxHeight: "100%" } }} open={popup} onClose={() => setPopup(false)}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {announcement.topic}
          </Typography>
          <IconButton onClick={() => setPopup(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          
          <Typography variant="h6" sx={{ mt: 1 }}>
            ประชุมวันที่: {announcement.date}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            สถานที่: {announcement.place}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            ระเบียบการวาระประชุม: {announcement.agendaRule}
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            วาระการประชุม
          </Typography>
          <Button>
            1. เรื่องแจ้งเพื่อทราบ
          </Button>
          <Typography></Typography>
          <Button>
            2. รับรองรายงานการประชุม
          </Button>
          <Typography></Typography>
          <Button>
            3. เรื่องสืบเนื่องจากการประชุมครั้งที่แล้ว
          </Button>
          <Typography></Typography>
          <Button>
            4. เรื่องค้างเพื่อพิจารณา
          </Button>
          <Typography></Typography>
          <Button>
            5. เรื่องเสนอเพื่อพิจารณาใหม่
          </Button>
          <Typography></Typography>
          <Button>
            6. เรื่องอื่น
          </Button>
          <Typography></Typography>
          <Button>
            7. การเชิญประชุม
          </Button>
        </DialogContent>
      </Dialog>
        </Box>
        
    )
}

export default NotificationCard;