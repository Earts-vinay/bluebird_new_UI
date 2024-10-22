import React from 'react';
import TextField from '@mui/material/TextField';

const CustomTextField = ({ label,error,helperText, value,name, onChange,required,readOnly,...rest }) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      name={name}
      error = {error}
      helperText={helperText}
      required={required} 
      margin="dense"
      size='small'
      autoComplete="off" 
      variant="outlined"
      fullWidth
      inputProps={{ readOnly: readOnly }}
      sx={{
        "&:hover .MuiOutlinedInput-root": {
            "& > fieldset": { border: '1px solid #bcccd6'},
          },
        "& .MuiOutlinedInput-root": {
            "& > fieldset": { border: "solid 1px #bcccd6"},
          },}}
      InputLabelProps={{
        style: { fontFamily: 'montserrat-regular',fontSize:"14px" },
      }}
      InputProps={{
        style: {
           
          fontFamily: 'montserrat-regular',
          
        },
      }}
      {...rest}
    />
  );
};

export default CustomTextField;
