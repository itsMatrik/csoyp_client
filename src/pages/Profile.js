import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Chip,
  alpha,
  Container,
  Switch,
  FormControlLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Person,
  Email,
  Phone,
  Business,
  LocationOn,
  Notifications,
  Security,
  VpnKey,
  Delete,
  CameraAlt,
  CheckCircle,
  Warning,
  DirectionsCar
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changePasswordDialog, setChangePasswordDialog] = useState(false);
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    notifications: true,
    marketingEmails: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        businessName: user.businessName || '',
        address: user.address || '',
        notifications: user.notifications !== undefined ? user.notifications : true,
        marketingEmails: user.marketingEmails || false
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.put('/auth/profile', profileData);
      await updateProfile(response.data);
      setSuccess('Профиль успешно обновлен');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Пароль успешно изменен');
      setChangePasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при изменении пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      businessName: user.businessName || '',
      address: user.address || '',
      notifications: user.notifications !== undefined ? user.notifications : true,
      marketingEmails: user.marketingEmails || false
    });
    setError('');
  };

  const InfoField = ({ icon, label, value, edit = false, name, type = 'text' }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2, 
      p: 2, 
      borderRadius: 2,
      background: alpha('#7C8685', 0.05),
      border: `1px solid ${alpha('#7C8685', 0.1)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: alpha('#7C8685', 0.08),
        borderColor: alpha('#E3311D', 0.3)
      }
    }}>
      <Box sx={{ color: '#E3311D' }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: '#7C8685', fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        {edit ? (
          <TextField
            fullWidth
            name={name}
            value={value}
            onChange={handleInputChange}
            type={type}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                '& fieldset': { borderColor: alpha('#7C8685', 0.3) },
                '&:hover fieldset': { borderColor: '#E3311D' },
                '&.Mui-focused fieldset': { borderColor: '#E3311D' }
              }
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 500 }}>
            {value || 'Не указано'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const StatCard = ({ title, value, color, icon }) => (
    <Zoom in={true} timeout={800}>
      <Card sx={{
        background: `linear-gradient(135deg, ${alpha(color, 0.15)}, ${alpha('#0A0A0F', 0.8)})`,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(color, 0.3)}`,
        borderRadius: 3,
        p: 3,
        textAlign: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${alpha(color, 0.2)}`
        }
      }}>
        <Box sx={{ 
          color: color, 
          mb: 2,
          display: 'flex',
          justifyContent: 'center'
        }}>
          {icon}
        </Box>
        <Typography variant="h4" sx={{ 
          color: color, 
          fontWeight: 800,
          mb: 1 
        }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ 
          color: '#7C8685',
          fontWeight: 600
        }}>
          {title}
        </Typography>
      </Card>
    </Zoom>
  );

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050507 0%, #0A0A0F 100%)',
        py: 4
      }}>
        <Container maxWidth="lg">
          {/* Заголовок */}
          <Box sx={{ mb: 6 }}>
            <Slide in={true} direction="down" timeout={500}>
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
                    Профиль
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#7C8685' }}>
                    Управление личной информацией и настройками
                  </Typography>
                </Box>
                
                {!editMode ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
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
                    Редактировать
                  </Button>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancelEdit}
                      sx={{
                        borderColor: '#7C8685',
                        color: '#7C8685',
                        borderRadius: 3,
                        px: 4,
                        '&:hover': {
                          borderColor: '#E3311D',
                          color: '#E3311D'
                        }
                      }}
                    >
                      Отмена
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSaveProfile}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                        borderRadius: 3,
                        px: 4,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #388E3C, #4CAF50)'
                        }
                      }}
                    >
                      Сохранить
                    </Button>
                  </Box>
                )}
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

          <Grid container spacing={4}>
            {/* Основная информация */}
            <Grid item xs={12} lg={8}>
              <Slide in={true} direction="right" timeout={700}>
                <Card sx={{
                  background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid',
                  borderColor: alpha('#7C8685', 0.2),
                  borderRadius: 3
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                      <Box sx={{ position: 'relative' }}>
                        <Avatar
                          sx={{
                            width: 100,
                            height: 100,
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            fontSize: '2rem',
                            fontWeight: 700
                          }}
                        >
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <IconButton
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                            color: '#FFFFFF',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
                            }
                          }}
                          size="small"
                        >
                          <CameraAlt />
                        </IconButton>
                      </Box>
                      <Box>
                        <Typography variant="h4" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 1 }}>
                          {user?.name}
                        </Typography>
                        <Chip
                          label={user?.role === 'business' ? 'Бизнес-аккаунт' : 'Клиент'}
                          color={user?.role === 'business' ? 'primary' : 'default'}
                          sx={{
                            background: user?.role === 'business' 
                              ? 'linear-gradient(135deg, #2196F3, #21CBF3)' 
                              : 'linear-gradient(135deg, #7C8685, #AAACA1)',
                            color: '#FFFFFF',
                            fontWeight: 600
                          }}
                        />
                      </Box>
                    </Box>

                    <Divider sx={{ borderColor: alpha('#7C8685', 0.2), mb: 4 }} />

                    <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                      Личная информация
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <InfoField
                          icon={<Person />}
                          label="Имя"
                          value={profileData.name}
                          edit={editMode}
                          name="name"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InfoField
                          icon={<Email />}
                          label="Email"
                          value={profileData.email}
                          edit={editMode}
                          name="email"
                          type="email"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InfoField
                          icon={<Phone />}
                          label="Телефон"
                          value={profileData.phone}
                          edit={editMode}
                          name="phone"
                          type="tel"
                        />
                      </Grid>
                      {user?.role === 'business' && (
                        <Grid item xs={12} md={6}>
                          <InfoField
                            icon={<Business />}
                            label="Название бизнеса"
                            value={profileData.businessName}
                            edit={editMode}
                            name="businessName"
                          />
                        </Grid>
                      )}
                      <Grid item xs={12}>
                        <InfoField
                          icon={<LocationOn />}
                          label="Адрес"
                          value={profileData.address}
                          edit={editMode}
                          name="address"
                        />
                      </Grid>
                    </Grid>

                    {editMode && (
                      <>
                        <Divider sx={{ borderColor: alpha('#7C8685', 0.2), my: 4 }} />
                        
                        <Typography variant="h5" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                          Настройки уведомлений
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={profileData.notifications}
                                onChange={handleInputChange}
                                name="notifications"
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                  Уведомления
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7C8685' }}>
                                  Получать уведомления о статусе заказов
                                </Typography>
                              </Box>
                            }
                          />
                          
                          <FormControlLabel
                            control={
                              <Switch
                                checked={profileData.marketingEmails}
                                onChange={handleInputChange}
                                name="marketingEmails"
                                color="primary"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                                  Маркетинговые рассылки
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#7C8685' }}>
                                  Получать специальные предложения и новости
                                </Typography>
                              </Box>
                            }
                          />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Slide>
            </Grid>

            {/* Боковая панель */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Статистика */}
                <Slide in={true} direction="left" timeout={900}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                        Статистика аккаунта
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <StatCard
                            title="Заказов"
                            value="12"
                            color="#E3311D"
                            icon={<CheckCircle />}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <StatCard
                            title="Авто"
                            value={user?.carsCount || '2'}
                            color="#2196F3"
                            icon={<DirectionsCar />}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Slide>

                {/* Действия с аккаунтом */}
                <Slide in={true} direction="left" timeout={1100}>
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.9), rgba(124, 134, 133, 0.1))',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid',
                    borderColor: alpha('#7C8685', 0.2),
                    borderRadius: 3
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 3 }}>
                        Безопасность
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="outlined"
                          startIcon={<VpnKey />}
                          onClick={() => setChangePasswordDialog(true)}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#2196F3',
                            color: '#2196F3',
                            '&:hover': {
                              borderColor: '#1976D2',
                              backgroundColor: alpha('#2196F3', 0.1)
                            }
                          }}
                        >
                          Сменить пароль
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<Security />}
                          onClick={() => {/* В будущем - 2FA */}}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#FF9800',
                            color: '#FF9800',
                            '&:hover': {
                              borderColor: '#F57C00',
                              backgroundColor: alpha('#FF9800', 0.1)
                            }
                          }}
                        >
                          Двухфакторная аутентификация
                        </Button>

                        <Divider sx={{ borderColor: alpha('#7C8685', 0.2), my: 1 }} />

                        <Button
                          variant="outlined"
                          startIcon={<Delete />}
                          onClick={() => setDeleteAccountDialog(true)}
                          sx={{
                            justifyContent: 'flex-start',
                            borderColor: '#F44336',
                            color: '#F44336',
                            '&:hover': {
                              borderColor: '#D32F2F',
                              backgroundColor: alpha('#F44336', 0.1)
                            }
                          }}
                        >
                          Удалить аккаунт
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Slide>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Диалог смены пароля */}
        <Dialog 
          open={changePasswordDialog} 
          onClose={() => setChangePasswordDialog(false)}
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
            Смена пароля
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              label="Текущий пароль"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Новый пароль"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: `1px solid ${alpha('#7C8685', 0.2)}`, 
            p: 3 
          }}>
            <Button 
              onClick={() => setChangePasswordDialog(false)}
              sx={{ color: '#7C8685' }}
            >
              Отмена
            </Button>
            <Button 
              variant="contained" 
              onClick={handleChangePassword}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #E3311D, #FF6B5B)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #C12A1A, #E3311D)'
                }
              }}
            >
              {loading ? 'Смена...' : 'Сменить пароль'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог удаления аккаунта */}
        <Dialog 
          open={deleteAccountDialog} 
          onClose={() => setDeleteAccountDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, #050507, #0A0A0F)',
              border: '1px solid',
              borderColor: alpha('#F44336', 0.3),
              borderRadius: 3
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#FFFFFF', 
            borderBottom: `1px solid ${alpha('#F44336', 0.2)}`,
            pb: 2
          }}>
            <Warning sx={{ color: '#F44336', mr: 1 }} />
            Удаление аккаунта
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography sx={{ color: '#FFFFFF', mb: 2 }}>
              Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
            </Typography>
            <Typography sx={{ color: '#7C8685', fontSize: '0.9rem' }}>
              Все ваши данные, включая автомобили и историю заказов, будут безвозвратно удалены.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: `1px solid ${alpha('#F44336', 0.2)}`, 
            p: 3 
          }}>
            <Button 
              onClick={() => setDeleteAccountDialog(false)}
              sx={{ color: '#7C8685' }}
            >
              Отмена
            </Button>
            <Button 
              variant="contained" 
              color="error"
              startIcon={<Delete />}
              sx={{
                background: 'linear-gradient(135deg, #F44336, #EF5350)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #D32F2F, #F44336)'
                }
              }}
            >
              Удалить аккаунт
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
};

export default Profile;