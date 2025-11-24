import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  alpha,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Chip
} from '@mui/material';
import { 
  DirectionsCar, 
  Build, 
  Star,
  ArrowForward,
  LocationOn,
  Schedule,
  Groups,
  Security,
  Speed,
  SupportAgent,
  TrendingUp,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const features = [
    {
      icon: <DirectionsCar sx={{ fontSize: 32 }} />,
      title: "Умный гараж",
      description: "Все ваши автомобили в одном месте. Отслеживайте ТО, расходы и историю обслуживания.",
      color: "#E3311D"
    },
    {
      icon: <LocationOn sx={{ fontSize: 32 }} />,
      title: "Сервисы рядом",
      description: "Найдите лучшие автосервисы в вашем городе с реальными отзывами и рейтингами.",
      color: "#2196F3"
    },
    {
      icon: <Schedule sx={{ fontSize: 32 }} />,
      title: "Онлайн-запись",
      description: "Бронируйте услуги онлайн 24/7. Выбирайте удобное время без звонков и ожидания.",
      color: "#4CAF50"
    },
    {
      icon: <Groups sx={{ fontSize: 32 }} />,
      title: "Сообщество",
      description: "Получайте советы от опытных автовладельцев и делитесь своим опытом.",
      color: "#9C27B0"
    },
    {
      icon: <Security sx={{ fontSize: 32 }} />,
      title: "Гарантия качества",
      description: "Все сервисы проходят проверку. Гарантия на все виды работ.",
      color: "#FF9800"
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: "Экономия времени",
      description: "Сократите время на поиск и запись в сервис до 80%.",
      color: "#00BCD4"
    }
  ];

  const stats = [
    { number: "500+", label: "Проверенных сервисов", color: "#E3311D", icon: <Build /> },
    { number: "10K+", label: "Довольных клиентов", color: "#2196F3", icon: <Groups /> },
    { number: "50K+", label: "Успешных заказов", color: "#4CAF50", icon: <CheckCircle /> },
    { number: "4.8", label: "Средний рейтинг", color: "#FFD700", icon: <Star /> }
  ];

  const benefits = [
    "Экономия до 30% на обслуживании",
    "Прозрачные цены без скрытых платежей",
    "Онлайн-отслеживание статуса заказа",
    "Гарантия на все виды работ",
    "Круглосуточная поддержка",
    "История обслуживания автомобиля"
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 50%, #050507 100%)',
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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        
        {/* Hero Section */}
        <Box sx={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Анимированные элементы фона */}
          <Box sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: 400,
            height: 400,
            background: `radial-gradient(${alpha('#E3311D', 0.2)} 0%, transparent 70%)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            animation: 'pulse 8s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.1)' }
            }
          }} />
          
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Fade in={animate} timeout={1000}>
                <Box>
                  <Chip 
                    label="🚀 Новая эра автосервиса" 
                    sx={{ 
                      mb: 3,
                      background: `linear-gradient(135deg, ${alpha('#E3311D', 0.2)}, ${alpha('#2196F3', 0.2)})`,
                      border: `1px solid ${alpha('#E3311D', 0.3)}`,
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  />
                  
                  <Typography 
                    variant="h1" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      lineHeight: 1.1,
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #FFFFFF 30%, #AAACA1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Ваш автомобиль
                    <Box component="span" sx={{ 
                      display: 'block',
                      background: 'linear-gradient(135deg, #E3311D 0%, #FF6B5B 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      в надёжных руках
                    </Box>
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      color: '#7C8685',
                      maxWidth: '600px',
                      mb: 4,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      fontWeight: 400
                    }}
                  >
                    CSOYP — это экосистема для автовладельцев. Находите проверенные сервисы, 
                    управляйте обслуживанием и экономьте время на уходе за автомобилем.
                  </Typography>

                  {/* Benefits List */}
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={1}>
                      {benefits.slice(0, 3).map((benefit, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CheckCircle sx={{ fontSize: 16, color: '#4CAF50' }} />
                            <Typography variant="body2" sx={{ color: '#AAACA1', fontSize: '0.9rem' }}>
                              {benefit}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  {!user && (
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Button 
                        variant="contained" 
                        size="large" 
                        component={RouterLink} 
                        to="/register"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: '16px',
                          minWidth: '200px',
                          background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                          boxShadow: '0 8px 32px rgba(227, 49, 29, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(227, 49, 29, 0.4)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Начать сейчас
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="large" 
                        component={RouterLink} 
                        to="/services"
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: '16px',
                          borderColor: alpha('#7C8685', 0.5),
                          color: '#AAACA1',
                          minWidth: '200px',
                          '&:hover': {
                            borderColor: '#E3311D',
                            color: '#E3311D',
                            backgroundColor: alpha('#E3311D', 0.1),
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Найти сервисы
                      </Button>
                    </Box>
                  )}

                  {user && (
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Button 
                        variant="contained" 
                        size="large" 
                        component={RouterLink} 
                        to="/dashboard"
                        endIcon={<ArrowForward />}
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: '16px',
                          minWidth: '200px',
                          background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        В кабинет
                      </Button>
                      <Button 
                        variant="outlined" 
                        size="large" 
                        component={RouterLink} 
                        to="/services"
                        sx={{ 
                          px: 4,
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: '16px',
                          borderColor: alpha('#7C8685', 0.5),
                          color: '#AAACA1',
                          minWidth: '200px',
                          '&:hover': {
                            borderColor: '#E3311D',
                            color: '#E3311D'
                          }
                        }}
                      >
                        Найти сервисы
                      </Button>
                    </Box>
                  )}
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Slide in={animate} direction="left" timeout={1000}>
                <Box sx={{ position: 'relative' }}>
                  {/* Main Feature Card */}
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 4,
                    p: 4,
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #E3311D, #2196F3, #4CAF50)'
                    }
                  }}>
                    <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3, textAlign: 'center' }}>
                      Всё для вашего автомобиля
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                      gap: 3,
                    }}>
                      {features.slice(0, 4).map((feature, index) => (
                        <Zoom in={animate} timeout={800 + index * 200} key={index}>
                          <Card sx={{
                            background: 'linear-gradient(135deg, rgba(54, 46, 45, 0.6), rgba(124, 134, 133, 0.05))',
                            border: '1px solid',
                            borderColor: alpha('#7C8685', 0.1),
                            borderRadius: 3,
                            p: 2,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              borderColor: alpha(feature.color, 0.5),
                              boxShadow: `0 8px 32px ${alpha(feature.color, 0.2)}`
                            }
                          }}>
                            <Box sx={{ 
                              color: feature.color, 
                              mb: 1,
                              width: 50,
                              height: 50,
                              margin: '0 auto',
                              borderRadius: '12px',
                              background: alpha(feature.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {feature.icon}
                            </Box>
                            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.8rem' }}>
                              {feature.title}
                            </Typography>
                          </Card>
                        </Zoom>
                      ))}
                    </Box>
                  </Card>

                  {/* Floating Elements */}
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 120,
                    height: 120,
                    background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-20px)' }
                    }
                  }}>
                    <TrendingUp />
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Box>

        {/* Stats Section */}
        <Box sx={{ py: { xs: 8, md: 12 } }}>
          <Fade in={animate} timeout={1500}>
            <Box>
              <Grid container spacing={4} justifyContent="center">
                {stats.map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Zoom in={animate} timeout={1000 + index * 200}>
                      <Box sx={{ 
                        textAlign: 'center',
                        p: 3,
                        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(124, 134, 133, 0.05))',
                        borderRadius: 3,
                        border: `1px solid ${alpha('#7C8685', 0.1)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: alpha(stat.color, 0.3),
                          boxShadow: `0 12px 40px ${alpha(stat.color, 0.15)}`
                        }
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 1,
                          mb: 2 
                        }}>
                          <Box sx={{ 
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: alpha(stat.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: stat.color
                          }}>
                            {stat.icon}
                          </Box>
                        </Box>
                        <Typography 
                          variant="h2" 
                          sx={{ 
                            color: stat.color, 
                            fontWeight: 800,
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 1
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#7C8685',
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            fontWeight: 500
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Box>

        {/* Features Section */}
        <Box sx={{ py: { xs: 8, md: 15 } }}>
          <Fade in={animate} timeout={1500}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: '#FFFFFF',
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3rem' }
                }}
              >
                Почему выбирают <Box component="span" sx={{ color: '#E3311D' }}>CSOYP</Box>?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#7C8685',
                  maxWidth: '600px',
                  margin: '0 auto',
                  fontWeight: 400
                }}
              >
                Современный подход к обслуживанию автомобилей через единую платформу
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Fade in={animate} timeout={1000 + index * 200}>
                  <Card sx={{ 
                    height: '100%',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(124, 134, 133, 0.05))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.1),
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: alpha(feature.color, 0.5),
                      boxShadow: `0 20px 60px ${alpha(feature.color, 0.15)}`,
                      '& .feature-icon': {
                        transform: 'scale(1.1)',
                        background: `linear-gradient(135deg, ${feature.color}, ${alpha(feature.color, 0.7)})`
                      }
                    }
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box className="feature-icon" sx={{
                        width: 80,
                        height: 80,
                        margin: '0 auto 24px',
                        borderRadius: '20px',
                        background: alpha(feature.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: feature.color,
                        transition: 'all 0.3s ease',
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" gutterBottom sx={{ 
                        color: '#FFFFFF', 
                        fontWeight: 700,
                        mb: 2
                      }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#7C8685', 
                        lineHeight: 1.6,
                      }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* CTA Section */}
        {!user && (
          <Box sx={{ py: { xs: 8, md: 15 } }}>
            <Fade in={animate} timeout={2000}>
              <Card sx={{
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(227, 49, 29, 0.1), rgba(10, 10, 15, 0.9))',
                border: '1px solid',
                borderColor: alpha('#E3311D', 0.2),
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, transparent, rgba(227, 49, 29, 0.05))',
                  zIndex: 0
                }
              }}>
                <CardContent sx={{ p: { xs: 4, md: 8 }, position: 'relative', zIndex: 1 }}>
                  <Typography 
                    variant="h3" 
                    gutterBottom 
                    sx={{ 
                      color: '#FFFFFF',
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Готовы упростить уход за автомобилем?
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#7C8685', 
                      mb: 4, 
                      maxWidth: '500px', 
                      margin: '0 auto',
                      fontWeight: 400
                    }}
                  >
                    Присоединяйтесь к тысячам автовладельцев, которые уже экономят время и деньги с CSOYP
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="large"
                    component={RouterLink}
                    to="/register"
                    endIcon={<ArrowForward />}
                    sx={{ 
                      px: 6,
                      py: 2,
                      fontSize: '1.2rem',
                      borderRadius: '16px',
                      minWidth: '250px',
                      background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                      boxShadow: '0 8px 32px rgba(227, 49, 29, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(227, 49, 29, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Создать аккаунт
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;