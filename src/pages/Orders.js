import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Container,
  Tabs,
  Tab,
  Button,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  DirectionsCar,
  Build,
  Schedule,
  CheckCircle,
  Pending,
  Cancel,
  Star,
  ArrowForward,
  MoreVert,
  Edit,
  Message,
  LocationOn,
  AccessTime,
  Payment,
  Receipt
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OrderCard = ({ order, onStatusUpdate }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: '#FFA500',
      confirmed: '#2196F3',
      in_progress: '#9C27B0',
      completed: '#4CAF50',
      cancelled: '#F44336',
      searching: '#FF9800',
      rejected: '#795548'
    };
    return statusColors[status] || '#7C8685';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending sx={{ fontSize: 16 }} />,
      confirmed: <CheckCircle sx={{ fontSize: 16 }} />,
      in_progress: <Schedule sx={{ fontSize: 16 }} />,
      completed: <CheckCircle sx={{ fontSize: 16 }} />,
      cancelled: <Cancel sx={{ fontSize: 16 }} />,
      searching: <Pending sx={{ fontSize: 16 }} />,
      rejected: <Cancel sx={{ fontSize: 16 }} />
    };
    return icons[status] || <Pending sx={{ fontSize: 16 }} />;
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Ожидает подтверждения',
      confirmed: 'Подтвержден',
      in_progress: 'В работе',
      completed: 'Завершен',
      cancelled: 'Отменен',
      searching: 'Поиск сервиса',
      rejected: 'Отклонен'
    };
    return statusTexts[status] || status;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCancelOrder = async () => {
    handleMenuClose();
    if (window.confirm('Вы уверены, что хотите отменить заказ?')) {
      try {
        await api.put(`/orders/${order._id}/status`, { status: 'cancelled' });
        onStatusUpdate();
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
  };

  const handleReviewSubmit = async () => {
    setLoading(true);
    try {
      await api.post(`/orders/${order._id}/review`, reviewData);
      setReviewDialog(false);
      onStatusUpdate();
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCancel = ['pending', 'searching', 'confirmed'].includes(order.status);
  const canReview = order.status === 'completed' && !order.review;

  return (
    <>
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(getStatusColor(order.status), 0.3)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          borderColor: getStatusColor(order.status),
          boxShadow: `0 8px 32px ${alpha(getStatusColor(order.status), 0.2)}`
        },
        position: 'relative',
        overflow: 'visible'
      }}>
        {/* Статусная полоса */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${getStatusColor(order.status)}, ${alpha(getStatusColor(order.status), 0.5)})`,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }} />

        <CardContent sx={{ p: 3, pt: 4 }}>
          {/* Заголовок и меню */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            mb: 3
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ 
                color: '#FFFFFF', 
                fontWeight: 700, 
                mb: 1,
                background: 'linear-gradient(135deg, #FFFFFF, #AAACA1)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {order.service?.name}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Build sx={{ fontSize: 18, color: '#E3311D' }} />
                  <Typography variant="body2" sx={{ color: '#7C8685' }}>
                    {order.business?.businessName || 'Сервис'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCar sx={{ fontSize: 18, color: '#E3311D' }} />
                  <Typography variant="body2" sx={{ color: '#7C8685' }}>
                    {order.car?.make} {order.car?.model} • {order.car?.licensePlate}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 18, color: '#E3311D' }} />
                  <Typography variant="body2" sx={{ color: '#7C8685' }}>
                    {order.business?.address?.city || 'Город'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={getStatusIcon(order.status)}
                label={getStatusText(order.status)}
                size="medium"
                sx={{
                  backgroundColor: alpha(getStatusColor(order.status), 0.15),
                  color: getStatusColor(order.status),
                  fontWeight: 700,
                  border: `1px solid ${getStatusColor(order.status)}`,
                  fontSize: '0.8rem'
                }}
              />
              
              <IconButton 
                size="small" 
                onClick={handleMenuOpen}
                sx={{ color: '#7C8685' }}
              >
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          {/* Детали заказа */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AccessTime sx={{ fontSize: 20, color: '#E3311D' }} />
                <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600 }}>
                  Дата и время:
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                {new Date(order.scheduledDate).toLocaleDateString('ru-RU')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAACA1' }}>
                {order.preferredTime}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Payment sx={{ fontSize: 20, color: '#E3311D' }} />
                <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600 }}>
                  Стоимость:
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ 
                color: '#E3311D', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {order.price} ₽
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Receipt sx={{ fontSize: 20, color: '#E3311D' }} />
                <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600 }}>
                  Тип услуги:
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                {order.service?.category || 'Обслуживание'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Schedule sx={{ fontSize: 20, color: '#E3311D' }} />
                <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600 }}>
                  Длительность:
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                {order.estimatedDuration || '2-3 часа'}
              </Typography>
            </Grid>
          </Grid>

          {/* Заметки */}
          {order.userNotes && (
            <Box sx={{ 
              mb: 2, 
              p: 2, 
              background: alpha('#362E2D', 0.6), 
              borderRadius: 2,
              border: `1px solid ${alpha('#7C8685', 0.2)}`
            }}>
              <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600, mb: 0.5 }}>
                📝 Ваши заметки:
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAACA1' }}>
                {order.userNotes}
              </Typography>
            </Box>
          )}

          {order.businessNotes && (
            <Box sx={{ 
              mb: 2, 
              p: 2, 
              background: alpha('#2196F3', 0.1), 
              borderRadius: 2,
              border: `1px solid ${alpha('#2196F3', 0.3)}`
            }}>
              <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600, mb: 0.5 }}>
                💼 Заметки сервиса:
              </Typography>
              <Typography variant="body2" sx={{ color: '#AAACA1' }}>
                {order.businessNotes}
              </Typography>
            </Box>
          )}

          {/* Отзыв */}
          {order.review && (
            <Box sx={{ 
              mb: 2, 
              p: 2, 
              background: alpha('#4CAF50', 0.1), 
              borderRadius: 2,
              border: `1px solid ${alpha('#4CAF50', 0.3)}` 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Star sx={{ color: '#FFD700' }} />
                <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                  Ваша оценка: {order.review.rating}/5
                </Typography>
              </Box>
              {order.review.comment && (
                <Typography variant="body2" sx={{ color: '#7C8685' }}>
                  {order.review.comment}
                </Typography>
              )}
            </Box>
          )}

          {/* Кнопки действий */}
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-end'
          }}>
            {canCancel && (
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancelOrder}
                sx={{
                  borderColor: '#F44336',
                  color: '#F44336',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    borderColor: '#D32F2F',
                    backgroundColor: alpha('#F44336', 0.1),
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Отменить заказ
              </Button>
            )}
            
            {canReview && (
              <Button
                variant="contained"
                startIcon={<Star />}
                onClick={() => setReviewDialog(true)}
                sx={{
                  background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #F57C00, #FF9800)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Оставить отзыв
              </Button>
            )}

            <Button
              variant="outlined"
              startIcon={<Message />}
              onClick={() => navigate(`/chat?order=${order._id}`)}
              sx={{
                borderColor: '#2196F3',
                color: '#2196F3',
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  borderColor: '#1976D2',
                  backgroundColor: alpha('#2196F3', 0.1),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Чат с сервисом
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Меню действий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #050507, #0A0A0F)',
            border: '1px solid',
            borderColor: alpha('#7C8685', 0.2),
            borderRadius: 2,
            minWidth: 180
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ fontSize: 18, mr: 1, color: '#7C8685' }} />
          <Typography sx={{ color: '#FFFFFF' }}>Детали</Typography>
        </MenuItem>
        <MenuItem onClick={() => navigate(`/chat?order=${order._id}`)}>
          <Message sx={{ fontSize: 18, mr: 1, color: '#7C8685' }} />
          <Typography sx={{ color: '#FFFFFF' }}>Написать</Typography>
        </MenuItem>
        {canCancel && (
          <MenuItem onClick={handleCancelOrder}>
            <Cancel sx={{ fontSize: 18, mr: 1, color: '#F44336' }} />
            <Typography sx={{ color: '#F44336' }}>Отменить</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Диалог отзыва */}
      <Dialog 
        open={reviewDialog} 
        onClose={() => setReviewDialog(false)}
        maxWidth="sm"
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
            Оставить отзыв
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
              {order.service?.name}
            </Typography>
            <Typography variant="body1" sx={{ color: '#7C8685', mb: 3 }}>
              Как вам услуга от {order.business?.businessName}?
            </Typography>
            
            <Rating
              value={reviewData.rating}
              onChange={(event, newValue) => {
                setReviewData(prev => ({ ...prev, rating: newValue }));
              }}
              size="large"
              sx={{ 
                fontSize: '2.5rem',
                '& .MuiRating-iconFilled': { color: '#FFD700' },
                '& .MuiRating-iconHover': { color: '#FFD700' }
              }}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Ваш отзыв (необязательно)"
            value={reviewData.comment}
            onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: '#7C8685' },
                '&:hover fieldset': { borderColor: '#AAACA1' },
                '&.Mui-focused fieldset': { borderColor: '#E3311D' }
              },
              '& .MuiInputLabel-root': { color: '#7C8685' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#E3311D' }
            }}
          />
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: `1px solid ${alpha('#7C8685', 0.2)}`,
          pt: 2,
          px: 3,
          pb: 3
        }}>
          <Button 
            onClick={() => setReviewDialog(false)}
            sx={{ 
              color: '#7C8685',
              '&:hover': { color: '#AAACA1' }
            }}
          >
            Отмена
          </Button>
          <Button 
            variant="contained"
            onClick={handleReviewSubmit}
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
              borderRadius: 2,
              px: 4,
              '&:hover': {
                background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Отправить отзыв'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [statusStats, setStatusStats] = useState({});
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const status = activeTab === 'all' ? '' : activeTab;
      const response = await api.get(`/orders/my-orders?status=${status}`);
      setOrders(response.data.data);
      setStatusStats(response.data.statusStats || {});
    } catch (error) {
      setError('Ошибка при загрузке заказов');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    { value: 'all', label: 'Все заказы', count: orders.length },
    { value: 'pending', label: 'Ожидание', count: statusStats.pending || 0 },
    { value: 'confirmed', label: 'Подтверждены', count: statusStats.confirmed || 0 },
    { value: 'in_progress', label: 'В работе', count: statusStats.in_progress || 0 },
    { value: 'completed', label: 'Завершены', count: statusStats.completed || 0 },
    { value: 'cancelled', label: 'Отменены', count: statusStats.cancelled || 0 }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Заголовок */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#FFFFFF', 
              fontWeight: 700, 
              mb: 1,
              background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Мои заказы
          </Typography>
          <Typography variant="h6" sx={{ color: '#7C8685' }}>
            Управляйте бронированиями и отслеживайте статус услуг
          </Typography>
        </Box>

        {/* Уведомления */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: alpha('#E3311D', 0.1) }}>
            {error}
          </Alert>
        )}

        {/* Табы */}
        <Card sx={{ 
          mb: 6,
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
          backdropFilter: 'blur(20px)',
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
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    {tab.count > 0 && (
                      <Box sx={{
                        backgroundColor: activeTab === tab.value ? '#E3311D' : alpha('#7C8685', 0.3),
                        color: activeTab === tab.value ? '#FFFFFF' : '#7C8685',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {tab.count}
                      </Box>
                    )}
                  </Box>
                }
              />
            ))}
          </Tabs>
        </Card>

        {/* Список заказов */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#E3311D' }} />
          </Box>
        ) : orders.length === 0 ? (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha('#7C8685', 0.2),
            borderRadius: 3
          }}>
            <Box sx={{ mb: 3 }}>
              <Schedule sx={{ fontSize: 64, color: '#7C8685', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 1, fontWeight: 600 }}>
                {activeTab === 'all' ? 'Заказов пока нет' : `Нет заказов со статусом "${tabs.find(t => t.value === activeTab)?.label}"`}
              </Typography>
              <Typography variant="body1" sx={{ color: '#7C8685', mb: 3 }}>
                {activeTab === 'all' 
                  ? 'Начните с поиска услуг для вашего автомобиля' 
                  : 'Заказы с этим статусом появятся здесь'
                }
              </Typography>
            </Box>
            {activeTab === 'all' && (
              <Button
                variant="contained"
                onClick={() => navigate('/services')}
                endIcon={<ArrowForward />}
                sx={{
                  background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Найти услуги
              </Button>
            )}
          </Card>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} key={order._id}>
                <OrderCard order={order} onStatusUpdate={fetchOrders} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Orders;