import React from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

const commonStyles = { fontFamily: "montserrat-regular" };



const SearchField = ({ value, onChange,label }) => {
  return (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      style={{
        marginBottom: "20px",
        ...commonStyles,
      }}
      size="small"
      value={value}
      onChange={onChange}
      sx={{
        "&:hover .MuiOutlinedInput-root": {
            "& > fieldset": { border: '1px solid #2465e9'},
          },
        "& .MuiOutlinedInput-root": {
            "& > fieldset": { border: "solid 1px #2465e9"},
          },
        
        }}
        InputLabelProps={{
            style: {fontFamily: 'montserrat-regular', fontSize: '14px' }, // Change this to your desired font size
          }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon sx={{ color: "#2465e9" }} />
          </InputAdornment>
        ),
      }}
      inputProps={{ autoComplete: "off" }}
     
    />
  );
};

export default SearchField;
