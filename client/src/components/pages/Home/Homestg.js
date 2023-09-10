import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { COLORS } from '../../../utils/colors';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { setShowAlert, setAlertInfo } from '../../../redux/alertSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CardContent } from '@mui/material';
import Decrypt from './Decrypt';
import Encrypt from './Encrypt';
import PublicAuth from './PublicAuth';
import { Encode, Decode } from './Steg';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export const HomeSteg = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const { id } = useParams();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    dispatch(
      // redux with alert
      setAlertInfo({
        severity: 'success',
        message: 'Wellcom To SafeSteg 🫡',
      })
    );
    dispatch(setShowAlert(true));
    setTimeout(() => dispatch(setShowAlert(false)), 3000);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div>
      <Card sx={{ borderRadius: '0px' }}>
        <CardMedia
          sx={{
            height: 300,
            width: '100%',
            objectFit: 'cover',
          }}
          image="/imgs/backg.jpg"
          title="Cover"
        />
        <CardContent
          style={{
            position: 'absolute',
            right: '50%',
            transform: 'translateX(50%)',
            top: '12%',
            backgroundColor: COLORS.mainColor,
            opacity: 0.9,
            padding: '28px 50px',
            borderRadius: '5px',
            'box-shadow': '0 0 10px',
          }}
        >
          <Typography fontSize={35} fontWeight={700} color="white">
            SafeSteg
          </Typography>
        </CardContent>
      </Card>
      <AppBar
        sx={{
          backgroundImage: 'linear-gradient(to right bottom, #49caff, #003e81)',
        }}
        position="static"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="warning"
          textColor="inherit"
          scrollButtons={true}
          variant="scrollable"
          // scrollButtons="auto"
          // centered
          aria-label="full width tabs example"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <Tooltip title="Encode a text in a image">
            <Tab
              disabled={false} //later
              label="Encode"
              {...a11yProps(0)}
            />
          </Tooltip>
          <Tooltip title="decode a message to extract the message">
            <Tab
              disabled={false} //later
              label="Decode"
              {...a11yProps(1)}
            />
          </Tooltip>
          <Tooltip title="Public Authority">
            <Tab
              disabled={false} //later
              label="Authority"
              {...a11yProps(2)}
            />
          </Tooltip>
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <Encrypt />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Decrypt />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <PublicAuth />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
};
