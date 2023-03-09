import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef, useState } from "react";
import Announcement from "../models/Announcement";

interface Prop {
  announcement: any
  callbackFn: (ann: any) => void
}

function AnnouncementForm(props: Prop) {
  const [ popup, setPopup] = useState(true);
  const topicRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const agenRuleRef = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    if (dateRef.current?.value.match(/^\d{2}-\d{2}-\d{4}$/)){
      props.callbackFn({
        id: props.announcement.id,
        topic: topicRef.current?.value,
        date: dateRef.current?.value,
        detail: detailRef.current?.value,
        place: placeRef.current?.value,
        agendaRule: agenRuleRef.current?.value,
      })
    }
  }

  return (
    <Box>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="หัวข้อการประชุม" placeholder="คัดเลือกตัวแทนนักศึกษา" variant="outlined" defaultValue={props.announcement.topic} inputRef={topicRef} />
      </div>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="วันที่ประชุม" placeholder="xx-xx-xxxx" variant="outlined" defaultValue={props.announcement.date} inputRef={dateRef} />
      </div>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 300 }} label="รายละเอียดการประชุม" placeholder="ทำการประชุมเพื่อคัดเลือกนักศึกษา" variant="outlined" defaultValue={props.announcement.detail} inputRef={detailRef} />
      </div>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="สถานที่ประชุม" placeholder="หัวหุ่น" variant="outlined" defaultValue={props.announcement.place} inputRef={placeRef} />
      </div>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 300 }} label="กฏวาระ" placeholder="1/2566" variant="outlined" defaultValue={props.announcement.agendaRule} inputRef={agenRuleRef} />
      </div>
      <div style={{ margin: 20 }}>
        <Button variant="contained" sx={{ mb: 1, float: 'right', verticalAlign: 'bottom',fontFamily:'Kanit',fontSize:18,borderRadius:8 }} onClick={onSubmit}>{props.announcement.id ? 'แก้ไข' : 'ยืนยัน'}</Button>
      </div>
    </Box>
  )
}

export default AnnouncementForm;