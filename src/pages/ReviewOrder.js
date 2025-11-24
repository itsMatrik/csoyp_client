import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Rating,
  TextField,
  Container,
  alpha,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Star,
  DirectionsCar,
  Build,
  Schedule,
  Payment,
  LocationOn,
  CheckCircle,
  SentimentVerySatisfied,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentVeryDissatisfied
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ReviewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/orders/${id}`);
      const orderData = response.data;

      if (!orderData) {
        setError('Заказ не найден');
        return;
      }

      if (orderData.status !== 'completed') {
        setError('Можно оставить отзыв только для завершенных заказов');
        return;
      }

      if (orderData.review) {
        setError('Вы уже оставили отзыв для этого заказа');
        return;
      }

      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Ошибка при загрузке заказа');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (rating < 1) {
      setError('Пожалуйста, поставьте оценку');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post(`/orders/${id}/review`, {
        rating,
        comment: comment.trim()
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.message || 'Ошибка при отправке отзыва');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (value) => {
    const labels = {
      1: { text: 'Ужасно', icon: <SentimentVeryDissatisfied />, color: '#F44336' },
      2: { text: 'Плохо', icon: <SentimentDissatisfied />, color: '#FF9800' },
      3: { text: 'Нормально', icon: <SentimentSatisfied />, color: '#FFC107' },
      4: { text: 'Хорошо', icon: <SentimentSatisfied />, color: '#8BC34A' },
      5: { text: 'Отлично!', icon: <SentimentVerySatisfied />, color: '#4CAF50' }
    };
    return labels[value] || labels[5];
  };

  const getRatingDescription = (value) => {
    const descriptions = {
      1: 'Очень плохой опыт',
      2: 'Могло быть лучше',
      3: 'Удовлетворительно',
      4: 'Хорошее обслуживание',
      5: 'Превосходный сервис!'
    };
    return descriptions[value] || '';
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
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: '#E3311D', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#7C8685' }}>
            Загрузка заказа...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !order) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}>
        <Container maxWidth="sm">
          <Fade in={true} timeout={800}>
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: alpha('#7C8685', 0.2),
              borderRadius: 3,
              textAlign: 'center',
              p: 4
            }}>
              <Box sx={{ mb: 3 }}>
                <SentimentDissatisfied sx={{ fontSize: 64, color: '#FF9800', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 1, fontWeight: 700 }}>
                  Не удалось загрузить заказ
                </Typography>
                <Alert severity="error" sx={{ 
                  bgcolor: alpha('#E3311D', 0.1),
                  border: `1px solid ${alpha('#E3311D', 0.3)}`,
                  borderRadius: 2
                }}>
                  {error}
                </Alert>
              </Box>
              <Button
                variant="contained"
                onClick={() => navigate('/orders')}
                sx={{
                  background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
                  }
                }}
              >
                Вернуться к заказам
              </Button>
            </Card>
          </Fade>
        </Container>
      </Box>
    );
  }

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
          height: '300px',
          background: `
            radial-gradient(circle at 30% 20%, ${alpha('#E3311D', 0.1)} 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, ${alpha('#FFD700', 0.1)} 0%, transparent 50%)
          `,
          zIndex: 0
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Кнопка назад */}
          <Slide in={!loading} direction="down" timeout={500}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/orders')}
              sx={{ 
                color: '#AAACA1',
                mb: 4,
                borderRadius: 2,
                px: 3,
                '&:hover': {
                  color: '#E3311D',
                  backgroundColor: alpha('#E3311D', 0.1)
                }
              }}
            >
              Назад к заказам
            </Button>
          </Slide>

          {success ? (
            <Zoom in={success} timeout={1000}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha('#4CAF50', 0.3),
                borderRadius: 3,
                textAlign: 'center',
                p: 6
              }}>
                <Box sx={{ mb: 4 }}>
                  <CheckCircle sx={{ 
                    fontSize: 80, 
                    color: '#4CAF50', 
                    mb: 3,
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }} />
                  <Typography variant="h3" sx={{ 
                    color: '#FFFFFF', 
                    mb: 2, 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Спасибо за отзыв!
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#7C8685', mb: 3, fontWeight: 400 }}>
                    Ваше мнение помогает улучшать сервис для всех клиентов
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
                    background: alpha('#4CAF50', 0.1),
                    borderRadius: 3,
                    border: `1px solid ${alpha('#4CAF50', 0.3)}`
                  }}>
                    <Star sx={{ color: '#FFD700' }} />
                    <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                      Вы поставили оценку: {rating}/5
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#7C8685' }}>
                  Перенаправляем к списку заказов через 3 секунды...
                </Typography>
                <CircularProgress 
                  size={24} 
                  sx={{ color: '#4CAF50', mt: 2 }} 
                />
              </Card>
            </Zoom>
          ) : (
            <Grid container spacing={4}>
              {/* Информация о заказе */}
              <Grid item xs={12} md={5}>
                <Slide in={!loading} direction="right" timeout={700}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 3,
                    height: '100%'
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ 
                        color: '#FFFFFF', 
                        mb: 3, 
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}>
                        <CheckCircle sx={{ color: '#4CAF50' }} />
                        Заказ завершен
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            <Build />
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                              {order.service?.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7C8685' }}>
                              {order.business?.businessName}
                            </Typography>
                          </Box>
                        </Box>

                        <Chip
                          label={order.service?.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#E3311D', 0.2),
                            color: '#E3311D',
                            fontWeight: 600,
                            mb: 2
                          }}
                        />
                      </Box>

                      <Divider sx={{ borderColor: alpha('#7C8685', 0.2), my: 3 }} />

                      {/* Детали заказа */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <DirectionsCar sx={{ color: '#E3311D', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                              Автомобиль
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                              {order.car?.make} {order.car?.model}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                              {order.car?.licensePlate}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Schedule sx={{ color: '#E3311D', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                              Дата обслуживания
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                              {new Date(order.updatedAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Payment sx={{ color: '#E3311D', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                              Стоимость
                            </Typography>
                            <Typography variant="h6" sx={{ 
                              color: '#E3311D', 
                              fontWeight: 700,
                              background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}>
                              {order.price} ₽
                            </Typography>
                          </Box>
                        </Box>

                        {order.business?.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocationOn sx={{ color: '#E3311D', fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
                                Адрес сервиса
                              </Typography>
                              <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
                                {order.business.address}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>

              {/* Форма отзыва */}
              <Grid item xs={12} md={7}>
                <Slide in={!loading} direction="left" timeout={900}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h4" sx={{ 
                        color: '#FFFFFF', 
                        mb: 1, 
                        fontWeight: 800,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #FFFFFF, #AAACA1)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}>
                        Оставить отзыв
                      </Typography>
                      
                      <Typography variant="body1" sx={{ 
                        color: '#7C8685', 
                        textAlign: 'center', 
                        mb: 4,
                        fontWeight: 400
                      }}>
                        Поделитесь вашим опытом обслуживания в сервисе
                      </Typography>

                      {error && (
                        <Alert severity="error" sx={{ 
                          mb: 3,
                          bgcolor: alpha('#E3311D', 0.1),
                          border: `1px solid ${alpha('#E3311D', 0.3)}`,
                          borderRadius: 2
                        }}>
                          {error}
                        </Alert>
                      )}

                      {/* Оценка */}
                      <Box sx={{ textAlign: 'center', mb: 4, p: 3, background: alpha('#362E2D', 0.5), borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 3, fontWeight: 600 }}>
                          Как вы оцениваете качество услуги?
                        </Typography>
                        
                        <Rating
                          value={rating}
                          onChange={(event, newValue) => {
                            setRating(newValue);
                            setError('');
                          }}
                          size="large"
                          sx={{
                            fontSize: isMobile ? '2.5rem' : '3.5rem',
                            mb: 2,
                            '& .MuiRating-icon': {
                              color: '#FFD700'
                            },
                            '& .MuiRating-iconFilled': {
                              color: '#FFD700'
                            },
                            '& .MuiRating-iconHover': {
                              color: '#FFD700'
                            }
                          }}
                        />
                        
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          gap: 1,
                          mb: 1
                        }}>
                          <Box sx={{ color: getRatingLabel(rating).color }}>
                            {getRatingLabel(rating).icon}
                          </Box>
                          <Typography variant="h6" sx={{ 
                            color: getRatingLabel(rating).color, 
                            fontWeight: 700 
                          }}>
                            {getRatingLabel(rating).text}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: '#7C8685' }}>
                          {getRatingDescription(rating)}
                        </Typography>
                      </Box>

                      {/* Комментарий */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
                          📝 Ваш отзыв
                        </Typography>
                        <TextField
                          multiline
                          rows={4}
                          placeholder="Расскажите подробнее о вашем опыте. Что понравилось в обслуживании? Что можно улучшить? Ваш отзыв поможет другим клиентам и сервису стать лучше."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              color: '#FFFFFF',
                              '& fieldset': { 
                                borderColor: alpha('#7C8685', 0.3),
                                borderRadius: 2
                              },
                              '&:hover fieldset': { 
                                borderColor: '#E3311D',
                              },
                              '&.Mui-focused fieldset': { 
                                borderColor: '#E3311D',
                              }
                            },
                            '& .MuiInputLabel-root': { color: '#7C8685' },
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#7C8685', mt: 1, display: 'block' }}>
                          Необязательное поле. Максимум 500 символов.
                        </Typography>
                      </Box>

                      {/* Кнопка отправки */}
                      <Box sx={{ textAlign: 'center' }}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleSubmitReview}
                          disabled={submitting || rating < 1}
                          startIcon={submitting ? <CircularProgress size={20} /> : <Star />}
                          sx={{
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                            minWidth: '250px',
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(227, 49, 29, 0.3)',
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
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {submitting ? 'Отправка...' : 'Опубликовать отзыв'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Fade>
  );
};

export default ReviewOrder;