import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  IconButton,
  Divider,
  TextField,
  Card,
  CardContent,
  List,
  ListItem,
  InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import HackerNavbar from '../components/Navbar';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Toast personalizado reutilizado
const HackerToast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-md border shadow-lg min-w-[300px] max-w-md 
        transform transition-all duration-300 flex items-start gap-3
        ${type === 'success' 
          ? 'bg-black border-green-500 text-green-400 shadow-[0_0_15px_rgba(0,255,0,0.3)]' 
          : 'bg-black border-red-500 text-red-400 shadow-[0_0_15px_rgba(255,0,0,0.3)]'}`}
      style={{ animation: 'glitchIn 0.3s ease-out' }}
    >
      <div className="flex-shrink-0 mt-0.5">
        {type === 'success' ? (
          <div className="w-5 h-5 relative">
            <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-1 bg-green-500 rounded-full"></div>
          </div>
        ) : (
          <div className="w-5 h-5 relative">
            <div className="absolute inset-0 border-2 border-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-red-500 text-xs font-bold">X</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <p className="font-mono text-sm">{message}</p>
        <div className="w-full bg-gray-800 h-1 mt-2 overflow-hidden">
          <div 
            className={`h-full ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ animation: 'shrink 5s linear forwards' }}
          ></div>
        </div>
      </div>
      
      <button 
        onClick={onClose}
        className={`${type === 'success' ? 'text-green-500' : 'text-red-500'} hover:opacity-75`}
      >
        ×
      </button>
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [terminalText, setTerminalText] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [processingOrder, setProcessingOrder] = useState(false);

  // Terminal animation
  useEffect(() => {
    const text = `$ initializing shopping_cart v1.2...\n$ loading items...\n$ calculating totals...`;
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setTerminalText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, []);

  // Verificar se o usuário está autenticado e carregar dados do carrinho
  useEffect(() => {
    const fetchCartData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        setLoading(true);
        const response = await axiosInstance.get(`cart/?token=${token}`);
        console.log('Dados do carrinho:', response.data);
        setCartItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
        setToast({
          type: 'error',
          message: '[ERROR] Falha ao carregar o carrinho. Tente novamente.'
        });
        setLoading(false);
        
        // Se o token for inválido, redirecionar para o login
        if (error.response && error.response.data && error.response.data.message === 'Invalid token') {
          localStorage.removeItem('authToken');
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    };

    fetchCartData();
  }, [navigate]);

  // Calcular totais
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15 : 0; // Frete fixo para exemplo
  const total = subtotal + shipping;

  const removeFromCart = async (productId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axiosInstance.post('remove-from-cart/', {
        token: token,
        product_id: productId
      });
      
      if (response.data.status === 'success') {
        // Atualizar a lista local de itens
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
        
        setToast({
          type: 'success',
          message: `[SUCCESS] Item removido do carrinho`
        });
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      
      setToast({
        type: 'error',
        message: `[ERROR] Falha ao remover item do carrinho`
      });
      
      // Se o token for inválido, redirecionar para o login
      if (error.response && error.response.data && error.response.data.message === 'Invalid token') {
        localStorage.removeItem('authToken');
        setTimeout(() => navigate('/login'), 2000);
      }
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }
    
    setProcessingOrder(true);
    
    try {
      const requestData = {
        token: token
      };
      
      // Adicionar cupom se for fornecido
      if (couponCode.trim() !== '') {
        requestData.coupon_code = couponCode.trim();
      }
      
      const response = await axiosInstance.post('create-order/', requestData);
      
      if (response.data.status === 'success') {
        setToast({
          type: 'success',
          message: '[SUCCESS] Pedido criado com sucesso!'
        });
        
        // Recarregar o carrinho (agora vazio)
        setCartItems([]);
        
        // Redirecionar para a página de confirmação após um breve delay
        setTimeout(() => {
          navigate('/order-confirmation');
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      
      let errorMessage = '[ERROR] Falha ao processar o pedido.';
      
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        switch(responseData.message) {
          case 'Invalid token':
            errorMessage = '[ERROR] Sessão expirada. Por favor, faça login novamente.';
            localStorage.removeItem('authToken');
            setTimeout(() => navigate('/login'), 2000);
            break;
          case 'Cart is empty':
            errorMessage = '[ERROR] O carrinho está vazio.';
            break;
          case 'Invalid coupon':
            errorMessage = '[ERROR] Cupom inválido ou expirado.';
            break;
          default:
            errorMessage = `[ERROR] ${responseData.message || 'Falha ao processar o pedido.'}`;
        }
      }
      
      setToast({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Toast notification */}
      {toast && (
        <HackerToast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navbar */}
      <HackerNavbar cartItemCount={cartItems.length} />
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden opacity-10 z-0">
        <div className="matrix-code"></div>
      </div>
      
      <div className="fixed inset-0 grid-background z-0"></div>
      
      <Container className="py-8 relative z-10">
        <Box className="mb-6 flex items-center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/products')}
            sx={{
              color: '#00FF00',
              fontFamily: 'monospace',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 0, 0.1)'
              }
            }}
          >
            CONTINUAR COMPRANDO
          </Button>
          
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-mono ml-auto text-green-400"
            sx={{ letterSpacing: '2px', fontWeight: 'bold' }}
          >
            CARRINHO
          </Typography>
          
          <ShoppingCartIcon sx={{ color: '#00FF00', ml: 2, fontSize: 30 }} />
        </Box>
        
        {loading ? (
          <div className="w-full text-center py-20">
            <Typography variant="body1" className="font-mono">Carregando carrinho...</Typography>
          </div>
        ) : cartItems.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              backgroundColor: 'rgba(18, 18, 18, 0.7)',
              border: '1px solid rgba(0, 255, 0, 0.3)',
              p: 4,
              textAlign: 'center',
              position: 'relative',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Typography 
              variant="h5" 
              className="font-mono mb-4"
              sx={{ color: '#00FF00' }}
            >
              SEU CARRINHO ESTÁ VAZIO
            </Typography>
            
            <Typography variant="body1" className="font-mono mb-6">
              Continue navegando para adicionar produtos ao seu carrinho.
            </Typography>
            
            <Box 
              sx={{ 
                backgroundColor: 'black',
                border: '1px solid rgba(0, 255, 0, 0.5)',
                p: 2,
                mb: 4,
                maxHeight: '100px',
                overflow: 'auto',
                textAlign: 'left'
              }}
            >
              <pre className="text-green-400 text-xs font-mono">
                {terminalText}<span className="cursor-blink">_</span>
              </pre>
            </Box>
            
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => navigate('/products')}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#00FF00',
                border: '1px solid #00FF00',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                py: 1.5,
                px: 4,
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
                }
              }}
            >
              EXPLORAR PRODUTOS
            </Button>
            
            {/* Cantos decorativos */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500 opacity-60"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500 opacity-60"></div>
            <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500 opacity-60"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500 opacity-60"></div>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {/* Itens do carrinho */}
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: 'rgba(18, 18, 18, 0.7)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  position: 'relative',
                  backdropFilter: 'blur(5px)',
                  mb: { xs: 3, md: 0 }
                }}
              >
                {/* Scan line effect */}
                <div className="scan-line absolute inset-x-0 h-1"></div>
                
                <List disablePadding>
                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <ListItem 
                        sx={{ 
                          py: 3, 
                          px: 2,
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          gap: 2
                        }}
                      >
                        {/* Informações do produto */}
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h6" 
                            className="font-mono"
                            sx={{ 
                              color: '#00FF00',
                              fontWeight: 'bold'
                            }}
                          >
                            {item.name}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            className="font-mono"
                            sx={{ 
                              color: 'rgba(0, 255, 0, 0.7)',
                              mb: 1
                            }}
                          >
                            Preço unitário: R$ {item.price.toFixed(2)}
                          </Typography>
                          
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1
                            }}
                          >
                            <Typography variant="body2" className="font-mono mr-3" sx={{ color: '#00FF00' }}>
                              Quantidade: {item.quantity}
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="body2" 
                            className="font-mono"
                            sx={{ 
                              color: '#00FF00',
                              fontWeight: 'bold'
                            }}
                          >
                            Subtotal: R$ {item.total_price ? item.total_price.toFixed(2) : (item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                        
                        {/* Botão remover */}
                        <IconButton 
                          onClick={() => removeFromCart(item.product_id)}
                          sx={{
                            color: '#FF4444',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.1)'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                      
                      {index < cartItems.length - 1 && (
                        <Divider 
                          sx={{ 
                            backgroundColor: 'rgba(0, 255, 0, 0.2)',
                            margin: '0 16px'
                          }} 
                        />
                      )}
                    </React.Fragment>
                  ))}
                </List>
                
                {/* Cantos decorativos */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500 opacity-60"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500 opacity-60"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500 opacity-60"></div>
              </Paper>
            </Grid>
            
            {/* Resumo do pedido */}
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  backgroundColor: 'rgba(18, 18, 18, 0.7)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  position: 'relative',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    className="font-mono"
                    sx={{ 
                      color: '#00FF00',
                      fontWeight: 'bold',
                      mb: 3,
                      textAlign: 'center'
                    }}
                  >
                    RESUMO DO PEDIDO
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      backgroundColor: 'black',
                      border: '1px solid rgba(0, 255, 0, 0.5)',
                      p: 2,
                      mb: 3,
                      borderRadius: '4px',
                      maxHeight: '80px',
                      overflow: 'auto'
                    }}
                  >
                    <pre className="text-green-400 text-xs font-mono">
                      {terminalText}<span className="cursor-blink">_</span>
                    </pre>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" className="font-mono" sx={{ color: 'rgba(0, 255, 0, 0.9)' }}>
                      Subtotal:
                    </Typography>
                    <Typography variant="body1" className="font-mono" sx={{ color: 'rgba(0, 255, 0, 0.9)' }}>
                      R$ {subtotal.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" className="font-mono" sx={{ color: 'rgba(0, 255, 0, 0.9)' }}>
                      Frete:
                    </Typography>
                    <Typography variant="body1" className="font-mono" sx={{ color: 'rgba(0, 255, 0, 0.9)' }}>
                      R$ {shipping.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ backgroundColor: 'rgba(0, 255, 0, 0.3)', my: 2 }} />
                  
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" className="font-mono" sx={{ color: '#00FF00', fontWeight: 'bold' }}>
                      TOTAL:
                    </Typography>
                    <Typography variant="h6" className="font-mono" sx={{ color: '#00FF00', fontWeight: 'bold' }}>
                      R$ {total.toFixed(2)}
                    </Typography>
                  </Box>
                  
                  {/* Campo de cupom */}
                  <TextField
                    fullWidth
                    label="Código de Cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    InputProps={{ 
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOfferIcon sx={{ color: 'rgba(0, 255, 0, 0.7)' }} />
                        </InputAdornment>
                      ),
                      style: { color: '#00FF00', fontFamily: 'monospace' }
                    }}
                    sx={{
                      mb: 3,
                      '& label': { 
                        color: 'rgba(0, 255, 0, 0.7)',
                        fontFamily: 'monospace'
                      },
                      '& label.Mui-focused': { 
                        color: '#00FF00',
                        fontWeight: 'bold'
                      },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { 
                          borderColor: 'rgba(0, 255, 0, 0.5)',
                          borderWidth: '1px'
                        },
                        '&:hover fieldset': { 
                          borderColor: '#00FF00',
                          borderWidth: '2px'
                        },
                        '&.Mui-focused fieldset': { 
                          borderColor: '#00FF00',
                          boxShadow: '0 0 5px rgba(0, 255, 0, 0.5)'
                        },
                        backgroundColor: 'rgba(0, 20, 0, 0.3)'
                      }
                    }}
                  />
                  
                  <Button
                    variant="contained"
                    startIcon={<LockIcon />}
                    fullWidth
                    onClick={handleCheckout}
                    disabled={loading || processingOrder || cartItems.length === 0}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: '#00FF00',
                      border: '1px solid #00FF00',
                      fontFamily: 'monospace',
                      letterSpacing: '1px',
                      py: 1.5,
                      mt: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 255, 0, 0.1)',
                        boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
                      },
                      '&.Mui-disabled': {
                        color: 'rgba(0, 255, 0, 0.4)',
                        borderColor: 'rgba(0, 255, 0, 0.2)',
                      }
                    }}
                  >
                    {processingOrder ? 'PROCESSANDO...' : 'FINALIZAR COMPRA'}
                  </Button>
                </CardContent>
                
                {/* Cantos decorativos */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500 opacity-60"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500 opacity-60"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500 opacity-60"></div>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default CartPage;