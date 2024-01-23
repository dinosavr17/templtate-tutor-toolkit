import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import axios from "../../api/axios";
import {useEffect, useState} from "react";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [users, setUsers] = useState([]);
  useEffect(() => {
      getUsers();
      console.log(users, users);
  }, []);
    const getUsers = async (e) => {

        try {
            const response = await axios.get('api/education_plan/get_users_data',
                {

                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://localhost:3000',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("userData")).accessToken}`,
                    },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            setUsers(response?.data?.plans);

        } catch (err) {
            if (!err?.response) {
                // setLoadingStatus('error');
            }
        }
    };
    // discipline
    //     :
    //     "Матан"
    // first_name
    //     :
    //     "Иван"
    // id
    //     :
    //     1
    // last_name
    //     :
    //     "Иванов"
    // status
    //     :
    //     "active"
    const handleCellEditCommit = (params) => {
        const updatedUsers = users.map(user => {
            if (user.id === params.id) {
                return { ...user, status: params.value };
            }
            return user;
        });

        setUsers(updatedUsers);
    };


  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "first_name", headerName: "Имя" },
    {
      field: "last_name",
      headerName: "Фамилия",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "discipline",
      headerName: "Дисциплина",
      // type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "status",
      headerName: "Статус",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Студенты"
        subtitle="Список студентов со статусами"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
