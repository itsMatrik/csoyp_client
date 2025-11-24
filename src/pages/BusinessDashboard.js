import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  Slide,
  Container,
  Avatar,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  TrendingUp,
  People,
  Star,
  Schedule,
  CheckCircle,
  Cancel,
  Visibility,
  Message,
  LocalOffer,
  CarRepair,
  Payment,
  Notifications,
  Business,
  Dashboard
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);

  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    newOrders: 0
  });
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    setLoading(true);
    setError('');
    try {
      const [servicesRes, ordersRes] = await Promise.all([
        api.get('/services/business/my-services'),
        api.get('/orders/business/my-orders?limit=20')
      ]);

      setServices(servicesRes.data.data);
      setOrders(ordersRes.data.data);

      // Расчет статистики
      const totalServices = servicesRes.data.count;
      const activeOrders = ordersRes.data.data.filter(order => 
        ['pending', 'confirmed', 'in_progress'].includes(order.status)
      ).length;
      const completedOrders = ordersRes.data.data.filter(order => 
        order.status === 'completed'
      ).length;
      const newOrders = ordersRes.data.data.filter(order => 
        order.status === 'pending'
      ).length;
      const totalRevenue = ordersRes.data.data
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + order.price, 0);
      
      // Расчет среднего рейтинга
      const completedOrdersWithRating = ordersRes.data.data.filter(order => 
        order.status === 'completed' && order.review
      );
      const averageRating = completedOrdersWithRating.length > 0 
        ? completedOrdersWithRating.reduce((sum, order) => sum + order.review.rating, 0) / completedOrdersWithRating.length
        : 0;

      setStats({
        totalServices,
        activeOrders,
        completedOrders,
        totalRevenue,
        averageRating: Number(averageRating.toFixed(1)),
        newOrders
      });
    } catch (error) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSubmit = async (serviceData) => {
    try {
      if (editingService) {
        await api.put(`/services/${editingService._id}`, serviceData);
        setSuccess('Услуга успешно обновлена');
      } else {
        await api.post('/services', serviceData);
        setSuccess('Услуга успешно создана');
      }
      setServiceDialogOpen(false);
      setEditingService(null);
      fetchBusinessData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при сохранении услуги');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту услугу?')) return;

    try {
      await api.delete(`/services/${serviceId}`);
      setSuccess('Услуга удалена');
      fetchBusinessData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Ошибка при удалении услуги');
    }
  };

  const handleOrderStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      setSuccess('Статус заказа обновлен');
      fetchBusinessData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Ошибка при обновлении статуса заказа');
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color, onClick }) => (
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
        
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '15px',
              background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.7)})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: `0 8px 24px ${alpha(color, 0.3)}`,
              flexShrink: 0
            }}>
              {icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ 
                color: color, 
                fontWeight: 800,
                mb: 0.5,
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
                fontSize: '1rem'
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
          {/* Заголовок */}
          <Box sx={{ mb: 6 }}>
            <Slide in={!loading} direction="down" timeout={500}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                <Box>
                  <Typography variant="h3" sx={{ 
                    color: '#FFFFFF', 
                    fontWeight: 800, 
                    mb: 1,
                    background: 'linear-gradient(135deg, #FFFFFF, #AAACA1)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Бизнес-панель
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#7C8685' }}>
                    Управляйте услугами и заказами вашего бизнеса
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                      fontSize: '1.2rem',
                      fontWeight: 700
                    }}
                  >
                    {user?.businessName?.charAt(0)?.toUpperCase() || 'B'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      {user?.businessName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#7C8685' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                </Box>
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
          {success && (
            <Alert severity="success" sx={{ 
              mb: 4, 
              bgcolor: alpha('#4CAF50', 0.1),
              border: `1px solid ${alpha('#4CAF50', 0.3)}`,
              borderRadius: 3
            }}>
              {success}
            </Alert>
          )}

          {/* Статистика */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<LocalOffer />}
                title="Услуги"
                value={stats.totalServices}
                color="#E3311D"
                subtitle="активных"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<Notifications />}
                title="Новые заказы"
                value={stats.newOrders}
                color="#FFA500"
                subtitle="требуют внимания"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<Schedule />}
                title="Активные"
                value={stats.activeOrders}
                color="#2196F3"
                subtitle="в работе"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<CheckCircle />}
                title="Завершено"
                value={stats.completedOrders}
                color="#4CAF50"
                subtitle="в этом месяце"
              />
            </Grid>
            <Grid item xs={6} sm={4} md={2.4}>
              <StatCard
                icon={<TrendingUp />}
                title="Выручка"
                value={`${stats.totalRevenue}₽`}
                color="#FFD700"
                subtitle="общая"
              />
            </Grid>
          </Grid>

          {/* Табы */}
          <Card sx={{ 
            mb: 4,
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
            border: '1px solid',
            borderColor: alpha('#7C8685', 0.2),
            borderRadius: 3
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  color: '#7C8685',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  py: 2,
                  minHeight: 'auto',
                  '&.Mui-selected': {
                    color: '#E3311D'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#E3311D',
                  height: 3
                }
              }}
            >
              <Tab icon={<Dashboard />} label="Обзор" />
              <Tab icon={<LocalOffer />} label={`Услуги (${services.length})`} />
              <Tab icon={<Schedule />} label={`Заказы (${orders.length})`} />
              <Tab icon={<Star />} label="Отзывы" />
            </Tabs>
          </Card>

          {/* Контент табов */}
          {activeTab === 0 && (
            <Grid container spacing={4}>
              {/* Услуги */}
              <Grid item xs={12} lg={6}>
                <Slide in={!loading} direction="right" timeout={700}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LocalOffer sx={{ fontSize: 28, color: '#E3311D' }} />
                          <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                            Мои услуги
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setServiceDialogOpen(true)}
                          sx={{
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            borderRadius: 3,
                            px: 3,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
                            }
                          }}
                        >
                          Добавить
                        </Button>
                      </Box>

                      {services.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <LocalOffer sx={{ fontSize: 64, color: '#7C8685', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1, fontWeight: 600 }}>
                            У вас пока нет услуг
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#7C8685', mb: 3 }}>
                            Создайте первую услугу для привлечения клиентов
                          </Typography>
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setServiceDialogOpen(true)}
                            sx={{
                              background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                              borderRadius: 3
                            }}
                          >
                            Создать услугу
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          {services.slice(0, 5).map((service) => (
                            <Card key={service._id} sx={{
                              background: 'linear-gradient(135deg, rgba(54, 46, 45, 0.6), rgba(124, 134, 133, 0.05))',
                              border: '1px solid',
                              borderColor: alpha('#7C8685', 0.1),
                              borderRadius: 2,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                borderColor: alpha('#E3311D', 0.3),
                                transform: 'translateX(4px)'
                              }
                            }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6" sx={{ color: '#FFFFFF', fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                                      {service.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#E3311D', fontWeight: 700, mb: 0.5 }}>
                                      {service.price} ₽
                                    </Typography>
                                    <Chip
                                      label={service.category}
                                      size="small"
                                      sx={{
                                        backgroundColor: alpha('#7C8685', 0.2),
                                        color: '#7C8685',
                                        fontSize: '0.7rem',
                                        height: 20
                                      }}
                                    />
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 1 }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setEditingService(service);
                                        setServiceDialogOpen(true);
                                      }}
                                      sx={{ 
                                        color: '#7C8685',
                                        '&:hover': { color: '#2196F3' }
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteService(service._id)}
                                      sx={{ 
                                        color: '#7C8685',
                                        '&:hover': { color: '#F44336' }
                                      }}
                                    >
                                      <Delete />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                          {services.length > 5 && (
                            <Button 
                              variant="text" 
                              sx={{ color: '#E3311D', mt: 1 }}
                              onClick={() => setActiveTab(1)}
                            >
                              Показать все услуги ({services.length})
                            </Button>
                          )}
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>

              {/* Последние заказы */}
              <Grid item xs={12} lg={6}>
                <Slide in={!loading} direction="left" timeout={900}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Schedule sx={{ fontSize: 28, color: '#2196F3' }} />
                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                          Последние заказы
                        </Typography>
                      </Box>

                      {orders.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Schedule sx={{ fontSize: 64, color: '#7C8685', mb: 2 }} />
                          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1, fontWeight: 600 }}>
                            Заказов пока нет
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#7C8685' }}>
                            Новые заказы появятся здесь
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ color: '#7C8685', borderColor: alpha('#7C8685', 0.2), fontWeight: 600 }}>Клиент</TableCell>
                                <TableCell sx={{ color: '#7C8685', borderColor: alpha('#7C8685', 0.2), fontWeight: 600 }}>Услуга</TableCell>
                                <TableCell sx={{ color: '#7C8685', borderColor: alpha('#7C8685', 0.2), fontWeight: 600 }}>Статус</TableCell>
                                <TableCell sx={{ color: '#7C8685', borderColor: alpha('#7C8685', 0.2), fontWeight: 600 }}>Действия</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orders.slice(0, 5).map((order) => (
                                <TableRow 
                                  key={order._id}
                                  sx={{ 
                                    '&:hover': {
                                      backgroundColor: alpha('#7C8685', 0.05)
                                    }
                                  }}
                                >
                                  <TableCell sx={{ color: '#FFFFFF', borderColor: alpha('#7C8685', 0.1) }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                                        {order.user?.name?.charAt(0)?.toUpperCase() || 'C'}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                          {order.user?.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#7C8685' }}>
                                          {order.car?.make} {order.car?.model}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ color: '#FFFFFF', borderColor: alpha('#7C8685', 0.1) }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {order.service?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#E3311D', fontWeight: 600 }}>
                                      {order.price} ₽
                                    </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderColor: alpha('#7C8685', 0.1) }}>
                                    <Chip
                                      label={getStatusText(order.status)}
                                      size="small"
                                      sx={{
                                        backgroundColor: alpha(getStatusColor(order.status), 0.2),
                                        color: getStatusColor(order.status),
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                        border: `1px solid ${getStatusColor(order.status)}`
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ borderColor: alpha('#7C8685', 0.1) }}>
                                    {order.status === 'pending' && (
                                      <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleOrderStatusUpdate(order._id, 'confirmed')}
                                          sx={{ 
                                            color: '#4CAF50',
                                            background: alpha('#4CAF50', 0.1),
                                            '&:hover': {
                                              background: alpha('#4CAF50', 0.2)
                                            }
                                          }}
                                        >
                                          <CheckCircle fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          size="small"
                                          onClick={() => handleOrderStatusUpdate(order._id, 'cancelled')}
                                          sx={{ 
                                            color: '#F44336',
                                            background: alpha('#F44336', 0.1),
                                            '&:hover': {
                                              background: alpha('#F44336', 0.2)
                                            }
                                          }}
                                        >
                                          <Cancel fontSize="small" />
                                        </IconButton>
                                      </Box>
                                    )}
                                    {order.status === 'confirmed' && (
                                      <IconButton
                                        size="small"
                                        onClick={() => handleOrderStatusUpdate(order._id, 'in_progress')}
                                        sx={{ 
                                          color: '#2196F3',
                                          background: alpha('#2196F3', 0.1),
                                          '&:hover': {
                                            background: alpha('#2196F3', 0.2)
                                          }
                                        }}
                                      >
                                        <Schedule fontSize="small" />
                                      </IconButton>
                                    )}
                                    {order.status === 'in_progress' && (
                                      <IconButton
                                        size="small"
                                        onClick={() => handleOrderStatusUpdate(order._id, 'completed')}
                                        sx={{ 
                                          color: '#4CAF50',
                                          background: alpha('#4CAF50', 0.1),
                                          '&:hover': {
                                            background: alpha('#4CAF50', 0.2)
                                          }
                                        }}
                                      >
                                        <CheckCircle fontSize="small" />
                                      </IconButton>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            </Grid>
          )}

          {/* Диалог создания/редактирования услуги */}
          <ServiceDialog
            open={serviceDialogOpen}
            onClose={() => {
              setServiceDialogOpen(false);
              setEditingService(null);
            }}
            onSave={handleServiceSubmit}
            service={editingService}
          />
        </Container>
      </Box>
    </Fade>
  );
};

// Компонент диалога для создания/редактирования услуги
const ServiceDialog = ({ open, onClose, onSave, service }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: 60,
    category: 'maintenance',
    contactPhone: '',
    location: {
      address: '',
      city: 'Minsk'
    },
    workingHours: {
      open: '09:00',
      close: '18:00',
      workingDays: [1,2,3,4,5]
    }
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: 60,
        category: 'maintenance',
        contactPhone: '',
        location: {
          address: '',
          city: 'Minsk'
        },
        workingHours: {
          open: '09:00',
          close: '18:00',
          workingDays: [1,2,3,4,5]
        }
      });
    }
  }, [service]);

  const handleSubmit = () => {
    onSave(formData);
  };

  const categories = [
    { value: 'maintenance', label: 'Техобслуживание' },
    { value: 'repair', label: 'Ремонт' },
    { value: 'diagnostics', label: 'Диагностика' },
    { value: 'tires', label: 'Шины и диски' },
    { value: 'cleaning', label: 'Чистка и мойка' },
    { value: 'tuning', label: 'Тюнинг' },
    { value: 'electronics', label: 'Электроника' },
    { value: 'bodywork', label: 'Кузовные работы' },
    { value: 'other', label: 'Другие услуги' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #050507, #0A0A0F)',
          border: '1px solid',
          borderColor: alpha('#7C8685', 0.2),
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        color: '#FFFFFF', 
        borderBottom: `1px solid ${alpha('#7C8685', 0.2)}`,
        pb: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {service ? 'Редактировать услугу' : 'Добавить новую услугу'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Название услуги"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: '#7C8685' },
                  '&:hover fieldset': { borderColor: '#E3311D' },
                  '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                },
                '& .MuiInputLabel-root': { color: '#7C8685' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Описание"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: '#7C8685' },
                  '&:hover fieldset': { borderColor: '#E3311D' },
                  '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                },
                '& .MuiInputLabel-root': { color: '#7C8685' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Цена (₽)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: '#7C8685' },
                  '&:hover fieldset': { borderColor: '#E3311D' },
                  '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                },
                '& .MuiInputLabel-root': { color: '#7C8685' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Длительность (мин)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: '#7C8685' },
                  '&:hover fieldset': { borderColor: '#E3311D' },
                  '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                },
                '& .MuiInputLabel-root': { color: '#7C8685' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#7C8685' }}>Категория</InputLabel>
              <Select
                value={formData.category}
                label="Категория"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{
                  color: '#FFFFFF',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' }
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Телефон для связи"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: '#7C8685' },
                  '&:hover fieldset': { borderColor: '#E3311D' },
                  '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                },
                '& .MuiInputLabel-root': { color: '#7C8685' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Адрес"
              value={formData.location.address}
              onChange={(e) => setFormData({ 
                ...formData, 
                location: { ...formData.location, address: e.target.value }
              })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#FFFFFF',
                  '& fieldset': { borderColor: '#7C8685' },
                  '&:hover fieldset': { borderColor: '#E3311D' },
                  '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                },
                '& .MuiInputLabel-root': { color: '#7C8685' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ 
        borderTop: `1px solid ${alpha('#7C8685', 0.2)}`,
        pt: 2,
        px: 3,
        pb: 3
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#7C8685',
            '&:hover': { color: '#AAACA1' }
          }}
        >
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!formData.name || !formData.price}
          sx={{
            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
            borderRadius: 2,
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
            }
          }}
        >
          {service ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusinessDashboard;