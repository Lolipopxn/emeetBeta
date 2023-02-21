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
        meetDate: meetDateRef.current?.value
      })
      Toast.fire({
        icon: 'success',
        title: 'successfully !!'
      })
    }
  }

  return (
    <Box>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="Topic" variant="outlined" defaultValue={props.announcement.topic} inputRef={topicRef} />
      </div>
      <div style={{ margin: 20 }}>
        <TextField fullWidth sx={{ minWidth: 120 }} label="Meet Date (xx-xx-xxxx)" variant="outlined" defaultValue={props.announcement.meetDate} inputRef={meetDateRef} />
      </div>
      <div style={{ margin: 20 }}>
        <Button variant="contained" sx={{ mb: 1, float: 'right', verticalAlign: 'bottom' }} onClick={onSubmit}>{props.announcement.id ? 'Update' : 'Create'}</Button>
      </div>
    </Box>
  )
}

export default AnnouncementForm;