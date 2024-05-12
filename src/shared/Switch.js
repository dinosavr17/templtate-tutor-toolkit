import * as React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';

const StyledIconWrapper = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const IOSSwitch = styled(({ lightColor, darkColor, status, ...props }) => (
    <Switch
        focusVisibleClassName=".Mui-focusVisible"
        disableRipple
        {...props}
        checked={status !== 'not_started'}
        // icon={<StyledIconWrapper><CheckCircleOutlineIcon /></StyledIconWrapper>} // Иконка, когда Switch выключен
        checkedIcon={<StyledIconWrapper>
            {status === 'done' &&
            <StarRoundedIcon style={{ color: '#F1C40F' }}/>
            }
            {status === 'to_repeat' &&
            <LoopRoundedIcon style={{ color: '#392c26' }}/>
            }
        </StyledIconWrapper>} // Иконка, когда Switch включен
    />
))(({ theme, lightColor, darkColor }) => ({
    // Стили вашего Switch компонента
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: theme.palette.mode === 'dark' ? darkColor : lightColor,
                opacity: 1,
                border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
                backgroundColor: theme.palette.grey[700],
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color:
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
    },
}));
