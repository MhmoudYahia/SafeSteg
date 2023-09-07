import './NavBar.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import GroupIcon from '@mui/icons-material/Group';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { TextField, Button } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { COLORS } from '../../../utils/colors';
import { fetchWrapper } from '../../../utils/fetchWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useFetch } from '../../../utils/useFetch';
import { clearUser, setUser, setLoading } from '../../../redux/userSlice';
import { setAlertInfo, setShowAlert } from '../../../redux/alertSlice';
import { setReceiver, setShowChat } from '../../../redux/chatSlice';

export const Navbar = () => {
  const dispatch = useDispatch();
  const his = useNavigate();
  // const { showChat } = useSelector((state) => state.chat);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [showPass1, setShowPass1] = React.useState(false);
  const [showPass2, setShowPass2] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [currentPassword, setCurrentPassword] = React.useState('');
  // const [showContacts, setShowContacts] = React.useState(false);
  const [user, setUserInfo] = React.useState(null);

  const { status, data, message, loading } = useFetch(
    'http://localhost:2024/api/v1/users/me'
  );

  React.useEffect(() => {
    dispatch(setLoading(loading));
  }, [loading]);

  React.useEffect(() => {
    if (status === 'success') {
      console.log(data);
      setUserInfo(data.currentUser);
      dispatch(setUser(data.currentUser));
    }
  }, [status]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDialogOpen = (id) => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleToggleShowPass2 = () => {
    setShowPass2(!showPass2);
  };
  const handleToggleShowPass1 = () => {
    setShowPass1(!showPass1);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { message, data, status } = await fetchWrapper(
      `/users/changePassword`,
      'PATCH',
      JSON.stringify({
        currentPassword,
        newPassword,
        confirmNewPassword: confirmPassword,
      }),
      { 'Content-Type': 'application/json' }
    );

    if (status === 'success') {
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Your Password has been Changed successfully 🫡',
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
      handleDialogClose();
    } else {
      dispatch(
        setAlertInfo({
          severity: 'error',
          message,
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }
  };
  const handleLogOut = async () => {
    const { message, data, status, loading } = await fetchWrapper(
      '/users/signout',
      'PATCH'
    );
    if (status === 'success') {
      dispatch(clearUser());
      dispatch(
        setAlertInfo({
          severity: 'success',
          message: 'Logged Out Successfully😟',
        })
      );
      his('/signin');
      window.location.reload(true);
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 3000);
    } else {
      dispatch(
        setAlertInfo({
          severity: 'error',
          message,
        })
      );
      dispatch(setShowAlert(true));
      setTimeout(() => {
        dispatch(setShowAlert(false));
      }, 5000);
    }
  };

  if (loading) {
    return (
      <Skeleton animation="wave" height="50px" style={{ margin: '0 20px' }} />
    );
  }

  return (
    <div className="navbar">
      <React.Fragment>
        <Box>
          <Link to="/">
            <Tooltip title="Home">
              <Typography
                className="class-manager"
                sx={{
                  minWidth: 100,
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  color: 'white',
                }}
              >
                SafeSteg
              </Typography>
            </Tooltip>
          </Link>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            gap: 1,
          }}
        >
          {!user && (
            <>
              <Link to="/signin">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    padding: '5px 15px',
                    backgroundColor: COLORS.mainColor,
                  }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: '20px',
                    padding: '5px 15px',
                    backgroundColor: COLORS.mainColor,
                  }}
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {user && (
            <>
              <Typography sx={{ minWidth: 100, fontWeight: 500 }}>
                {user.name}
              </Typography>

              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar
                    sx={{ width: 39, height: 39 }}
                    src={`/imgs/users/${user.photo}`}
                  >
                    M
                  </Avatar>
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Link to="/me" style={{ color: '#111' }}>
            <MenuItem>
              <Avatar sx={{ backgroundColor: COLORS.mainColor }} /> Profile
            </MenuItem>
          </Link>
          <MenuItem onClick={handleDialogOpen}>
            <LockIcon sx={{ marginRight: 1, color: COLORS.mainColor }} /> Change
            Password
          </MenuItem>

          {user && user.role === 'admin' && (
            <>
              <Divider />
              <Typography padding="0 19px" fontWeight={600} color="#709003">
                Admin
              </Typography>
            </>
          )}

          <Divider />
          <Link to="/signup" style={{ color: '#111' }}>
            <MenuItem>
              <ListItemIcon>
                <PersonAdd fontSize="small" sx={{ color: COLORS.mainColor }} />
              </ListItemIcon>
              Add another account
            </MenuItem>
          </Link>
          {
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: COLORS.mainColor }} />
              </ListItemIcon>
              Settings
            </MenuItem>
          }
          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <Logout fontSize="small" sx={{ color: COLORS.mainColor }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </React.Fragment>

      {/* Dialog for deleting rows */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle className="dialog-title">Delete Quiz</DialogTitle>
        <DialogContent>
          <Typography variant="h5" gutterBottom align="center">
            Change Password
          </Typography>
          <form>
            <TextField
              label="Current Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type={showPass2 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleShowPass2}
                      edge="end"
                      style={{ width: '50px' }}
                    >
                      {showPass2 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type={showPass1 ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleShowPass1}
                      edge="end"
                      style={{ width: '50px' }}
                    >
                      {showPass1 ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleChangePassword} variant="contained">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
