import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  alpha,
  Container,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Schedule,
  Add,
  ArrowForward,
  Speed,
  CarRepair,
  Search,
  Chat
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// Небольшие утилиты/компоненты
const StatCard = ({ icon, title, value, color, subtitle, onClick, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
      <Zoom in={!loading} timeout={800}>
        <Card
            onClick={onClick}
            sx={{
              background: `linear-gradient(135deg, ${alpha(color, 0.15)}, ${alpha('#0A0A0F', 0.8)})`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(color, 0.3)}`,
              cursor: onClick ? 'pointer' : 'default',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': onClick ? {
                transform: 'translateY(-8px)',
                borderColor: color,
                boxShadow: `0 20px 40px ${alpha(color, 0.2)}`,
                '& .stat-glow': {
                  opacity: 1
                }
              } : {},
              height: '100%'
            }}
        >
          <Box
              className="stat-glow"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at center, ${alpha(color, 0.1)} 0%, transparent 70%)`,
                opacity: 0,
                transition: 'opacity 0.4s ease'
              }}
          />

          <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Box sx={{
              width: isMobile ? 50 : 60,
              height: isMobile ? 50 : 60,
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: `0 8px 24px ${alpha(color, 0.3)}`,
              transition: 'all 0.3s ease'
            }}>
              {icon}
            </Box>
            <Typography variant="h3" sx={{
              color: color,
              fontWeight: 800,
              mb: 1,
              fontSize: isMobile ? '2rem' : '2.5rem',
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.8)})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {loading ? '...' : value}
            </Typography>
            <Typography variant="h6" sx={{
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              {title}
            </Typography>
            {subtitle && (
                <Typography variant="body2" sx={{
                  color: alpha('#FFFFFF', 0.7),
                  mt: 0.5,
                  fontSize: '0.8rem'
                }}>
                  {subtitle}
                </Typography>
            )}
          </CardContent>
        </Card>
      </Zoom>
  );
};

// замените ваш QuickActionButton этим вариантом
const QuickActionButton = ({ icon, title, subtitle, color, onClick, sx }) => {
  return (
      <Button
          variant="outlined"
          onClick={onClick}
          fullWidth
          sx={[
            {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              gap: 0.5,
              p: 2,
              height: '100%', // важно: позволяет растягиваться по высоте контейнера
              borderColor: alpha('#7C8685', 0.12),
              color: '#FFFFFF',
              background: alpha('#0A0A0F', 0.45),
              borderRadius: 2,
              textAlign: 'left',
              '& .MuiButton-startIcon': { marginRight: 8 },
              '&:hover': {
                borderColor: color,
                color: color,
                backgroundColor: alpha(color, 0.08),
                transform: 'translateX(6px)',
                boxShadow: `0 8px 20px ${alpha(color, 0.12)}`
              }
            },
            sx
          ]}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </Box>
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.05 }}>
              {title.length > 28 ? (title.slice(0, 25) + '...') : title}
            </Typography>
            {subtitle && (
                <Typography variant="caption" sx={{ color: '#9AA0A0', fontSize: '0.72rem' }}>
                  {subtitle.length > 40 ? (subtitle.slice(0, 37) + '...') : subtitle}
                </Typography>
            )}
          </Box>
        </Box>
      </Button>
  );
};


const PersonalCard = ({ user, carsCount, onAddCar, onGoCars, onGoOrders, onGoBalance, onGoSettings }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(10,10,15,0.9), rgba(124,134,133,0.05))',
        border: '1px solid',
        borderColor: alpha('#7C8685', 0.12),
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{
              width: isMobile ? 64 : 84,
              height: isMobile ? 64 : 84,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: `0 8px 24px ${alpha('#E3311D', 0.18)}`
            }}>
              <DirectionsCar sx={{ fontSize: isMobile ? 32 : 40 }} />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                {user?.name || 'Пользователь'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7C8685', mt: 0.5 }}>
                {carsCount > 0 ? `${carsCount} автомобиль(я)` : 'Автомобиль не добавлен'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            {carsCount > 0 ? (
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${alpha('#7C8685', 0.12)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Box sx={{
                    width: 84,
                    height: 52,
                    borderRadius: 1,
                    background: alpha('#E3311D', 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img src="/car-placeholder.png" alt="car" style={{ width: '90%', height: 'auto' }} onError={(e)=>{e.currentTarget.style.display='none'}} />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                      Мой автомобиль
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#7C8685' }}>
                      Нажмите «Мои авто», чтобы посмотреть детали
                    </Typography>
                  </Box>
                </Box>
            ) : (
                <Box sx={{ mt: 1 }}>
                  <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={onAddCar}
                      sx={{
                        background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                        borderRadius: 2,
                        px: 3
                      }}
                  >
                    Добавить автомобиль
                  </Button>
                </Box>
            )}
          </Box>
        </CardContent>

        <Box sx={{ p: 2, borderTop: `1px solid ${alpha('#7C8685', 0.06)}`, background: alpha('#000000', 0.02) }}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={onGoCars} sx={{ textTransform: 'none', borderColor: alpha('#7C8685', 0.12) }}>
                Мои авто
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={onGoOrders} sx={{ textTransform: 'none', borderColor: alpha('#7C8685', 0.12) }}>
                Записи
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={onGoBalance} sx={{ textTransform: 'none', borderColor: alpha('#7C8685', 0.12) }}>
                Баланс
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="outlined" onClick={onGoSettings} sx={{ textTransform: 'none', borderColor: alpha('#7C8685', 0.12) }}>
                Настройки
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [serviceFilter, setServiceFilter] = useState('');

  const goToServices = () => {
    const q = (serviceFilter || '').trim();
    if (q) {
      navigate(`/services?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/services');
    }
  };

  const [stats, setStats] = useState({
    cars: 0,
    orders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      const carsResponse = await api.get('/cars');
      const carsCount = carsResponse.data.length;

      const ordersResponse = await api.get('/orders/my-orders?limit=10');
      const orders = ordersResponse.data.data;
      const ordersCount = ordersResponse.data.total;

      const activeOrders = orders.filter(order =>
          ['pending', 'confirmed', 'in_progress', 'searching'].includes(order.status)
      ).length;

      const completedOrders = orders.filter(order =>
          order.status === 'completed'
      ).length;

      const totalSpent = orders
          .filter(order => order.status === 'completed' && order.price)
          .reduce((sum, order) => sum + order.price, 0);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const upcoming = orders.filter(order => {
        const orderDate = new Date(order.scheduledDate);
        return orderDate >= today && orderDate <= tomorrow &&
            ['confirmed', 'in_progress'].includes(order.status);
      }).slice(0, 2);

      setStats({
        cars: carsCount,
        orders: ordersCount,
        activeOrders: activeOrders,
        completedOrders: completedOrders,
        totalSpent: totalSpent
      });

      setRecentOrders(orders.slice(0, 3));
      setUpcomingAppointments(upcoming);
    } catch (error) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#2196F3',
      in_progress: '#9C27B0',
      completed: '#4CAF50',
      cancelled: '#F44336',
      searching: '#FF9800'
    };
    return colors[status] || '#7C8685';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Ожидание',
      confirmed: 'Подтвержден',
      in_progress: 'В работе',
      completed: 'Завершен',
      cancelled: 'Отменен',
      searching: 'Поиск сервиса'
    };
    return texts[status] || status;
  };

  const quickActions = [
    {
      icon: <DirectionsCar />,
      title: "Управление автомобилями",
      subtitle: "Добавьте или измените данные авто",
      color: "#E3311D",
      onClick: () => navigate('/cars')
    },
    {
      icon: <Build />,
      title: "Найти услуги",
      subtitle: "Поиск сервисов и запись онлайн",
      color: "#2196F3",
      onClick: () => navigate('/services')
    },
    {
      icon: <Schedule />,
      title: "Мои заказы",
      subtitle: "История и текущие заказы",
      color: "#FFA500",
      onClick: () => navigate('/orders')
    },
    {
      icon: <Chat />,
      title: "Поддержка",
      subtitle: "Помощь и консультации",
      color: "#4CAF50",
      onClick: () => navigate('/support')
    }
  ];

  return (
      <Fade in={true} timeout={800}>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
          py: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '400px',
            background: `
            radial-gradient(circle at 20% 50%, ${alpha('#E3311D', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${alpha('#2196F3', 0.1)} 0%, transparent 50%)
          `,
            zIndex: 0
          }
        }}>
          <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ mb: 6 }}>
              <Slide in={!loading} direction="down" timeout={500}>
                <Box>
                  <div style={{marginTop: "30px"}}>
                    <Typography variant="h3" sx={{
                      color: '#FFFFFF',
                      fontWeight: 800,
                      mb: 4,
                      fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                      background: 'linear-gradient(135deg, #FFFFFF, #AAACA1)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Добро пожаловать, {user?.name}!
                    </Typography>
                  </div>

                  <Typography variant="h6" sx={{
                    color: '#7C8685',
                    fontSize: { xs: '1rem', md: '1.25rem' }
                  }}>
                    {user?.role === 'business'
                        ? 'Управляйте вашим бизнесом и заказами'
                        : 'Отслеживайте ваши автомобили и заказы на услуги'
                    }
                  </Typography>
                </Box>
              </Slide>
            </Box>

            {error && (
                <Alert severity="error" sx={{
                  mb: 4,
                  bgcolor: alpha('#E3311D', 0.1),
                  border: `1px solid ${alpha('#E3311D', 0.3)}`,
                  borderRadius: 3
                }}>
                  {error}
                </Alert>
            )}

            <Card sx={{ mb: 4, p: 2, background: 'transparent', border: 'none' }}>
              <Box sx={{ mt: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={14} md={10}>
                    <TextField
                        fullWidth
                        placeholder="Найти сервис по названию или услуге..."
                        value={serviceFilter}
                        onChange={(e) => setServiceFilter(e.target.value)}
                        InputProps={{
                          startAdornment: (
                              <InputAdornment position="start">
                                <Search />
                              </InputAdornment>
                          )
                        }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={goToServices}
                        sx={{
                          background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                          py: 1.5
                        }}
                    >
                      Найти
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            {/* Новая строка: три равных колонки */}
            {/* Новая строка: три равных колонки */}
            <Grid container spacing={4} alignItems="stretch">
              {/* 1) Личный кабинет */}
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Slide in={!loading} direction="right" timeout={700}>
                  <Box sx={{ width: '100%', display: 'flex' }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <PersonalCard
                          user={user}
                          carsCount={stats.cars}
                          onAddCar={() => navigate('/cars')}
                          onGoCars={() => navigate('/cars')}
                          onGoOrders={() => navigate('/orders')}
                          onGoBalance={() => navigate('/balance')}
                          onGoSettings={() => navigate('/settings')}
                      />
                    </Box>
                  </Box>
                </Slide>
              </Grid>

              {/* 2) Быстрые действия (2x2) */}
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Slide in={!loading} direction="up" timeout={700}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.05))',
                      border: '1px solid',
                      borderColor: alpha('#7C8685', 0.12),
                      borderRadius: 3,
                      overflow: 'hidden'
                    }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Speed sx={{ fontSize: 28, color: '#E3311D' }} />
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                            Быстрые действия
                          </Typography>
                        </Box>

                        {/* Сетка 2x2 */}
                        <Box
                            sx={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: 2
                            }}
                        >
                          {quickActions.map((action, index) => (
                              <Box key={index} sx={{
                                height: { xs: 110, md: 120 }, // регулирование «квадратности»; or use aspectRatio: '1/1'
                                display: 'flex'
                              }}>
                                <QuickActionButton {...action} sx={{ height: '100%' }} />
                              </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                </Slide>
              </Grid>

              {/* 3) Последние заказы */}
              <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
                <Slide in={!loading} direction="left" timeout={1100}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: alpha('#7C8685', 0.2),
                      borderRadius: 3,
                      height: '100%'
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        {/* Вставьте сюда ваш существующий контент для последних заказов (тот же JSX) */}
                        {recentOrders.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <Schedule sx={{ fontSize: 48, color: '#7C8685', mb: 2 }} />
                              <Typography variant="body1" sx={{ color: '#7C8685', mb: 2, fontWeight: 600 }}>
                                У вас пока нет заказов
                              </Typography>
                              <Button
                                  variant="contained"
                                  onClick={() => navigate('/services')}
                                  sx={{ background: 'linear-gradient(135deg, #E3311D, #FF6B5B)', borderRadius: 3 }}
                              >
                                Найти услуги
                              </Button>
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {recentOrders.map((order) => (
                                  <Box key={order._id}
                                       sx={{
                                         p: 2,
                                         border: '1px solid',
                                         borderColor: alpha('#7C8685', 0.2),
                                         borderRadius: 2,
                                         cursor: 'pointer',
                                         transition: 'all 0.3s ease',
                                         '&:hover': {
                                           borderColor: getStatusColor(order.status),
                                           transform: 'translateX(4px)',
                                           boxShadow: `0 4px 16px ${alpha(getStatusColor(order.status), 0.2)}`
                                         }
                                       }}
                                       onClick={() => navigate('/orders')}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                      <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }}>
                                        {order.service?.name}
                                      </Typography>
                                      <Chip label={getStatusText(order.status)} size="small"
                                            sx={{ backgroundColor: alpha(getStatusColor(order.status), 0.2), color: getStatusColor(order.status), fontSize: '0.7rem', fontWeight: 600 }} />
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                                      {order.business?.businessName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#E3311D', fontWeight: 600, fontSize: '0.8rem', mt: 0.5 }}>
                                      {order.price} ₽ • {new Date(order.scheduledDate).toLocaleDateString('ru-RU')}
                                    </Typography>
                                  </Box>
                              ))}
                            </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Box>
                </Slide>
              </Grid>
            </Grid>


          </Container>
        </Box>
      </Fade>
  );
};

export default Dashboard;
