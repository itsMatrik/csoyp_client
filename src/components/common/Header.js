import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Badge,
  Fade,
  Slide
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Dashboard,
  Schedule,
  Business,
  Person,
  ExitToApp,
  Settings,
  Notifications,
  Menu as MenuIcon,
  CarRepair,
  Star,
  Chat
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleCloseUserMenu();
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenuAnchor(null);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const navigationItems = user ? [
    { 
      path: '/services', 
      label: 'Сервисы', 
      icon: <CarRepair sx={{ fontSize: 20 }} />,
      show: true
    },
    { 
      path: '/dashboard', 
      label: 'Дашборд', 
      icon: <Dashboard sx={{ fontSize: 20 }} />,
      show: true
    },
    { 
      path: '/orders', 
      label: 'Заказы', 
      icon: <Schedule sx={{ fontSize: 20 }} />,
      show: true,
      badge: user.pendingOrders || 0
    },
    { 
      path: '/business', 
      label: 'Бизнес', 
      icon: <Business sx={{ fontSize: 20 }} />,
      show: user.role === 'business'
    },
  ] : [
    { 
      path: '/services', 
      label: 'Найти сервисы', 
      icon: <CarRepair sx={{ fontSize: 20 }} />,
      show: true
    },
  ];

  const userMenuItems = [
    { 
      label: 'Профиль', 
      icon: <Person sx={{ fontSize: 20 }} />, 
      path: '/profile',
      color: '#7C8685'
    },
    { 
      label: 'Настройки', 
      icon: <Settings sx={{ fontSize: 20 }} />, 
      path: '/settings',
      color: '#7C8685'
    },
  ];

  // Mock notifications
  const notifications = [
    { id: 1, text: 'Новый заказ #1234', time: '5 мин назад', read: false },
    { id: 2, text: 'Заказ #1221 завершен', time: '1 час назад', read: false },
    { id: 3, text: 'Новый отзыв от клиента', time: '2 часа назад', read: true },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Slide in={true} direction="down" timeout={800}>
      <AppBar 
        position="fixed"
        sx={{
          background: `linear-gradient(135deg, ${alpha('#0A0A0F', 0.98)}, ${alpha('#050507', 0.95)})`,
          backdropFilter: 'blur(40px)',
          borderBottom: `1px solid ${alpha('#7C8685', 0.1)}`,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ 
          py: 1.5,
          minHeight: { xs: '70px', md: '80px' } 
        }}>
          {/* Logo */}
          <Fade in={true} timeout={1000}>
            <Box 
              component={RouterLink}
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                mr: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Box sx={{
                width: { xs: 36, md: 44 },
                height: { xs: 36, md: 44 },
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #E3311D 0%, #FF6B5B 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                mr: 2,
                boxShadow: '0 8px 32px rgba(227, 49, 29, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.1))',
                }
              }}>
                <DirectionsCar sx={{ fontSize: { xs: 20, md: 24 } }} />
              </Box>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 900,
                  fontSize: { xs: '1.3rem', md: '1.5rem' },
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #E3311D 50%, #FF6B5B 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px'
                }}
              >
                CSOYP
              </Typography>
            </Box>
          </Fade>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Fade in={true} timeout={1200}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5 
              }}>
                {user ? (
                  <>
                    {/* Navigation Items */}
                    {navigationItems.filter(item => item.show).map((item) => (
                      <Button
                        key={item.path}
                        component={RouterLink}
                        to={item.path}
                        startIcon={item.icon}
                        sx={{ 
                          color: isActivePath(item.path) ? '#E3311D' : '#AAACA1',
                          fontWeight: isActivePath(item.path) ? 700 : 500,
                          borderRadius: 2,
                          px: 2,
                          py: 1,
                          minWidth: 'auto',
                          position: 'relative',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#E3311D',
                            backgroundColor: alpha('#E3311D', 0.1),
                            transform: 'translateY(-1px)'
                          },
                          '&::after': isActivePath(item.path) ? {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '20px',
                            height: '3px',
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            borderRadius: 2
                          } : {}
                        }}
                      >
                        {item.label}
                        {item.badge > 0 && (
                          <Box sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 16,
                            height: 16,
                            backgroundColor: '#E3311D',
                            borderRadius: '50%',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {item.badge}
                          </Box>
                        )}
                      </Button>
                    ))}

                    {/* Notifications */}
                    <IconButton
                      onClick={handleNotificationsOpen}
                      sx={{
                        color: '#AAACA1',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#E3311D',
                          backgroundColor: alpha('#E3311D', 0.1),
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Badge 
                        badgeContent={unreadNotifications} 
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#E3311D',
                            color: '#FFFFFF',
                            fontWeight: 700
                          }
                        }}
                      >
                        <Notifications />
                      </Badge>
                    </IconButton>

                    {/* User Menu */}
                    <IconButton
                      onClick={handleUserMenuOpen}
                      sx={{
                        color: '#AAACA1',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#E3311D',
                          backgroundColor: alpha('#E3311D', 0.1),
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                          fontSize: '1rem',
                          fontWeight: 700,
                          boxShadow: '0 4px 20px rgba(227, 49, 29, 0.3)'
                        }}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>

                    {/* Role Chip */}
                    <Chip 
                      icon={user.role === 'business' ? <Build /> : <DirectionsCar />}
                      label={user.role === 'business' ? 'Бизнес' : 'Клиент'} 
                      size="small"
                      sx={{ 
                        background: user.role === 'business' 
                          ? 'linear-gradient(135deg, #2196F3, #21CBF3)' 
                          : 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': {
                          color: '#FFFFFF',
                          fontSize: 16
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      component={RouterLink}
                      to="/services"
                      sx={{ 
                        color: '#AAACA1',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                          color: '#E3311D',
                          backgroundColor: alpha('#E3311D', 0.1),
                        }
                      }}
                    >
                      Найти сервисы
                    </Button>

                    <Button
                      component={RouterLink}
                      to="/login"
                      sx={{ 
                        color: '#AAACA1',
                        fontWeight: 500,
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                          color: '#E3311D',
                          backgroundColor: alpha('#E3311D', 0.1),
                        }
                      }}
                    >
                      Войти
                    </Button>

                    <Button
                      variant="contained"
                      component={RouterLink}
                      to="/register"
                      sx={{
                        background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                        borderRadius: 3,
                        px: 4,
                        py: 1,
                        fontWeight: 700,
                        boxShadow: '0 8px 32px rgba(227, 49, 29, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(227, 49, 29, 0.4)'
                        }
                      }}
                    >
                      Начать
                    </Button>
                  </>
                )}
              </Box>
            </Fade>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Fade in={true} timeout={1200}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {user && (
                  <>
                    <IconButton
                      onClick={handleNotificationsOpen}
                      sx={{ color: '#AAACA1' }}
                    >
                      <Badge badgeContent={unreadNotifications} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>

                    <Chip 
                      label={user.role === 'business' ? 'Бизнес' : 'Клиент'} 
                      size="small"
                      sx={{ 
                        background: user.role === 'business' 
                          ? 'linear-gradient(135deg, #2196F3, #21CBF3)' 
                          : 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        height: 28
                      }}
                    />
                  </>
                )}
                
                <IconButton
                  onClick={handleMobileMenuOpen}
                  sx={{
                    color: '#AAACA1',
                    '&:hover': {
                      color: '#E3311D'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Fade>
          )}
        </Toolbar>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleCloseMobileMenu}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0A0A0F, #050507)',
              border: `1px solid ${alpha('#7C8685', 0.2)}`,
              borderRadius: 3,
              minWidth: 200,
              mt: 1
            }
          }}
        >
          {user ? (
            <>
              <MenuItem 
                onClick={handleCloseMobileMenu}
                component={RouterLink}
                to="/profile"
                sx={{ 
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: alpha('#E3311D', 0.1)
                  }
                }}
              >
                <Person sx={{ mr: 2, color: '#7C8685' }} />
                Профиль
              </MenuItem>
              
              {navigationItems.filter(item => item.show).map((item) => (
                <MenuItem 
                  key={item.path}
                  onClick={handleCloseMobileMenu}
                  component={RouterLink}
                  to={item.path}
                  sx={{ 
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: alpha('#E3311D', 0.1)
                    }
                  }}
                >
                  {item.icon}
                  <Typography sx={{ ml: 2 }}>
                    {item.label}
                  </Typography>
                </MenuItem>
              ))}
              
              <Divider sx={{ borderColor: alpha('#7C8685', 0.2), my: 1 }} />
              
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  color: '#F44336',
                  '&:hover': {
                    backgroundColor: alpha('#F44336', 0.1)
                  }
                }}
              >
                <ExitToApp sx={{ mr: 2 }} />
                Выйти
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem 
                onClick={handleCloseMobileMenu}
                component={RouterLink}
                to="/services"
                sx={{ color: '#FFFFFF' }}
              >
                Найти сервисы
              </MenuItem>
              <MenuItem 
                onClick={handleCloseMobileMenu}
                component={RouterLink}
                to="/login"
                sx={{ color: '#FFFFFF' }}
              >
                Войти
              </MenuItem>
              <MenuItem 
                onClick={handleCloseMobileMenu}
                component={RouterLink}
                to="/register"
                sx={{ color: '#E3311D', fontWeight: 600 }}
              >
                Начать
              </MenuItem>
            </>
          )}
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleCloseUserMenu}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0A0A0F, #050507)',
              border: `1px solid ${alpha('#7C8685', 0.2)}`,
              borderRadius: 3,
              minWidth: 200,
              mt: 1
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#7C8685', 0.1)}` }}>
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7C8685' }}>
              {user?.email}
            </Typography>
          </Box>

          {userMenuItems.map((item) => (
            <MenuItem 
              key={item.label}
              onClick={() => {
                handleCloseUserMenu();
                navigate(item.path);
              }}
              sx={{ 
                color: item.color,
                '&:hover': {
                  backgroundColor: alpha('#E3311D', 0.1)
                }
              }}
            >
              {item.icon}
              <Typography sx={{ ml: 2 }}>
                {item.label}
              </Typography>
            </MenuItem>
          ))}
          
          <Divider sx={{ borderColor: alpha('#7C8685', 0.2), my: 1 }} />
          
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              color: '#F44336',
              '&:hover': {
                backgroundColor: alpha('#F44336', 0.1)
              }
            }}
          >
            <ExitToApp sx={{ mr: 2 }} />
            Выйти
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleCloseNotifications}
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0A0A0F, #050507)',
              border: `1px solid ${alpha('#7C8685', 0.2)}`,
              borderRadius: 3,
              width: 320,
              maxHeight: 400,
              mt: 1
            }
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${alpha('#7C8685', 0.1)}` }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
              Уведомления
            </Typography>
          </Box>

          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Notifications sx={{ fontSize: 48, color: '#7C8685', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#7C8685' }}>
                Нет новых уведомлений
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem 
                key={notification.id}
                onClick={handleCloseNotifications}
                sx={{ 
                  borderBottom: `1px solid ${alpha('#7C8685', 0.1)}`,
                  backgroundColor: notification.read ? 'transparent' : alpha('#E3311D', 0.05),
                  '&:hover': {
                    backgroundColor: alpha('#E3311D', 0.1)
                  }
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: notification.read ? 400 : 600 
                  }}>
                    {notification.text}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#7C8685' }}>
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </Menu>
      </AppBar>
    </Slide>
  );
};

export default Header;