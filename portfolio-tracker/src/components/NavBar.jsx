import React from 'react';
import { AppBar, Toolbar, Button } from '@mui/material';
import AuthService from '../utils/auth';
import brand from '../assets/brand.png';


const NavBar = () => {
    const handleLogout = () => {
        AuthService.logout()
    };

    const isLoggedIn = AuthService.loggedIn();
  return (
    <AppBar position='static' style={{backgroundColor: 'white', boxShadow: 'none', paddingTop: '20px'}}>
        <Toolbar sx={{ justifyContent: 'space-between'}}>
            <img src={brand} alt="Andrews Investment Tracking logo" style={{ marginRight: '10px', width: '100px', height: '100px' }} />
            {isLoggedIn && (
                <Button variant='contained' color='primary' onClick={handleLogout}>
                    Logout
                </Button>
            )}
        </Toolbar>
    </AppBar>
  )
}

export default NavBar
