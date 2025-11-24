import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Container,
  Rating,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  alpha
} from '@mui/material';
import {
  Place,
  Schedule,
  Phone,
  ArrowBack,
  CheckCircle,
  DirectionsCar,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [similarServices, setSimilarServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const timeSlots = [
    '09:00-11:00', '11:00-13:00', '13:00-15:00', 
    '15:00-17:00', '17:00-19:00'
  ];

  useEffect(() => {
    fetchServiceDetails();
    if (user) {
      fetchUserCars();
    }
  }, [id, user]);

  const fetchServiceDetails = async () => {
    try {
      const response = await api.get(`/services/${id}`);
      setService(response.data.data.service);
      setSimilarServices(response.data.data.similarServices || []);
    } catch (error) {
      console.error('Error fetching service details:', error);
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
      if (response.data.length > 0) {
        setSelectedCar(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedCar || !selectedDate || !selectedTime) {
      return;
    }

    setOrderLoading(true);
    try {
      await api.post('/orders', {
        serviceId: id,
        carId: selectedCar,
        scheduledDate: selectedDate,
        preferredTime: selectedTime,
        userNotes
      });
      
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderDialogOpen(false);
        setOrderSuccess(false);
        navigate('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  const getNextWeekdays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" sx={{ color: '#7C8685' }}>
          Загрузка...
        </Typography>
      </Box>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/services')}
          sx={{ 
            color: '#AAACA1',
            mb: 3,
            '&:hover': {
              color: '#E3311D'
            }
          }}
        >
          Назад к поиску
        </Button>

        <Grid container spacing={4}>
          {/* Основная информация */}
          <Grid item xs={12} lg={8}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#7C8685', 0.2),
              mb: 4
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box>
                    <Chip 
                      label={service.category} 
                      sx={{
                        background: 'linear-gradient(135deg, #E3311D, #C12918)',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        mb: 2
                      }}
                    />
                    <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
                      {service.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#E3311D', fontWeight: 700 }}>
                      {service.price} ₽
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={service.rating?.average || 0} readOnly precision={0.5} />
                      <Typography variant="body1" sx={{ color: '#7C8685' }}>
                        ({service.rating?.count || 0} отзывов)
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#7C8685' }}>
                      Время работы: {service.duration} мин
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1" sx={{ color: '#AAACA1', lineHeight: 1.7, mb: 4 }}>
                  {service.description}
                </Typography>

                <Divider sx={{ borderColor: alpha('#7C8685', 0.2), mb: 3 }} />

                {/* Контактная информация */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Place sx={{ color: '#E3311D' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#7C8685' }}>
                          Адрес
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                          {service.location?.address || 'Не указан'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone sx={{ color: '#E3311D' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#7C8685' }}>
                          Телефон
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                          {service.contactPhone || 'Не указан'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Schedule sx={{ color: '#E3311D' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#7C8685' }}>
                          Часы работы
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                          {service.workingHours?.open || '09:00'} - {service.workingHours?.close || '18:00'}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DirectionsCar sx={{ color: '#E3311D' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: '#7C8685' }}>
                          Сервис
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
                          {service.business?.businessName || 'Не указан'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Похожие сервисы */}
            {similarServices.length > 0 && (
              <Box>
                <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                  Похожие сервисы
                </Typography>
                <Grid container spacing={2}>
                  {similarServices.map((similarService) => (
                    <Grid item xs={12} sm={6} key={similarService._id}>
                      <Card 
                        sx={{
                          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(124, 134, 133, 0.1))',
                          border: '1px solid',
                          borderColor: alpha('#7C8685', 0.2),
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            borderColor: '#E3311D',
                            transform: 'translateY(-2px)'
                          }
                        }}
                        onClick={() => navigate(`/service/${similarService._id}`)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="h6" sx={{ color: '#FFFFFF', fontSize: '1rem', mb: 1 }}>
                            {similarService.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#E3311D', fontWeight: 600 }}>
                            {similarService.price} ₽
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Боковая панель - бронирование */}
          <Grid item xs={12} lg={4}>
            <Card sx={{
              position: 'sticky',
              top: 100,
              background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#7C8685', 0.2),
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                  Забронировать услугу
                </Typography>

                {!user ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#7C8685', mb: 2 }}>
                      Войдите в систему, чтобы забронировать услугу
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/login')}
                    >
                      Войти
                    </Button>
                  </Box>
                ) : cars.length === 0 ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ color: '#7C8685', mb: 2 }}>
                      Добавьте автомобиль для бронирования
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => navigate('/cars')}
                    >
                      Добавить автомобиль
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => setOrderDialogOpen(true)}
                      sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderRadius: '12px'
                      }}
                    >
                      Забронировать сейчас
                    </Button>
                    
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                        ⚡ Подтверждение в течение 2 часов
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                        🔧 Гарантия качества работ
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Диалог бронирования */}
        <Dialog 
          open={orderDialogOpen} 
          onClose={() => !orderLoading && setOrderDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #0A0A0F, #050507)',
              border: '1px solid',
              borderColor: alpha('#7C8685', 0.2),
              borderRadius: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#FFFFFF', 
            borderBottom: '1px solid',
            borderColor: alpha('#7C8685', 0.2),
            background: 'linear-gradient(135deg, rgba(227, 49, 29, 0.1), transparent)'
          }}>
            <Typography variant="h5" component="div">
              Бронирование услуги
            </Typography>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            {orderSuccess ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckCircle sx={{ fontSize: 64, color: '#E3311D', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 1 }}>
                  Заявка успешно создана!
                </Typography>
                <Typography variant="body1" sx={{ color: '#7C8685' }}>
                  Перенаправляем в ваши заказы...
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#7C8685' }}>Выберите автомобиль</InputLabel>
                  <Select
                    value={selectedCar}
                    label="Выберите автомобиль"
                    onChange={(e) => setSelectedCar(e.target.value)}
                    sx={{
                      color: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                    }}
                  >
                    {cars.map((car) => (
                      <MenuItem key={car._id} value={car._id}>
                        {car.make} {car.model} ({car.licensePlate})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#7C8685' }}>Дата визита</InputLabel>
                  <Select
                    value={selectedDate}
                    label="Дата визита"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{
                      color: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                    }}
                  >
                    {getNextWeekdays().map((date) => (
                      <MenuItem key={date} value={date}>
                        {new Date(date).toLocaleDateString('ru-RU', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#7C8685' }}>Временной интервал</InputLabel>
                  <Select
                    value={selectedTime}
                    label="Временной интервал"
                    onChange={(e) => setSelectedTime(e.target.value)}
                    sx={{
                      color: '#FFFFFF',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                    }}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Дополнительные пожелания"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#FFFFFF',
                      '& fieldset': { borderColor: '#7C8685' },
                      '&:hover fieldset': { borderColor: '#E3311D' },
                    },
                    '& .MuiInputLabel-root': { color: '#7C8685' },
                  }}
                />

                <Box sx={{ 
                  p: 2, 
                  background: alpha('#362E2D', 0.5),
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: alpha('#7C8685', 0.2)
                }}>
                  <Typography variant="body1" sx={{ color: '#7C8685' }}>
                    Итоговая стоимость:
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#E3311D', fontWeight: 700 }}>
                    {service.price} ₽
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          
          {!orderSuccess && (
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <Button 
                onClick={() => setOrderDialogOpen(false)}
                disabled={orderLoading}
                sx={{ color: '#7C8685' }}
              >
                Отмена
              </Button>
              <Button
                variant="contained"
                onClick={handleCreateOrder}
                disabled={orderLoading || !selectedCar || !selectedDate || !selectedTime}
                sx={{ px: 4 }}
              >
                {orderLoading ? 'Создание заявки...' : 'Подтвердить бронирование'}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default ServiceDetail;