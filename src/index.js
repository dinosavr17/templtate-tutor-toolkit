import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from '../src/context/AuthContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

ReactDOM.render(
    <BrowserRouter>
        <AuthProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <App />
            </LocalizationProvider>
        </AuthProvider>
    </BrowserRouter>,
    document.getElementById('root')
);