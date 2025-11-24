import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  DirectionsCar,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cars = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    licensePlate: '',
    vin: '',
    fuelType: 'petrol',
    engineSize: '',
    isPrimary: false
  });

  const fuelTypes = [
    { value: 'petrol', label: 'Бензин' },
    { value: 'diesel', label: 'Дизель' },
    { value: 'electric', label: 'Электрический' },
    { value: 'hybrid', label: 'Гибридный' },
    { value: 'lpg', label: 'Газ' }
  ];

  const colors = [
    'Черный', 'Белый', 'Серый', 'Серебристый', 'Красный', 
    'Синий', 'Зеленый', 'Желтый', 'Оранжевый', 'Коричневый'
  ];

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await api.get('/cars');
      setCars(response.data);
      setError('');
    } catch (error) {
      setError('Ошибка при загрузке автомобилей');
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (car = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({
        make: car.make || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        color: car.color || '',
        licensePlate: car.licensePlate || '',
        vin: car.vin || '',
        fuelType: car.fuelType || 'petrol',
        engineSize: car.engineSize || '',
        isPrimary: car.isPrimary || false
      });
    } else {
      setEditingCar(null);
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        licensePlate: '',
        vin: '',
        fuelType: 'petrol',
        engineSize: '',
        isPrimary: cars.length === 0 // Первый автомобиль - основной
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCar(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      if (editingCar) {
        await api.put(`/cars/${editingCar._id}`, formData);
        setSuccess('Автомобиль успешно обновлен');
      } else {
        await api.post('/cars', formData);
        setSuccess('Автомобиль успешно добавлен');
      }
      
      await fetchCars();
      handleCloseDialog();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при сохранении автомобиля');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот автомобиль?')) return;

    try {
      await api.delete(`/cars/${carId}`);
      setSuccess('Автомобиль удален');
      await fetchCars();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Ошибка при удалении автомобиля');
    }
  };

  const handleSetPrimary = async (carId) => {
    try {
      await api.put(`/cars/${carId}`, { isPrimary: true });
      setSuccess('Основной автомобиль изменен');
      await fetchCars();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Ошибка при изменении основного автомобиля');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <CircularProgress sx={{ color: '#E3311D' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
      py: 4,
      px: 2
    }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
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
            Мои автомобили
          </Typography>
          <Typography variant="h6" sx={{ color: '#7C8685' }}>
            Управляйте вашими автомобилями и настройками
          </Typography>
        </Box>

        {/* Уведомления */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, bgcolor: alpha('#E3311D', 0.1) }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3, bgcolor: alpha('#4CAF50', 0.1) }}>
            {success}
          </Alert>
        )}

        {/* Кнопка добавления */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
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
              },
              transition: 'all 0.3s ease'
            }}
          >
            Добавить автомобиль
          </Button>
        </Box>

        {/* Список автомобилей */}
        <Grid container spacing={3}>
          {cars.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha('#7C8685', 0.2),
                textAlign: 'center',
                py: 8
              }}>
                <CardContent>
                  <DirectionsCar sx={{ fontSize: 64, color: '#7C8685', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', mb: 2 }}>
                    У вас пока нет автомобилей
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#7C8685', mb: 3 }}>
                    Добавьте первый автомобиль для начала работы с сервисом
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => handleOpenDialog()}
                    sx={{
                      background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                      borderRadius: 3
                    }}
                  >
                    Добавить первый автомобиль
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            cars.map((car) => (
              <Grid item xs={12} md={6} lg={4} key={car._id}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${car.isPrimary ? alpha('#E3311D', 0.5) : alpha('#7C8685', 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: car.isPrimary ? '#E3311D' : alpha('#AAACA1', 0.4)
                  },
                  position: 'relative',
                  overflow: 'visible'
                }}>
                  {/* Индикатор основного автомобиля */}
                  {car.isPrimary && (
                    <Box sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      <CheckCircle fontSize="small" />
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    {/* Заголовок */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 600, mb: 0.5 }}>
                          {car.make} {car.model}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#AAACA1' }}>
                          {car.year} • {car.color}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDialog(car)}
                          sx={{ color: '#7C8685' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(car._id)}
                          sx={{ color: '#E3311D' }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Детали */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: '#7C8685', mb: 1 }}>
                        🚗 Гос. номер: <span style={{ color: '#FFFFFF' }}>{car.licensePlate}</span>
                      </Typography>
                      {car.vin && (
                        <Typography variant="body2" sx={{ color: '#7C8685', mb: 1 }}>
                          🔧 VIN: <span style={{ color: '#FFFFFF' }}>{car.vin}</span>
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: '#7C8685' }}>
                        ⛽ Топливо: <span style={{ color: '#FFFFFF' }}>
                          {fuelTypes.find(f => f.value === car.fuelType)?.label || car.fuelType}
                        </span>
                      </Typography>
                    </Box>

                    {/* Кнопки действий */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {!car.isPrimary && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleSetPrimary(car._id)}
                          sx={{
                            borderColor: '#E3311D',
                            color: '#E3311D',
                            '&:hover': {
                              borderColor: '#FF6B6B',
                              backgroundColor: alpha('#E3311D', 0.1)
                            }
                          }}
                        >
                          Сделать основным
                        </Button>
                      )}
                      <Chip
                        label={car.isPrimary ? 'Основной' : 'Дополнительный'}
                        size="small"
                        sx={{
                          backgroundColor: car.isPrimary ? alpha('#E3311D', 0.2) : alpha('#7C8685', 0.2),
                          color: car.isPrimary ? '#E3311D' : '#7C8685'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Диалог добавления/редактирования */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
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
            {editingCar ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
          </Typography>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Марка"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Модель"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Год выпуска"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleInputChange}
                  inputProps={{ min: 1990, max: new Date().getFullYear() + 1 }}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Цвет"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  required
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
                >
                  {colors.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Гос. номер"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  required
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="VIN код"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Тип топлива"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  required
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
                >
                  {fuelTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Объем двигателя (л)"
                  name="engineSize"
                  value={formData.engineSize}
                  onChange={handleInputChange}
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
              onClick={handleCloseDialog}
              sx={{ 
                color: '#7C8685',
                '&:hover': { color: '#AAACA1' }
              }}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={formLoading}
              sx={{
                background: 'linear-gradient(135deg, #E3311D, #FF6B6B)',
                borderRadius: 2,
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
                },
                '&:disabled': {
                  background: '#362E2D',
                  color: '#7C8685'
                }
              }}
            >
              {formLoading ? 'Сохранение...' : (editingCar ? 'Обновить' : 'Добавить')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Cars;