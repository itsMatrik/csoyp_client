import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Box,
  Alert,
  alpha,
  Fade,
  Zoom,
  Slide,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  DirectionsCar,
  Google,
  Facebook,
  Apple
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleDemoLogin = (role) => {
    const demoAccounts = {
      client: { email: 'demo@client.com', password: 'demopass123' },
      business: { email: 'demo@business.com', password: 'demopass123' }
    };
    
    setFormData(demoAccounts[role]);
    setError('');
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, ${alpha('#E3311D', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha('#2196F3', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${alpha('#4CAF50', 0.05)} 0%, transparent 50%)
          `,
          zIndex: 0
        }
      }}>
        <Container 
          maxWidth="lg" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            {/* Left Side - Branding */}
            {!isMobile && (
              <Grid item xs={12} md={6}>
                <Slide in={true} direction="right" timeout={500}>
                  <Box sx={{ 
                    textAlign: 'center',
                    pr: 4
                  }}>
                    <Box sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 120,
                      height: 120,
                      borderRadius: '25px',
                      background: 'linear-gradient(135deg, #E3311D 0%, #FF6B5B 100%)',
                      color: '#FFFFFF',
                      mb: 4,
                      boxShadow: '0 20px 60px rgba(227, 49, 29, 0.4)',
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
                      <DirectionsCar sx={{ fontSize: 50 }} />
                    </Box>
                    
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        fontWeight: 900,
                        mb: 3,
                        background: 'linear-gradient(135deg, #FFFFFF 30%, #AAACA1 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontSize: { md: '3rem', lg: '3.5rem' }
                      }}
                    >
                      CSOYP
                    </Typography>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: '#7C8685',
                        mb: 2,
                        fontWeight: 400,
                        lineHeight: 1.6
                      }}
                    >
                      Ваш надежный помощник в мире автомобильного сервиса
                    </Typography>
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: alpha('#7C8685', 0.8),
                        maxWidth: '400px',
                        margin: '0 auto',
                        lineHeight: 1.6
                      }}
                    >
                      Присоединяйтесь к тысячам автовладельцев, которые уже доверяют обслуживание своих автомобилей CSOYP
                    </Typography>

                    {/* Demo Accounts */}
                    <Box sx={{ mt: 6 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#FFFFFF', 
                          mb: 3,
                          fontWeight: 600
                        }}
                      >
                        Быстрый доступ:
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleDemoLogin('client')}
                          sx={{
                            borderColor: alpha('#2196F3', 0.5),
                            color: '#2196F3',
                            borderRadius: 3,
                            px: 3,
                            '&:hover': {
                              borderColor: '#2196F3',
                              backgroundColor: alpha('#2196F3', 0.1),
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Демо клиент
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleDemoLogin('business')}
                          sx={{
                            borderColor: alpha('#E3311D', 0.5),
                            color: '#E3311D',
                            borderRadius: 3,
                            px: 3,
                            '&:hover': {
                              borderColor: '#E3311D',
                              backgroundColor: alpha('#E3311D', 0.1),
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Демо бизнес
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Slide>
              </Grid>
            )}

            {/* Right Side - Login Form */}
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={800}>
                <Paper 
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(40px)',
                    border: `1px solid ${alpha('#7C8685', 0.2)}`,
                    borderRadius: 4,
                    p: { xs: 3, sm: 4, md: 5 },
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #E3311D, #2196F3, #4CAF50)'
                    }
                  }}
                >
                  {/* Mobile Logo */}
                  {isMobile && (
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 60,
                        height: 60,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #E3311D 0%, #FF6B5B 100%)',
                        color: '#FFFFFF',
                        mb: 2,
                        boxShadow: '0 8px 32px rgba(227, 49, 29, 0.4)'
                      }}>
                        <DirectionsCar sx={{ fontSize: 28 }} />
                      </Box>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          fontWeight: 900,
                          background: 'linear-gradient(135deg, #FFFFFF 30%, #AAACA1 100%)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        CSOYP
                      </Typography>
                    </Box>
                  )}

                  <Typography 
                    variant="h3" 
                    component="h1" 
                    gutterBottom 
                    align="center"
                    sx={{ 
                      color: '#FFFFFF',
                      fontWeight: 800,
                      mb: 1,
                      fontSize: { xs: '2rem', sm: '2.5rem' }
                    }}
                  >
                    Войти в аккаунт
                  </Typography>
                  
                  <Typography 
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      color: '#7C8685',
                      mb: 4,
                      fontWeight: 400
                    }}
                  >
                    С возвращением! Пожалуйста, войдите в свой аккаунт
                  </Typography>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        bgcolor: alpha('#E3311D', 0.1),
                        border: `1px solid ${alpha('#E3311D', 0.3)}`,
                        borderRadius: 2,
                        color: '#FFFFFF',
                        '& .MuiAlert-icon': {
                          color: '#E3311D'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <form onSubmit={onSubmit}>
                    <TextField
                      fullWidth
                      label="Email адрес"
                      name="email"
                      type="email"
                      value={email}
                      onChange={onChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#7C8685' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          color: '#FFFFFF',
                          borderRadius: 2,
                          '& fieldset': { 
                            borderColor: alpha('#7C8685', 0.3),
                            borderWidth: '2px'
                          },
                          '&:hover fieldset': { 
                            borderColor: '#E3311D',
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#E3311D',
                            borderWidth: '2px'
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: '#7C8685',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: '#E3311D'
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Пароль"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={onChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#7C8685' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{ color: '#7C8685' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          color: '#FFFFFF',
                          borderRadius: 2,
                          '& fieldset': { 
                            borderColor: alpha('#7C8685', 0.3),
                            borderWidth: '2px'
                          },
                          '&:hover fieldset': { 
                            borderColor: '#E3311D',
                          },
                          '&.Mui-focused fieldset': { 
                            borderColor: '#E3311D',
                            borderWidth: '2px'
                          }
                        },
                        '& .MuiInputLabel-root': { 
                          color: '#7C8685',
                          fontWeight: 500
                        },
                        '& .MuiInputLabel-root.Mui-focused': { 
                          color: '#E3311D'
                        }
                      }}
                    />

                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      mb: 3 
                    }}>
                      <Link 
                        component={RouterLink} 
                        to="/forgot-password" 
                        variant="body2"
                        sx={{ 
                          color: '#7C8685',
                          textDecoration: 'none',
                          '&:hover': {
                            color: '#E3311D'
                          }
                        }}
                      >
                        Забыли пароль?
                      </Link>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                        borderRadius: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        boxShadow: '0 8px 32px rgba(227, 49, 29, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(227, 49, 29, 0.4)'
                        },
                        '&:disabled': {
                          background: '#362E2D',
                          color: '#7C8685',
                          transform: 'none',
                          boxShadow: 'none'
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                      ) : (
                        'Войти'
                      )}
                    </Button>

                    <Divider sx={{ 
                      my: 4, 
                      borderColor: alpha('#7C8685', 0.2),
                      '&::before, &::after': {
                        borderColor: alpha('#7C8685', 0.2),
                      }
                    }}>
                      <Typography variant="body2" sx={{ color: '#7C8685', px: 2 }}>
                        или войдите с помощью
                      </Typography>
                    </Divider>

                    {/* Social Login */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      mb: 4,
                      justifyContent: 'center'
                    }}>
                      <IconButton
                        sx={{
                          border: `2px solid ${alpha('#7C8685', 0.3)}`,
                          color: '#7C8685',
                          borderRadius: 2,
                          width: 50,
                          height: 50,
                          '&:hover': {
                            borderColor: '#E3311D',
                            color: '#E3311D',
                            backgroundColor: alpha('#E3311D', 0.1)
                          }
                        }}
                      >
                        <Google />
                      </IconButton>
                      <IconButton
                        sx={{
                          border: `2px solid ${alpha('#7C8685', 0.3)}`,
                          color: '#7C8685',
                          borderRadius: 2,
                          width: 50,
                          height: 50,
                          '&:hover': {
                            borderColor: '#2196F3',
                            color: '#2196F3',
                            backgroundColor: alpha('#2196F3', 0.1)
                          }
                        }}
                      >
                        <Facebook />
                      </IconButton>
                      <IconButton
                        sx={{
                          border: `2px solid ${alpha('#7C8685', 0.3)}`,
                          color: '#7C8685',
                          borderRadius: 2,
                          width: 50,
                          height: 50,
                          '&:hover': {
                            borderColor: '#000000',
                            color: '#000000',
                            backgroundColor: alpha('#000000', 0.1)
                          }
                        }}
                      >
                        <Apple />
                      </IconButton>
                    </Box>

                    <Box textAlign="center">
                      <Typography variant="body2" sx={{ color: '#7C8685', mb: 1 }}>
                        Еще нет аккаунта?
                      </Typography>
                      <Link 
                        component={RouterLink} 
                        to="/register" 
                        variant="body1"
                        sx={{ 
                          color: '#E3311D',
                          fontWeight: 600,
                          textDecoration: 'none',
                          '&:hover': {
                            color: '#FF6B5B'
                          }
                        }}
                      >
                        Создать аккаунт
                      </Link>
                    </Box>
                  </form>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default Login;