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
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
  IconButton,
  Alert
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Schedule,
  Star,
  Add,
  ArrowForward,
  TrendingUp,
  Notifications,
  CalendarToday,
  LocalOffer,
  Speed,
  CarRepair,
  Payment,
  Chat
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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
        {/* Анимированный фон */}
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

const QuickActionButton = ({ icon, title, subtitle, color, onClick }) => {
  return (
    <Button 
      variant="outlined" 
      startIcon={icon}
      onClick={onClick}
      sx={{ 
        justifyContent: 'flex-start',
        py: 2,
        px: 3,
        borderColor: alpha('#7C8685', 0.3),
        color: '#FFFFFF',
        background: alpha('#0A0A0F', 0.5),
        borderRadius: 3,
        transition: 'all 0.3s ease',
        textAlign: 'left',
        '&:hover': {
          borderColor: color,
          color: color,
          backgroundColor: alpha(color, 0.1),
          transform: 'translateX(8px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.2)}`
        }
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#7C8685', fontSize: '0.75rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Button>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      // Получаем автомобили пользователя
      const carsResponse = await api.get('/cars');
      const carsCount = carsResponse.data.length;

      // Получаем заказы пользователя
      const ordersResponse = await api.get('/orders/my-orders?limit=10');
      const orders = ordersResponse.data.data;
      const ordersCount = ordersResponse.data.total;
      
      const activeOrders = orders.filter(order => 
        ['pending', 'confirmed', 'in_progress', 'searching'].includes(order.status)
      ).length;
      
      const completedOrders = orders.filter(order => 
        order.status === 'completed'
      ).length;

      // Расчет общей суммы потраченных средств
      const totalSpent = orders
        .filter(order => order.status === 'completed' && order.price)
        .reduce((sum, order) => sum + order.price, 0);

      // Ближайшие записи (сегодня и завтра)
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
          {/* Заголовок и приветствие */}
          <Box sx={{ mb: 6 }}>
            <Slide in={!loading} direction="down" timeout={500}>
              <Box>
                <Typography variant="h3" sx={{ 
                  color: '#FFFFFF', 
                  fontWeight: 800, 
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                  background: 'linear-gradient(135deg, #FFFFFF, #AAACA1)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Добро пожаловать, {user?.name}!
                </Typography>
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

          {/* Уведомления */}
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

          {/* Статистика */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<DirectionsCar />}
                title="Автомобили"
                value={stats.cars}
                color="#E3311D"
                onClick={() => navigate('/cars')}
                loading={loading}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<Schedule />}
                title="Всего заказов"
                value={stats.orders}
                color="#2196F3"
                onClick={() => navigate('/orders')}
                loading={loading}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<Build />}
                title="Активные"
                value={stats.activeOrders}
                color="#FFA500"
                onClick={() => navigate('/orders')}
                loading={loading}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<Star />}
                title="Завершено"
                value={stats.completedOrders}
                color="#4CAF50"
                onClick={() => navigate('/orders?status=completed')}
                loading={loading}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<Payment />}
                title="Потрачено"
                value={`${stats.totalSpent}₽`}
                color="#9C27B0"
                subtitle="всего"
                loading={loading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4}>
            {/* Быстрые действия и ближайшие записи */}
            <Grid item xs={12} lg={8}>
              <Grid container spacing={4}>
                {/* Быстрые действия */}
                <Grid item xs={12}>
                  <Slide in={!loading} direction="right" timeout={700}>
                    <Card sx={{
                      background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: alpha('#7C8685', 0.2),
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                          <Speed sx={{ fontSize: 28, color: '#E3311D' }} />
                          <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                            Быстрые действия
                          </Typography>
                        </Box>
                        
                        <Grid container spacing={2}>
                          {quickActions.map((action, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <QuickActionButton {...action} />
                            </Grid>
                          ))}
                        </Grid>

                        {stats.cars === 0 && (
                          <Box sx={{ 
                            mt: 3, 
                            p: 3, 
                            background: alpha('#E3311D', 0.1), 
                            borderRadius: 3,
                            border: `1px solid ${alpha('#E3311D', 0.3)}`,
                            textAlign: 'center'
                          }}>
                            <Typography variant="body1" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
                              🚗 Добавьте первый автомобиль
                            </Typography>
                            <Button 
                              variant="contained"
                              startIcon={<Add />}
                              onClick={() => navigate('/cars')}
                              sx={{
                                background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                                borderRadius: 3,
                                px: 4,
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
                                }
                              }}
                            >
                              Добавить автомобиль
                            </Button>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>

                {/* Ближайшие записи */}
                {upcomingAppointments.length > 0 && (
                  <Grid item xs={12}>
                    <Slide in={!loading} direction="right" timeout={900}>
                      <Card sx={{
                        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid',
                        borderColor: alpha('#2196F3', 0.3),
                        borderRadius: 3
                      }}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <CalendarToday sx={{ fontSize: 28, color: '#2196F3' }} />
                            <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                              Ближайшие записи
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {upcomingAppointments.map((appointment) => (
                              <Box 
                                key={appointment._id}
                                sx={{ 
                                  p: 3, 
                                  background: alpha('#2196F3', 0.1),
                                  border: `1px solid ${alpha('#2196F3', 0.2)}`,
                                  borderRadius: 2,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateX(4px)',
                                    borderColor: '#2196F3'
                                  }
                                }}
                                onClick={() => navigate('/orders')}
                              >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                  <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                    {appointment.service?.name}
                                  </Typography>
                                  <Chip
                                    label={getStatusText(appointment.status)}
                                    size="small"
                                    sx={{
                                      backgroundColor: alpha(getStatusColor(appointment.status), 0.2),
                                      color: getStatusColor(appointment.status),
                                      fontWeight: 600
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ color: '#7C8685', mb: 1 }}>
                                  {appointment.business?.businessName}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#2196F3', fontWeight: 600 }}>
                                  📅 {new Date(appointment.scheduledDate).toLocaleDateString('ru-RU')} 
                                  {' в '} {appointment.preferredTime}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Grid>
                )}
              </Grid>
            </Grid>

            {/* Последние заказы */}
            <Grid item xs={12} lg={4}>
              <Slide in={!loading} direction="left" timeout={1100}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: alpha('#7C8685', 0.2),
                  borderRadius: 3,
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CarRepair sx={{ fontSize: 28, color: '#FFA500' }} />
                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                          Последние заказы
                        </Typography>
                      </Box>
                      <Button 
                        endIcon={<ArrowForward />}
                        onClick={() => navigate('/orders')}
                        sx={{ 
                          color: '#E3311D',
                          fontWeight: 600,
                          '&:hover': {
                            color: '#FF6B5B'
                          }
                        }}
                      >
                        Все
                      </Button>
                    </Box>

                    {recentOrders.length === 0 ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Schedule sx={{ fontSize: 48, color: '#7C8685', mb: 2 }} />
                        <Typography variant="body1" sx={{ color: '#7C8685', mb: 2, fontWeight: 600 }}>
                          У вас пока нет заказов
                        </Typography>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/services')}
                          sx={{
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            borderRadius: 3
                          }}
                        >
                          Найти услуги
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {recentOrders.map((order) => (
                          <Box 
                            key={order._id}
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
                              <Typography variant="body1" sx={{ 
                                color: '#FFFFFF', 
                                fontWeight: 600,
                                fontSize: '0.9rem'
                              }}>
                                {order.service?.name}
                              </Typography>
                              <Chip
                                label={getStatusText(order.status)}
                                size="small"
                                sx={{
                                  backgroundColor: alpha(getStatusColor(order.status), 0.2),
                                  color: getStatusColor(order.status),
                                  fontSize: '0.7rem',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                              {order.business?.businessName}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: '#E3311D', 
                              fontWeight: 600,
                              fontSize: '0.8rem',
                              mt: 0.5
                            }}>
                              {order.price} ₽ • {new Date(order.scheduledDate).toLocaleDateString('ru-RU')}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default Dashboard;