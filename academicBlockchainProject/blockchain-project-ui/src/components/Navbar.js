import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);

  // Menü kapanışı ve yeniden render için user veya konum değiştiğinde menu kapat
  useEffect(() => {
    setAnchorEl(null);
  }, [user, location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderItems = () => {
    if (!user) {
      return (
        <>
          <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Giriş</MenuItem>
          <MenuItem component={Link} to="/register" onClick={handleMenuClose}>Kayıt</MenuItem>
        </>
      );
    }
    if (user.role === 'instructor') {
      return (
        <>
          <MenuItem component={Link} to="/projects" onClick={handleMenuClose}>Projeler</MenuItem>
          <MenuItem component={Link} to="/approve" onClick={handleMenuClose}>Onayla</MenuItem>
          <MenuItem component={Link} to="/chain/validate" onClick={handleMenuClose}>Zinciri Doğrula</MenuItem>
          <MenuItem component={Link} to="/transactions" onClick={handleMenuClose}>Transactions</MenuItem> {/* Yeni eklenen */}
          <MenuItem onClick={handleLogout}>Çıkış</MenuItem>
        </>
      );
    }
    return (
      <>
        <MenuItem component={Link} to="/projects" onClick={handleMenuClose}>Projelerim</MenuItem>
        <MenuItem component={Link} to="/submit" onClick={handleMenuClose}>Proje Gönder</MenuItem>
        <MenuItem onClick={handleLogout}>Çıkış</MenuItem>
      </>
    );
  };

  const renderButtons = () => {
    if (!user) {
      return (
        <>
          <Button color="inherit" component={Link} to="/login">Giriş</Button>
          <Button color="inherit" component={Link} to="/register">Kayıt</Button>
        </>
      );
    }
    if (user.role === 'instructor') {
      return (
        <>
          <Button color="inherit" component={Link} to="/projects">Projeler</Button>
          <Button color="inherit" component={Link} to="/approve">Onayla</Button>
          <Button color="inherit" component={Link} to="/chain/validate">Zinciri Doğrula</Button>
          <Button color="inherit" component={Link} to="/transactions">İŞLEMLER</Button> 
          <Button color="error" variant="outlined" onClick={handleLogout}>Çıkış</Button>
        </>
      );
    }
    return (
      <>
        <Button color="inherit" component={Link} to="/projects">Projelerim</Button>
        <Button color="inherit" component={Link} to="/submit">Proje Gönder</Button>
        <Button color="error" variant="outlined" onClick={handleLogout}>Çıkış</Button>
      </>
    );
  };

  return (
    <AppBar
      key={user ? user.role : 'anon'}
      position="static"
      sx={{ backgroundColor: '#1e1e2f' }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
        >
          AKADEMİK PROJE TESLİM VE ONAY SİSTEMİ
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {renderItems()}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {renderButtons()}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
