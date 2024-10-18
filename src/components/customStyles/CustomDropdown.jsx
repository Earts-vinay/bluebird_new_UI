import React from 'react';
import { TextField, MenuItem } from '@mui/material';

const CustomDropdown = ({ label, value, onChange, sx, children }) => {
  return (
    <TextField
      label={label}
      fullWidth
      margin="dense"
      select
      value={value}
      onChange={onChange}
      sx={{
        "&:hover .MuiOutlinedInput-root": {
            "& > fieldset": { border: '1px solid #2465e9'},
          },
        "& .MuiOutlinedInput-root": {
            "& > fieldset": { border: "solid 1px #2465e9"},
          },}}
      InputProps={{ sx: { height: '50px' }  }}
    >
      {children}
      
    </TextField>
  );
};

export default CustomDropdown;
