import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from '@mui/icons-material/School';
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import StudentCard from "../../components/StudentCard";
import {VerifiedUser} from "@mui/icons-material";
import Caption from "../../components/Caption";

const StudentsMainPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const studentData = [
    {
      name: 'Павел',
      lastName: 'Дуров',
      age: 9,
      discipline: ['Python'],
      status: 'active',
      parent: null
  },
    {
      name: 'Марк',
      lastName: 'Цукерберг',
      age: 60,
      discipline: ['ЕГЭ Информатика'],
      status: 'inactive',
      parent: null
    },
    {
      name: 'Стив',
      lastName: 'Джобс',
      age: 10,
      discipline: ['ОГЭ Математика', 'ОГЭ Информатика'],
      status: 'inactive',
      parent: {
        name: 'Mum Jobs',
      }
    },
]



    return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Caption title="Прогресс"
                subtitle="Карточки студентов - содержат информацию о дисциплинах и статусе студента.
        для перехода в пространство студента - кликните по карточке" />
        <Box>
          {/*<Button*/}
          {/*  sx={{*/}
          {/*    backgroundColor: colors.blueAccent[700],*/}
          {/*    color: colors.grey[100],*/}
          {/*    fontSize: "14px",*/}
          {/*    fontWeight: "bold",*/}
          {/*    padding: "10px 20px",*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <DownloadOutlinedIcon sx={{ mr: "10px" }} />*/}
          {/*  Download Reports*/}
          {/*</Button>*/}
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StudentCard personalInfo={studentData[0]} icon={
            <SchoolIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }/>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StudentCard personalInfo={studentData[1]} icon={
            <SchoolIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }/>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StudentCard personalInfo={studentData[2]} icon={
            <SchoolIcon
              sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
            />
          }/>
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Revenue Generated
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                $59,342.32
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                </Typography>
                <Typography color={colors.grey[100]}>
                </Typography>
              </Box>
              <Box color={colors.grey[100]}></Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
              </Box>
            </Box>
          ))
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentsMainPage;
