import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Rating,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  Slider,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search,
  Place,
  Schedule,
  FilterList,
  Close,
  Star,
  DirectionsCar,
  LocalOffer,
  Phone,
  WhatsApp,
  Telegram
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    city: 'Minsk',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'rating',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  const [priceRange, setPriceRange] = useState([0, 10000]);
  
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/services/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/services?${params}`);
      setServices(response.data.data);
      setPagination(response.data.pagination || {});
    } catch (error) {
      setError('Ошибка при загрузке сервисов');
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      page: 1
    }));
    setFilterDrawer(false);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      city: 'Minsk',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sortBy: 'rating',
      page: 1,
      limit: 12
    });
    setPriceRange([0, 10000]);
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
    window.scrollTo(0, 0);
  };

  const ServiceCard = ({ service }) => {
    const [imageError, setImageError] = useState(false);

    const handleBookService = (e) => {
      e.stopPropagation();
      if (!user) {
        navigate('/login');
        return;
      }
      navigate(`/service/${service._id}/book`);
    };

    const handleContact = (e, type) => {
      e.stopPropagation();
      // Логика связи с сервисом
      console.log(`Contact via ${type}:`, service.business?.contact);
    };

    return (
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: alpha('#7C8685', 0.2),
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-8px)',
          borderColor: '#E3311D',
          boxShadow: `0 20px 60px ${alpha('#E3311D', 0.2)}`,
          '& .service-image': {
            transform: 'scale(1.05)'
          }
        }
      }}
      onClick={() => navigate(`/service/${service._id}`)}
      >
        {/* Изображение сервиса */}
        <Box sx={{
          height: 160,
          background: service.images?.[0] && !imageError 
            ? `url(${service.images[0]}) center/cover`
            : 'linear-gradient(135deg, #E3311D, #C12918)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="service-image"
        >
          {service.images?.[0] && !imageError ? (
            <img 
              src={service.images[0]} 
              alt={service.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                transition: 'transform 0.3s ease'
              }}
              onError={() => setImageError(true)}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <DirectionsCar sx={{ fontSize: 48, opacity: 0.8 }} />
            </Box>
          )}
          
          {/* Категория */}
          <Chip
            label={service.category}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'linear-gradient(135deg, #E3311D, #C12918)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24
            }}
          />

          {/* Рейтинг */}
          <Box sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: alpha('#000000', 0.8),
            borderRadius: 2,
            px: 1,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <Star sx={{ fontSize: 16, color: '#FFD700' }} />
            <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem' }}>
              {service.rating?.average?.toFixed(1) || '0.0'}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Название и локация */}
          <Typography variant="h6" gutterBottom sx={{ 
            color: '#FFFFFF', 
            fontWeight: 700, 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '56px'
          }}>
            {service.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Place sx={{ fontSize: 16, color: '#E3311D', flexShrink: 0 }} />
            <Typography variant="body2" sx={{ 
              color: '#7C8685', 
              fontSize: '0.8rem',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {service.business?.address?.street || service.location?.address || 'Адрес не указан'}
            </Typography>
          </Box>

          {/* Описание */}
          <Typography variant="body2" sx={{ 
            color: '#AAACA1', 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '40px',
            fontSize: '0.8rem'
          }}>
            {service.description}
          </Typography>

          {/* Время работы */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Schedule sx={{ fontSize: 16, color: '#E3311D', flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
              {service.workingHours?.open || '09:00'} - {service.workingHours?.close || '18:00'}
            </Typography>
          </Box>

          {/* Отзывы */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Rating 
              value={service.rating?.average || 0} 
              readOnly 
              size="small" 
              precision={0.5}
              sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }}
            />
            <Typography variant="body2" sx={{ color: '#7C8685', fontSize: '0.8rem' }}>
              ({service.rating?.count || 0} отзывов)
            </Typography>
          </Box>

          <Divider sx={{ borderColor: alpha('#7C8685', 0.2), mb: 2 }} />

          {/* Цена и действия */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ 
                color: '#E3311D', 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                от {service.price} ₽
              </Typography>
              <Typography variant="caption" sx={{ color: '#7C8685' }}>
                базовая услуга
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={handleBookService}
                sx={{
                  background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                  color: '#FFFFFF',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #C12A1A, #E3311D)',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <LocalOffer sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

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
            Автосервисы
          </Typography>
          <Typography variant="h6" sx={{ color: '#7C8685' }}>
            Найдите лучшие сервисы для вашего автомобиля
          </Typography>
        </Box>

        {/* Уведомления */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: alpha('#E3311D', 0.1) }}>
            {error}
          </Alert>
        )}

        {/* Поиск и фильтры */}
        <Card sx={{ 
          mb: 6,
          p: 3,
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: alpha('#7C8685', 0.2),
          borderRadius: 3
        }}>
          <Grid container spacing={2} alignItems="center">
            {/* Поиск */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Поиск сервисов, услуг..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: '#7C8685', mr: 1 }} />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#FFFFFF',
                    '& fieldset': { borderColor: '#7C8685' },
                    '&:hover fieldset': { borderColor: '#E3311D' },
                    '&.Mui-focused fieldset': { borderColor: '#E3311D' }
                  },
                  '& .MuiInputLabel-root': { color: '#7C8685' }
                }}
              />
            </Grid>
            
            {/* Категория */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#7C8685' }}>Категория</InputLabel>
                <Select
                  value={filters.category}
                  label="Категория"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  sx={{
                    color: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' }
                  }}
                >
                  <MenuItem value="all">Все категории</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Сортировка */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#7C8685' }}>Сортировка</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Сортировка"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  sx={{
                    color: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                  }}
                >
                  <MenuItem value="rating">По рейтингу</MenuItem>
                  <MenuItem value="price_asc">По цене (возр.)</MenuItem>
                  <MenuItem value="price_desc">По цене (убыв.)</MenuItem>
                  <MenuItem value="name">По названию</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Рейтинг */}
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#7C8685' }}>Рейтинг</InputLabel>
                <Select
                  value={filters.rating}
                  label="Рейтинг"
                  onChange={(e) => handleFilterChange('rating', e.target.value)}
                  sx={{
                    color: '#FFFFFF',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#7C8685' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E3311D' },
                  }}
                >
                  <MenuItem value="">Любой рейтинг</MenuItem>
                  <MenuItem value="4.5">4.5+ ⭐</MenuItem>
                  <MenuItem value="4">4.0+ ⭐</MenuItem>
                  <MenuItem value="3">3.0+ ⭐</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Кнопка фильтров */}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterDrawer(true)}
                sx={{
                  borderColor: '#E3311D',
                  color: '#E3311D',
                  height: '56px',
                  '&:hover': {
                    borderColor: '#FF6B6B',
                    backgroundColor: alpha('#E3311D', 0.1)
                  }
                }}
              >
                Фильтры
              </Button>
            </Grid>
          </Grid>
        </Card>

        {/* Результаты */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#E3311D' }} />
          </Box>
        ) : services.length === 0 ? (
          <Card sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
            backdropFilter: 'blur(20px)',
            border: '1px solid',
            borderColor: alpha('#7C8685', 0.2),
            borderRadius: 3
          }}>
            <DirectionsCar sx={{ fontSize: 64, color: '#7C8685', mb: 2 }} />
            <Typography variant="h5" sx={{ color: '#FFFFFF', mb: 1, fontWeight: 600 }}>
              Сервисы не найдены
            </Typography>
            <Typography variant="body1" sx={{ color: '#7C8685', mb: 3 }}>
              Попробуйте изменить параметры поиска или сбросить фильтры
            </Typography>
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{
                borderColor: '#E3311D',
                color: '#E3311D',
                '&:hover': {
                  borderColor: '#FF6B6B',
                  backgroundColor: alpha('#E3311D', 0.1)
                }
              }}
            >
              Сбросить фильтры
            </Button>
          </Card>
        ) : (
          <>
            {/* Статистика */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ color: '#7C8685' }}>
                Найдено сервисов: <strong style={{ color: '#FFFFFF' }}>{pagination.total || services.length}</strong>
              </Typography>
              {(filters.category !== 'all' || filters.rating || filters.minPrice || filters.maxPrice) && (
                <Button
                  size="small"
                  onClick={clearFilters}
                  sx={{ color: '#E3311D' }}
                >
                  Сбросить все
                </Button>
              )}
            </Box>

            {/* Список сервисов */}
            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} lg={4} xl={3} key={service._id}>
                  <ServiceCard service={service} />
                </Grid>
              ))}
            </Grid>

            {/* Пагинация */}
            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={pagination.pages}
                  page={filters.page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#FFFFFF',
                      border: `1px solid ${alpha('#7C8685', 0.3)}`,
                      '&.Mui-selected': {
                        backgroundColor: '#E3311D',
                        color: '#FFFFFF',
                        borderColor: '#E3311D',
                        '&:hover': {
                          backgroundColor: '#C12A1A'
                        }
                      },
                      '&:hover': {
                        backgroundColor: alpha('#E3311D', 0.1),
                        borderColor: '#E3311D'
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Боковая панель фильтров */}
      <Drawer
        anchor="right"
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #050507, #0A0A0F)',
            borderLeft: `1px solid ${alpha('#7C8685', 0.2)}`,
            width: isMobile ? '100%' : 400,
            p: 3
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
            Фильтры
          </Typography>
          <IconButton onClick={() => setFilterDrawer(false)} sx={{ color: '#7C8685' }}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: alpha('#7C8685', 0.2), mb: 3 }} />

        {/* Диапазон цен */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2, fontWeight: 600 }}>
            Диапазон цен
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${value} ₽`}
            min={0}
            max={10000}
            step={100}
            sx={{
              color: '#E3311D',
              '& .MuiSlider-valueLabel': {
                backgroundColor: '#E3311D',
                color: '#FFFFFF'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" sx={{ color: '#7C8685' }}>
              {priceRange[0]} ₽
            </Typography>
            <Typography variant="body2" sx={{ color: '#7C8685' }}>
              {priceRange[1]} ₽
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="contained"
          onClick={applyPriceFilter}
          sx={{
            background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
            borderRadius: 2,
            py: 1.5,
            mt: 2,
            '&:hover': {
              background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
            }
          }}
        >
          Применить фильтры
        </Button>
      </Drawer>
    </Box>
  );
};

export default Services;