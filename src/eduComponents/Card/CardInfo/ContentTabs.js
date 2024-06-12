import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import './TabsContent.css';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import FilePresentOutlinedIcon from '@mui/icons-material/FilePresentOutlined';

export default function IconLabelTabs({onChange, activeTab }) {
    const [value, setValue] = React.useState('homework');

    const handleChange = (event, newValue) => {
        onChange(newValue);
        setValue(newValue);
    };

    return (
        <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
            <Tab value="lesson" icon={<AutoStoriesOutlinedIcon />} label="Материалы урока" />
            <Tab value="homework" icon={<FilePresentOutlinedIcon />} label="Домашняя работа" />
            <Tab value="repetition" icon={<LoopOutlinedIcon />} label="Повторение" />
        </Tabs>
    );
}