import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteAction = ({ handleDelete,row, deleteType }) => {
  return (
    <MenuItem key="delete" onClick={()=>handleDelete([row.original._id],deleteType)}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        Delete
    </MenuItem>
  );
};

export default DeleteAction;
