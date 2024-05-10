import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StudentCard = ({ personalInfo, icon }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="20px">
      <Box display="flex" justifyContent="flex-start">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {personalInfo.first_name}&#160;{personalInfo.last_name}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px" sx={{flexDirection: 'column'}}>
        <Typography variant="h4" sx={{ color: colors.blueAccent[300] }}>
            {personalInfo.discipline}
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {personalInfo.status === 'active'?
            <Typography>
            Активный
          </Typography> :
            <Typography
              sx={{ color: colors.redAccent[500] }}
            >
              Отключен
            </Typography> }
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentCard;
