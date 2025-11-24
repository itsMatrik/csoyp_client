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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  Fade,
  Zoom,
  Slide,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Phone,
  Business,
  DirectionsCar,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user',
    phone: '',
    businessName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { name, email, password, password2, role, phone, businessName } = formData;

  const steps = ['Основная информация', 'Тип аккаунта', 'Дополнительные данные'];

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!name || !email || !password || !password2) {
        setError('Пожалуйста, заполните все обязательные поля');
        return;
      }
      if (password !== password2) {
        setError('Пароли не совпадают');
        return;
      }
      if (password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }
    }
    if (activeStep === 1 && role === 'business' && !businessName) {
      setError('Пожалуйста, укажите название бизнеса');
      return;
    }
    setActiveStep((prev) => prev + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== password2) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    
    const userData = {
      name,
      email,
      password,
      role,
      phone: role === 'user' ? phone : undefined,
      businessName: role === 'business' ? businessName : undefined
    };

    const result = await register(userData);
    
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

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Полное имя"
              name="name"
              value={name}
              onChange={onChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#7C8685' }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyles}
            />

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
              sx={textFieldStyles}
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
              sx={textFieldStyles}
            />

            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="password2"
              type={showConfirmPassword ? 'text' : 'password'}
              value={password2}
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
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                      sx={{ color: '#7C8685' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              sx={textFieldStyles}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth sx={selectStyles}>
              <InputLabel sx={{ color: '#7C8685', fontWeight: 500 }}>Я являюсь</InputLabel>
              <Select
                name="role"
                value={role}
                label="Я являюсь"
                onChange={onChange}
              >
                <MenuItem value="user">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DirectionsCar sx={{ color: '#4CAF50' }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        Владелец автомобиля
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7C8685' }}>
                        Ищу услуги для своего авто
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
                <MenuItem value="business">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Business sx={{ color: '#2196F3' }} />
                    <Box>
                      <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                        Сервис-провайдер
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7C8685' }}>
                        Предоставляю услуги автосервиса
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {role === 'business' && (
              <TextField
                fullWidth
                label="Название бизнеса"
                name="businessName"
                value={businessName}
                onChange={onChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: '#7C8685' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            )}

            <Box sx={{ 
              p: 3, 
              background: alpha(role === 'user' ? '#4CAF50' : '#2196F3', 0.1),
              border: `1px solid ${alpha(role === 'user' ? '#4CAF50' : '#2196F3', 0.3)}`,
              borderRadius: 3,
              textAlign: 'center'
            }}>
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 1 }}>
                {role === 'user' ? '👋 Добро пожаловать, автовладелец!' : '🚀 Начните развивать свой бизнес!'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7C8685' }}>
                {role === 'user' 
                  ? 'Находите лучшие сервисы, управляйте заказами и экономьте время' 
                  : 'Привлекайте новых клиентов, управляйте заказами и развивайте свой сервис'
                }
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {role === 'user' && (
              <TextField
                fullWidth
                label="Номер телефона (необязательно)"
                name="phone"
                value={phone}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: '#7C8685' }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldStyles}
              />
            )}

            <Box sx={{ 
              p: 3, 
              background: alpha('#4CAF50', 0.1),
              border: `1px solid ${alpha('#4CAF50', 0.3)}`,
              borderRadius: 3
            }}>
              <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
                ✅ Готово к созданию аккаунта!
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                  <Typography variant="body2" sx={{ color: '#7C8685' }}>
                    Имя: <strong style={{ color: '#FFFFFF' }}>{name}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                  <Typography variant="body2" sx={{ color: '#7C8685' }}>
                    Email: <strong style={{ color: '#FFFFFF' }}>{email}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                  <Typography variant="body2" sx={{ color: '#7C8685' }}>
                    Тип аккаунта: <strong style={{ color: '#FFFFFF' }}>
                      {role === 'user' ? 'Владелец автомобиля' : 'Сервис-провайдер'}
                    </strong>
                  </Typography>
                </Box>
                {role === 'business' && businessName && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                    <Typography variant="body2" sx={{ color: '#7C8685' }}>
                      Бизнес: <strong style={{ color: '#FFFFFF' }}>{businessName}</strong>
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: '#7C8685', textAlign: 'center' }}>
              Нажимая "Создать аккаунт", вы соглашаетесь с нашими{' '}
              <Link href="#" sx={{ color: '#E3311D' }}>условиями использования</Link>{' '}
              и <Link href="#" sx={{ color: '#E3311D' }}>политикой конфиденциальности</Link>
            </Typography>
          </Box>
        );

      default:
        return 'Неизвестный шаг';
    }
  };

  const textFieldStyles = {
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
  };

  const selectStyles = {
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
    },
    '& .MuiSelect-icon': {
      color: '#7C8685'
    }
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
          maxWidth="md" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Grid container spacing={4} alignItems="center" justifyContent="center">
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
                      Присоединяйтесь к сообществу автолюбителей
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
                      {role === 'user' 
                        ? 'Находите лучшие сервисы, управляйте заказами и экономьте время на обслуживании автомобиля'
                        : 'Развивайте свой бизнес, привлекайте клиентов и упрощайте управление заказами'
                      }
                    </Typography>
                  </Box>
                </Slide>
              </Grid>
            )}

            {/* Right Side - Registration Form */}
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
                    Создать аккаунт
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
                    Присоединяйтесь к CSOYP за несколько простых шагов
                  </Typography>

                  {/* Stepper */}
                  <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel sx={{
                          '& .MuiStepLabel-label': {
                            color: '#7C8685',
                            fontSize: '0.8rem'
                          },
                          '& .MuiStepLabel-label.Mui-active': {
                            color: '#E3311D',
                            fontWeight: 600
                          },
                          '& .MuiStepLabel-label.Mui-completed': {
                            color: '#4CAF50'
                          }
                        }}>
                          {isMobile ? '' : label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>

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

                  <form onSubmit={activeStep === steps.length - 1 ? onSubmit : (e) => { e.preventDefault(); handleNext(); }}>
                    {getStepContent(activeStep)}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                      <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ArrowBack />}
                        sx={{
                          color: '#7C8685',
                          '&:hover': {
                            color: '#E3311D'
                          }
                        }}
                      >
                        Назад
                      </Button>

                      {activeStep === steps.length - 1 ? (
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={loading}
                          sx={{
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            borderRadius: 3,
                            px: 4,
                            py: 1,
                            fontSize: '1rem',
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
                            'Создать аккаунт'
                          )}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{
                            background: 'linear-gradient(135deg, #2196F3, #21CBF3)',
                            borderRadius: 3,
                            px: 4,
                            py: 1,
                            fontWeight: 700,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1976D2, #2196F3)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Далее
                        </Button>
                      )}
                    </Box>

                    <Divider sx={{ 
                      my: 4, 
                      borderColor: alpha('#7C8685', 0.2)
                    }} />

                    <Box textAlign="center">
                      <Typography variant="body2" sx={{ color: '#7C8685', mb: 1 }}>
                        Уже есть аккаунт?
                      </Typography>
                      <Link 
                        component={RouterLink} 
                        to="/login" 
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
                        Войти в аккаунт
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

export default Register;