import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Alert from './utils/alert';
import { Stack, Skeleton } from '@mui/material';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ForgetPassword } from './components/auth/ForgetPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { Page404 } from './utils/Page404';
import { useSelector } from 'react-redux';
import { Navbar } from './components/pages/NavBar/NavBar';
import { HomeSteg } from './components/pages/Home/Homestg';


function App() {
  const { showAlert, alertInfo } = useSelector((state) => state.alert);
  // const { showChat, receiver } = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user.userData);
  // const loading = useSelector((state) => state.user.loading);

  return (
    <div className="App">
      {showAlert && (
        <Alert
          severity={alertInfo.severity}
          title={alertInfo.title}
          message={alertInfo.message}
        />
      )}
      <Router>
        {/* {showChat && <ChatBar sender={user} receiver={receiver} />} */}
        {false && (
          <Stack spacing={2} margin={2}>
            <>
              <Skeleton animation="wave" height={200} variant="rounded" />
              <Skeleton animation="wave" variant="rounded" />
              <Skeleton animation="wave" variant="rounded" />
            </>
          </Stack>
        )}
        <Navbar />

        {true && (
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route
              path="/resetpassword/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="/" element={<HomeSteg />} />
            {/* <Route path="/me" element={<Profile />} /> */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
