import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useRef } from "react";
import Announcement from "../models/Announcement";
import Swal from 'sweetalert2'

interface Prop {
  announcement: Partial<Announcement>
  callbackFn: (ann: Partial<Announcement>) => void
}

function AnnouncementForm(props: Prop) {
  const topicRef = useRef<HTMLInputElement>(null);
  const meetDateRef = useRef<HTMLInputElement>(null);
  const detailRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const agenRuleRef = useRef<HTMLInputElement>(null);

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

  const onSubmit = () => {
    if (meetDateRef.current?.value.match(/^\d{2}-\d{2}-\d{4}$/)){
      props.callbackFn({
        id: props.announcement.id,
        topic: topicRef.current?.value,
        meetDate: meetDateRef.current?.value,
        detail: detailRef.current?.value,
        place: placeRef.current?.value,
        agendaRule: agenRuleRef.current?.value,
      })
      Toast.fire({
        icon: 'success',
        title: 'เพิ่มรายการประชุมสำเร็จ !!'
      })
    }
  }

  return (
    <Box>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="หัวข้อการประชุม" placeholder="คัดเลือกตัวแทนนักศึกษา" variant="outlined" defaultValue={props.announcement.topic} inputRef={topicRef} />
      </div>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="วันที่ประชุม" placeholder="xx-xx-xxxx" variant="outlined" defaultValue={props.announcement.meetDate} inputRef={meetDateRef} />
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
        <Button variant="contained" sx={{ mb: 1, float: 'right', verticalAlign: 'bottom' }} onClick={onSubmit}>{props.announcement.id ? 'แก้ไข' : 'ยืนยัน'}</Button>
      </div>
    </Box>
  )
}

export default AnnouncementForm;