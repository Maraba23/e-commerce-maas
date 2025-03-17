import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography,
  Button,
  Grid,
  Box,
  Paper,
  Divider,
  IconButton,
  Skeleton,
  Breadcrumbs,
  TextField
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import HackerNavbar from '../components/Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WarningIcon from '@mui/icons-material/Warning';
import VerifiedIcon from '@mui/icons-material/Verified';

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

const ProductDetail = () => {
  const params = useParams();
  const productId = params?.productId;
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [terminalText, setTerminalText] = useState('');
  
  // Log para diagnóstico
  useEffect(() => {
    console.log("ProductDetail montado - Params:", params);
    console.log("ProductDetail montado - ID recebido:", productId);
  }, [params, productId]);

  // Terminal animation
  useEffect(() => {
    const text = `$ loading product_id=${productId}...\n$ fetching details...\n$ retrieving specs...`;
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
  }, [productId]);

  // Verificar se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Carregar dados do carrinho do localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
      }
    }
  }, []);

  // Buscar detalhes do produto
  useEffect(() => {
    const fetchProduct = async () => {
      // Verifica se productId está definido antes de fazer a chamada
      if (!productId || productId === 'undefined') {
        setToast({
          type: 'error',
          message: '[ERROR] ID do produto inválido.'
        });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fazendo requisição para:", `product/${productId}/`);
        const response = await axiosInstance.get(`product/${productId}/`);
        console.log("Resposta recebida:", response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setToast({
          type: 'error',
          message: '[ERROR] Produto não encontrado ou erro na conexão.'
        });
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    // Obter o token de autenticação do localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setToast({
        type: 'error',
        message: '[ERROR] Você precisa estar autenticado para adicionar ao carrinho.'
      });
      navigate('/login');
      return;
    }
    
    try {
      // Fazer requisição para a API de adicionar ao carrinho
      const response = await axiosInstance.post('add-to-cart/', {
        token: token,
        product_id: productId,
        quantity: quantity
      });
      
      // Se a requisição for bem-sucedida, atualizar o carrinho local também
      if (response.data.status === 'success') {
        // Verificar se o produto já está no carrinho
        const existingItem = cartItems.find(item => item.id === product.id);
        
        let updatedCart;
        
        if (existingItem) {
          // Atualizar a quantidade se já existir
          updatedCart = cartItems.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          // Adicionar novo item
          updatedCart = [...cartItems, { ...product, quantity }];
        }
        
        // Atualizar estado local
        setCartItems(updatedCart);
        
        // Salvar no localStorage para persistência entre páginas
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Mostrar toast de sucesso
        setToast({
          type: 'success',
          message: `[SUCCESS] ${quantity}x ${product.name} adicionado ao carrinho`
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      
      // Determinar a mensagem de erro com base na resposta da API
      let errorMessage = '[ERROR] Falha ao adicionar ao carrinho.';
      
      if (error.response) {
        const responseData = error.response.data;
        
        switch(responseData.message) {
          case 'Invalid token':
            errorMessage = '[ERROR] Sessão expirada. Por favor, faça login novamente.';
            // Redirecionar para login após mostrar o erro
            setTimeout(() => navigate('/login'), 2000);
            break;
          case 'Product not found':
            errorMessage = '[ERROR] Produto não encontrado.';
            break;
          case 'Not enough stock':
            errorMessage = '[ERROR] Estoque insuficiente para esta quantidade.';
            break;
          default:
            errorMessage = `[ERROR] ${responseData.message || 'Falha ao adicionar ao carrinho.'}`;
        }
      }
      
      setToast({
        type: 'error',
        message: errorMessage
      });
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
      <HackerNavbar cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden opacity-10 z-0">
        <div className="matrix-code"></div>
      </div>
      
      <div className="fixed inset-0 grid-background z-0"></div>
      
      <Container className="py-8 relative z-10">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          aria-label="breadcrumb" 
          sx={{ 
            mb: 3,
            '& .MuiBreadcrumbs-ol': { 
              fontFamily: 'monospace',
              color: 'rgba(0, 255, 0, 0.7)'
            },
            '& .MuiBreadcrumbs-separator': {
              color: 'rgba(0, 255, 0, 0.5)'
            }
          }}
        >
          <Link 
            to="/" 
            className="text-green-500 hover:text-green-400 font-mono"
          >
            HOME
          </Link>
          <Link 
            to="/products" 
            className="text-green-500 hover:text-green-400 font-mono"
          >
            PRODUTOS
          </Link>
          <Typography color="rgba(0, 255, 0, 0.9)" className="font-mono">
            {loading ? 'CARREGANDO...' : product?.name.toUpperCase()}
          </Typography>
        </Breadcrumbs>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
          sx={{
            color: '#00FF00',
            fontFamily: 'monospace',
            mb: 3,
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
          }}
        >
          VOLTAR
        </Button>
        
        {loading ? (
          // Skeleton loading
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={400} 
                sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)' }} 
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton 
                variant="text" 
                width="80%" 
                height={60} 
                sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)' }} 
              />
              <Skeleton 
                variant="text" 
                width="30%" 
                height={40} 
                sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', mt: 2 }} 
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={100} 
                sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', mt: 3 }} 
              />
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={100} 
                sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)', mt: 2 }} 
              />
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={4}>
            {/* Imagem do produto */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: 'rgba(18, 18, 18, 0.7)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  p: 1,
                  position: 'relative',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(5px)'
                }}
              >
                {/* Scan line effect */}
                <div className="scan-line absolute inset-x-0 h-1"></div>
                
                {/* Imagem do produto */}
                <Box 
                  sx={{ 
                    width: '100%', 
                    paddingTop: '70%',
                    position: 'relative',
                    mb: 2
                  }}
                >
                  {product && product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-contain p-6"
                      style={{ filter: 'drop-shadow(0 0 8px rgba(0, 255, 0, 0.5))' }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                      <Typography className="font-mono text-green-500 text-opacity-70">
                        Imagem não disponível
                      </Typography>
                    </div>
                  )}
                </Box>
                
                {/* Elementos decorativos */}
                <div className="absolute top-2 left-2 text-xs text-green-400 font-mono opacity-70">
                  IMG::ID#{product?.id || '404'}
                </div>
                
                {/* Cantos decorativos */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500 opacity-60"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500 opacity-60"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500 opacity-60"></div>
              </Paper>
            </Grid>
            
            {/* Detalhes do produto */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0}
                sx={{ 
                  backgroundColor: 'rgba(18, 18, 18, 0.7)',
                  border: '1px solid rgba(0, 255, 0, 0.3)',
                  p: 3,
                  height: '100%',
                  position: 'relative',
                  backdropFilter: 'blur(5px)'
                }}
              >
                {/* Título do produto */}
                <Typography 
                  variant="h4" 
                  className="font-mono"
                  sx={{ 
                    color: '#00FF00',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    mb: 1
                  }}
                >
                  {product?.name?.toUpperCase() || 'PRODUTO NÃO ENCONTRADO'}
                </Typography>
                
                {/* Preço */}
                <Typography 
                  variant="h5" 
                  className="font-mono"
                  sx={{ 
                    color: '#00FF00',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    mt: 2,
                    mb: 3
                  }}
                >
                  {product?.price ? `R$ ${product.price.toFixed(2)}` : 'Preço indisponível'}
                </Typography>
                
                {/* Terminal de informações */}
                <Box 
                  sx={{ 
                    backgroundColor: 'black',
                    border: '1px solid rgba(0, 255, 0, 0.5)',
                    p: 2,
                    mb: 3,
                    borderRadius: '4px',
                    maxHeight: '100px',
                    overflow: 'auto'
                  }}
                >
                  <pre className="text-green-400 text-xs font-mono">
                    {terminalText}<span className="cursor-blink">_</span>
                  </pre>
                </Box>
                
                {/* Descrição */}
                <Typography 
                  variant="body1" 
                  className="font-mono"
                  sx={{ 
                    color: 'rgba(0, 255, 0, 0.9)',
                    mb: 3,
                    lineHeight: 1.7
                  }}
                >
                  {product?.description || 'Descrição não disponível para este produto.'}
                </Typography>
                
                <Divider sx={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', my: 3 }} />
                
                {/* Disponibilidade */}
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3,
                    backgroundColor: product?.stock > 0 ? 'rgba(0, 255, 0, 0.05)' : 'rgba(255, 0, 0, 0.05)',
                    padding: '10px',
                    borderRadius: '4px',
                    border: product?.stock > 0 ? '1px solid rgba(0, 255, 0, 0.2)' : '1px solid rgba(255, 0, 0, 0.2)'
                  }}
                >
                  {product?.stock > 0 ? (
                    <VerifiedIcon sx={{ color: '#00FF00', mr: 1 }} />
                  ) : (
                    <WarningIcon sx={{ color: '#FF4444', mr: 1 }} />
                  )}
                  
                  <Typography 
                    variant="body2" 
                    className="font-mono"
                    sx={{ 
                      color: product?.stock > 0 ? '#00FF00' : '#FF4444'
                    }}
                  >
                    {product?.stock > 0 
                      ? `Em estoque: ${product.stock} unidades disponíveis` 
                      : 'Produto indisponível no momento'}
                  </Typography>
                </Box>
                
                {/* Quantidade e ação de compra */}
                {product?.stock > 0 && (
                  <>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3
                      }}
                    >
                      <Typography variant="body2" className="font-mono mr-3" sx={{ color: '#00FF00' }}>
                        QUANTIDADE:
                      </Typography>
                      
                      <IconButton 
                        onClick={decrementQuantity}
                        sx={{
                          color: '#00FF00',
                          border: '1px solid rgba(0, 255, 0, 0.5)',
                          p: '5px',
                          mr: 1
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      
                      <TextField
                        value={quantity}
                        onChange={handleQuantityChange}
                        variant="outlined"
                        size="small"
                        inputProps={{ 
                          min: 1, 
                          max: product?.stock || 1,
                          style: { 
                            textAlign: 'center',
                            color: '#00FF00',
                            fontFamily: 'monospace',
                            width: '40px',
                            padding: '8px 0'
                          }
                        }}
                        sx={{
                          maxWidth: '70px',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 0, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#00FF00',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#00FF00',
                            }
                          },
                          '& .MuiOutlinedInput-input': {
                            padding: '8px 14px',
                          },
                          backgroundColor: 'rgba(0, 0, 0, 0.3)'
                        }}
                      />
                      
                      <IconButton 
                        onClick={incrementQuantity}
                        sx={{
                          color: '#00FF00',
                          border: '1px solid rgba(0, 255, 0, 0.5)',
                          p: '5px',
                          ml: 1
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      fullWidth
                      onClick={addToCart}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: '#00FF00',
                        border: '1px solid #00FF00',
                        fontFamily: 'monospace',
                        letterSpacing: '1px',
                        py: 1.5,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 255, 0, 0.1)',
                          boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
                        }
                      }}
                    >
                      ADICIONAR AO CARRINHO
                    </Button>
                  </>
                )}
                
                {/* Cantos decorativos */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500 opacity-60"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500 opacity-60"></div>
                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500 opacity-60"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500 opacity-60"></div>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;