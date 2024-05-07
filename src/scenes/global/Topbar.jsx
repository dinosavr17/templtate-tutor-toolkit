import {Box, CircularProgress, IconButton, useTheme} from "@mui/material";
import { useContext, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from "../../api/axios";
import {useState} from "react";
import styled from "styled-components";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export const NotificationContainer = styled.div`
  border: #a6a4a4 1px solid;
  border-right: none;
  border-left: none;
  border-top: none;
  margin: 0;
`;
export const NotificationsWrapper = styled.div`
  background-color: white;
  padding: 0;
  border-radius: 8px !important;
`;

export const NotificationsContent = styled.div`
 display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  flex-wrap: wrap;
`;
const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);
    const getNotificationsData = async () => {
      try {
        const response = await axios.get('api/notifications', {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
          },
        });
        setUserNotifications(response?.data);
        console.log(response?.data, 'уведомления');
      } catch (err) {
      }
    }
    const handleAcceptInvite = async(code) => {
      try {
        const response = await axios.post('api/education_plan/invite_authorized_student/',
            JSON.stringify(
                {
                  invite_code: code
                }),
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
              },
              withCredentials: true
            }
        );

        console.log(response, 'resp');
      } catch (err) {
      }

    }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    getNotificationsData();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <div>
          <IconButton aria-describedby={id} variant="contained" onClick={handleClick}>
            <NotificationsOutlinedIcon />
          </IconButton>
          <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              sx={{backdropFilter: 'blur(2px)'}}
          >
            {userNotifications.length > 0 &&
            <NotificationsWrapper>
              <Typography sx={{ color: 'primary', backgroundColor: '#f5f5f5 !important', padding: '10px', fontSize: '16px', border: 'none', boxShadow: '0px 5px 10px 2px rgba(34, 60, 80, 0.2)', fontWeight: '500'}}>Уведомления</Typography>
              {userNotifications.map((notification) => (
                  <NotificationContainer key={notification.id} style={{color: 'primary'}}>
                    <NotificationsContent>
                      {notification.type === 'info' &&
                      <InfoOutlinedIcon color="secondary"/>
                      }
                      {notification.type === 'invite' &&
                      <PersonAddOutlinedIcon color="success"/>
                      }
                      {notification.type === 'canceling' &&
                      <CancelOutlinedIcon color="error"/>
                      }
                      <Typography sx={{ marginLeft: '8px' }}>{notification.text}</Typography>
                      {notification.type === 'invite' && <div>
                        <Button onClick={() => {handleAcceptInvite(notification.content)}} color='success' sx={{ textTransform: 'none'}}>Принять</Button>
                        <Button color='error' sx={{ textTransform: 'none'}}>Отклонить</Button>
                      </div>}
                    </NotificationsContent>
                  </NotificationContainer>
              ))}
            </NotificationsWrapper>
            }
          </Popover>
        </div>
      </Box>
    </Box>
  );
};

export default Topbar;
