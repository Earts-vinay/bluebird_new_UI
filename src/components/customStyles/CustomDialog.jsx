import React from 'react';
import {
  Dialog,
  Typography,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const CustomDialog = ({
  open,
  onClose,
  title,
  commonStyles,
  children,
  width
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      sx={{
        height: "700px", 
      }}
      PaperProps={{ sx: { width: {width} } }}
    >
      <Box 
      sx={{  display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor:" #fbf3f0",
        paddingY:"15px",
        paddingX:"20px"
        }}>
      <Typography color="#013a6f" sx={commonStyles}>
        {title}
      </Typography>
      <CloseIcon
        sx={{color:"#013a6f"}}
        onClick={() => {
          onClose();
        }}
      />
        </Box>
        {children}
    </Dialog>
  );
};

export default CustomDialog;
