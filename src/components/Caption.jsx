import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";
import {Lightbulb} from "@mui/icons-material";

const Caption = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color='black'//Нужно подкорректировать под цветовую палитру
        sx={{
          border: '1px solid',
          borderColor: colors.grey[100],
          backgroundColor: colors.grey[100],
          borderRadius: '5px',
          padding: '20px',
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Caption;
