import React, { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// Import the selectToken function from redux store
import { selectToken } from '../redux/apiResponse/loginApiSlice';

const BaseUrl = process.env.REACT_APP_API_URL;

const StyledContainer = styled(Container)({
    marginTop: theme => theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const StyledForm = styled('form')({
    width: '100%',
    marginTop: theme => theme.spacing(1),
});

const StyledButton = styled(Button)({
    margin: theme => theme.spacing(3, 0, 2),
});

const ActiveUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeCode, setActiveCode] = useState('');
    const [password, setPassword] = useState(''); 
    console.log(password);
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const token = useSelector(selectToken);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const activeCodeParam = searchParams.get('activeCode');
        if (activeCodeParam) {
            setActiveCode(activeCodeParam);
        }
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('activeCode', activeCode);
            formData.append('password', password);
            formData.append('confirm_password', confirmPassword);

            const response = await axios.post(
                `${BaseUrl}/api/user/activate`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const responseData = response.data;
            if (responseData.code === 200) {
                toast.success("Your Email has been activated");
                navigate('/login'); 
            } else {
                toast.error(responseData.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <StyledContainer maxWidth="xl">
            <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
                <Box width="50%" >
                    <Box width="80%" >
                        <img
                            src={process.env.PUBLIC_URL + "/assets/logos/saplogo.svg"}
                            alt="Logo"
                            style={{ objectFit: "contain" }}
                        />
                        <Typography variant="h3" mt={2}>Welcome to <br /> The Circle of Security</Typography>
                        <Typography mt={2}>Our AI platform uses computer vision to provide home security, elder care, and commercial applications. It tracks movements of cars, license plates, and people, quickly warning of any questionable activity.</Typography>
                    </Box>
                </Box>
                <Box sx={{
                    backgroundColor: "linear-gradient(119deg, #ebeffa 2%, #e8ebfd 30%, #f0ecf9 51%, #efeefb 70%, #eef7ff 100%)", boxShadow: "0 0 15px 0 rgba(36, 101, 233, 0.3)",
                    border: "solid 2px #fff", padding: "50px", borderRadius: "10px", marginX: "10px", width: "30%"
                }}>
                    <Typography component="h1" variant="h5">
                        Confirm Password
                    </Typography>
                    <Typography> Please Enter New Password</Typography>
                    <StyledForm onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="newPassword"
                            label="New Password"
                            type="password"
                            autoComplete="new-password"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ textTransform: "capitalize", paddingY: "10px", marginY: "10px" }}
                        >
                            Save
                        </StyledButton>
                    </StyledForm>
                </Box>
            </Box>
        </StyledContainer>
    );
}

export default ActiveUser;
