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
import { useLocation } from 'react-router-dom';

// Этот компонент специально адаптирован под ваш mock-эндпоинт
// http://localhost:5000/api/mockServices

const Services = () => {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, [filters.search, filters.page]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || '';
    if (q) {
      setFilters(prev => ({ ...prev, search: q, page: 1 }));
    }
    // если нужен ещё какой-то параметр (category и т.д.) — можно аналогично прочитать
  }, [location.search]);

  // Берём данные прямо с указанного вами эндпоинта
  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/mockServices');
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      const data = await res.json();

      // Приведём объекты к структуре, с которой удобнее работать в UI
      const normalized = data.map((item, idx) => ({
        _id: item._id || `mock-${idx}`,
        name: item.name,
        phones: item.phones || [],
        hours: item.hours || '',
        servicesList: item.services || [],
        address: item.address || 'Адрес не указан',
        rating: {
          average: (typeof item.rating === 'number') ? item.rating : (item.rating?.average || 0),
          count: item.rating?.count || 0
        },
        description: item.services ? item.services.join(', ') : '',
        // добавим заглушку для совместимости со старым UI
        images: item.images || [],
        price: item.price || '—'
      }));

      setServices(normalized);
      setPagination({ total: normalized.length, pages: 1 });
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить данные с http://localhost:5000/api/mockServices');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const applyPriceFilter = () => {
    // Для mock-данных пока просто закрываем панель
    setFilterDrawer(false);
  };

  const clearFilters = () => {
    setFilters({ search: '', page: 1, limit: 12 });
    setPriceRange([0, 10000]);
  };

  const handlePageChange = (event, value) => {
    setFilters(prev => ({ ...prev, page: value }));
    window.scrollTo(0, 0);
  };

  const ServiceCard = ({ service }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Card sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.05))',
          backdropFilter: 'blur(6px)',
          border: '1px solid',
          borderColor: alpha('#7C8685', 0.12),
          transition: 'all 0.18s ease',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            height: 140,
            background: '#363636FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fafafa',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {service.images?.[0] && !imageError ? (
                <img
                    src={service.images[0]}
                    alt={service.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <DirectionsCar sx={{ fontSize: 52, opacity: 0.9 }} />
            )}

            <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
              <Chip label={service.servicesList?.[0] || 'Услуга'} size="small" sx={{ fontWeight: 700 }} />
            </Box>

            <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Star sx={{ fontSize: 16 }} />
              <Typography sx={{ fontWeight: 700 }}>{service.rating?.average?.toFixed?.(1) || service.rating?.average || '0.0'}</Typography>
            </Box>
          </Box>

          <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>{service.name}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Place sx={{ fontSize: 16, color: '#E3311D' }} />
              <Typography variant="body2" sx={{ color: '#7C8685' }}>{service.address}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Schedule sx={{ fontSize: 16, color: '#E3311D' }} />
              <Typography variant="body2" sx={{ color: '#7C8685' }}>{service.hours}</Typography>
            </Box>

            <Typography variant="body2" sx={{ color: '#AAACA1', mb: 1 }}>{service.description}</Typography>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
              {service.servicesList?.slice(0, 4).map((s, i) => (
                  <Chip key={i} label={s} size="small" variant="outlined" sx={{ borderColor: alpha('#7C8685', 0.15) }} />
              ))}
              {service.servicesList?.length > 4 && (
                  <Typography variant="caption" sx={{ color: '#7C8685', alignSelf: 'center' }}>+{service.servicesList.length - 4}</Typography>
              )}
            </Box>

            <Divider sx={{ borderColor: alpha('#7C8685', 0.12), my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Контакты</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {service.phones?.slice(0, 3).map((p, idx) => (
                      <Typography key={idx} variant="body2" sx={{ color: '#7C8685' }}>{p}</Typography>
                  ))}
                  {service.phones?.length > 3 && (
                      <Typography variant="caption" sx={{ color: '#7C8685' }}>и ещё {service.phones.length - 3}</Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="contained" size="small" onClick={() => { navigator.clipboard?.writeText(service.phones?.[0] || ''); }}>
                  Скопировать телефон
                </Button>
                <Button variant="outlined" size="small" onClick={() => alert('Звонок/чат (заглушка)')}>
                  Написать
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
    );
  };

  // простой фильтр по тексту
  const filteredServices = services.filter(s => {
    if (!filters.search) return true;
    const q = filters.search.toLowerCase();
    return (
        s.name.toLowerCase().includes(q) ||
        s.servicesList.join(' ').toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
    );
  });

  // пагинация на клиенте
  const start = (filters.page - 1) * filters.limit;
  const paged = filteredServices.slice(start, start + filters.limit);

  return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700 }}>Автосервисы (mock)</Typography>
            <Typography variant="body1" sx={{ color: '#7C8685' }}>Данные берутся с http://localhost:5000/api/mockServices</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Card sx={{ mb: 4, p: 2, background: 'transparent', border: 'none' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField fullWidth placeholder="Поиск по названию, адресу, услугам..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} InputProps={{ startAdornment: <Search sx={{ mr: 1 }} /> }} />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant="outlined" startIcon={<FilterList />} onClick={() => setFilterDrawer(true)}>Фильтры</Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant="contained" onClick={fetchServices}>Обновить</Button>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button fullWidth variant="text" onClick={clearFilters}>Сбросить</Button>
              </Grid>
            </Grid>
          </Card>

          {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
          ) : paged.length === 0 ? (
              <Card sx={{ textAlign: 'center', py: 6 }}>
                <DirectionsCar sx={{ fontSize: 64, color: '#7C8685', mb: 2 }} />
                <Typography variant="h5" sx={{ color: '#FFFFFF' }}>Сервисы не найдены</Typography>
                <Typography sx={{ color: '#7C8685' }}>Попробуйте изменить поиск</Typography>
              </Card>
          ) : (
              <>
                <Grid container spacing={3}>
                  {paged.map(s => (
                      <Grid item xs={12} key={s._id} style={{width: "100%"}}>
                        <ServiceCard service={s} />
                      </Grid>
                  ))}
                </Grid>


                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination count={Math.ceil(filteredServices.length / filters.limit)} page={filters.page} onChange={handlePageChange} />
                </Box>
              </>
          )}
        </Container>

        <Drawer anchor="right" open={filterDrawer} onClose={() => setFilterDrawer(false)} PaperProps={{ sx: { width: isMobile ? '100%' : 360 } }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Фильтры</Typography>
              <IconButton onClick={() => setFilterDrawer(false)}><Close /></IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ mb: 1 }}>Диапазон цен</Typography>
            <Slider value={priceRange} onChange={handlePriceRangeChange} min={0} max={10000} step={100} valueLabelDisplay="auto" />

            <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={applyPriceFilter}>Применить</Button>
          </Box>
        </Drawer>
      </Box>
  );
};

export default Services;
