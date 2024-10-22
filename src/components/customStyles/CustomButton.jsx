import React from 'react';
import Button from '@mui/material/Button';

const commonStyles = {
    fontFamily: "montserrat-regular",
  }; 
const CustomButton = ({ variant, color, onClick, size, width, children, disabled }) => {
  return (
    <Button
      variant="outlined"
      color={color}
      onClick={onClick}
      size="small"
      disabled={ disabled}
      sx={{
        textTransform:"capitalize",
        width:"100px",
        padding:"6px",
        ...commonStyles,
       
        '&:hover': {
         
          backgroundColor: "#016699",
          color: "white",
        },
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
