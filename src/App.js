import {useEffect, useState} from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import StudentsMainPage from "./scenes/studentsMain";
import {EducationalPlan} from "./scenes/educationDashboard/EducationalPlan.tsx"
import Example from "./eduComponents/Example";
import Register from "./Authentification/Register.jsx";
import Login from "./Authentification/LoginPage";
import RequireAuth from "./RequireAuth";
import PlansStorage from "./scenes/educationDashboard/PlansStorage";
import PreloginPage from "./Authentification/PreloginPage";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('userData')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className='app'>
          {isLoggedIn &&
          <Sidebar isSidebar={isSidebar}/>
          }
          <main className='content'>
            {isLoggedIn &&
            <Topbar setIsSidebar={setIsSidebar}/>
            }
            <Routes>
              <Route path="/prelogin" element={<PreloginPage/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/login" element={<Login/>} />
              <Route element={<RequireAuth/>}>
              <Route path="/main" element={<StudentsMainPage />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/edu" element={<PlansStorage />} />
              <Route path="/eduNewNew" element={<Example/>} />
              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
