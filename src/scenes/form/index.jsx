import {Box, Button, CircularProgress, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "../../api/axios";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import React, {useEffect, useState} from "react";
import {StatusContainer, StatusOverlay} from "../../Authentification/Register";
import Portal, {createContainer} from "../../eduComponents/Board/Portal.ts";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
    copyIcon: {
        cursor: 'pointer',
        color: 'green', // Set the default color
        transition: 'color 0.3s ease', // Add a transition for smooth color change
        '&:hover': {
            color: 'blue', // Change the color on hover
        },
    },
}));

const Form = () => {
    const classes = useStyles();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [isMounted, setMounted] = useState(false);
  const MODAL_CONTAINER_ID = 'modal-container-id';
  const [statusShown, setStatusShown] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('unset');
  const [personalLink, setPersonalLink] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Ссылка приглашение - скопирована');
            setIsCopied(true);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

  useEffect(() => {
    createContainer({id: MODAL_CONTAINER_ID});
    setMounted(true);
  }, []);
  const exampleUrl='http://фронтовыйUrl/register/?status=inactive&firstName=Шилова&firstName=Галина&discipline=Математика&inviteCode=12345'

  const handleFormSubmit = async (values, { resetForm }) => {
   const {firstName, lastName, email, discipline } = values;
    setStatusShown(true);
    setLoadingStatus('loading');
    try {
      const response = await axios.post('api/education_plan/',
          JSON.stringify({
            discipline: discipline,
            email: email,
            student_first_name: firstName,
            student_last_name: lastName
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
      if (response.status === 201) {
        const {is_active, tutor, discipline, invite_code} = response.data;
        if (!is_active) {
            setPersonalLink(`http://localhost:3000/register/?inviteCode=${invite_code}`);
        } else {
            setPersonalLink('Студент уже зарегистрирован на платформе. ' +
                'Ему необходимо авторизоваться и принять приглашение.')
        }
          console.log(personalLink);
          setLoadingStatus('success');
        resetForm();
      }
      else setLoadingStatus('error');
    } catch (err) {
      setLoadingStatus('error');
    }
  }
  const renderStatusContent = () => {
    const content = {
      unset: () => {
        return;
      },
      loading: () => {
        return <CircularProgress
            sx={{height: '100px !important', width: '100px !important'}}
            color='secondary'/>
      },
      success: () => {
        return <Alert
            onClose={() => {
              setStatusShown(false);
            }}
            severity="success">
          <AlertTitle>Успешно</AlertTitle>
          Ссылка для подключения студента
            <br/><strong>{personalLink}</strong>

            <ContentCopyIcon className={classes.copyIcon} onClick={() => {handleCopyClick(personalLink)}}/>
        </Alert>
      },
      error: () => {
        return <Alert
            onClose={() => {
              setStatusShown(false);
            }}
            severity="error"
        >
          <AlertTitle>Ошибка</AlertTitle>
          Произошла ошибка во создания студента
          — <strong> Попробуйте еще раз!</strong>
        </Alert>
      },
    };

    return content[loadingStatus]();
  };

  return (
    <Box m="20px">
      <Header title="Добавить студента" subtitle="Студент может подключиться по реферальной ссылке" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Имя"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Фамилия"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Дисциплина"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.discipline}
                name="discipline"
                error={!!touched.discipline && !!errors.discipline}
                helperText={touched.discipline && errors.discipline}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Создать студента
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      {isMounted &&
          <Portal id={MODAL_CONTAINER_ID}>
            {statusShown &&
                <StatusOverlay>
                  <StatusContainer style={{display: 'flex'}}>
                    {renderStatusContent()}
                  </StatusContainer>
                </StatusOverlay>
            }
          </Portal>
      }
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("Поле необходимо заполнить"),
  lastName: yup.string().required("Поле необходимо заполнить"),
  email: yup.string().email("Некорректный email").required("Поле необходимо заполнить"),
  discipline: yup.string().required("Поле необходимо заполнить"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  discipline: "",
};

export default Form;
