import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography,
  Card, 
  CardContent, 
  CardMedia,
  CardActionArea,
  Button,
  Grid,
  Box,
  Tab,
  Tabs,
  Skeleton,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';
import HackerNavbar from '../components/Navbar';

// Toast personalizado reutilizado do componente anterior
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

const ProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

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

  // Buscar categorias e produtos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('categories-and-products/');
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setToast({
          type: 'error',
          message: '[ERROR] Falha ao carregar produtos. Tente novamente.'
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (event, newValue) => {
    setCurrentCategory(newValue);
  };

  const addToCart = (product) => {
    // Verificar se o produto já está no carrinho
    const existingItem = cartItems.find(item => item.id === product.id);
    
    let updatedCart;
    
    if (existingItem) {
      // Aumentar a quantidade se já existir
      updatedCart = cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Adicionar novo item
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    
    // Atualizar estado local
    setCartItems(updatedCart);
    
    // Salvar no localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Mostrar toast
    setToast({
      type: 'success',
      message: `[SUCCESS] ${product.name} adicionado ao carrinho`
    });
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
        <Box className="mb-8 text-center relative">
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-mono mb-2 text-green-400 glitch-text"
            sx={{ letterSpacing: '3px', fontWeight: 'bold' }}
          >
            PRODUTOS DISPONÍVEIS
          </Typography>
          <div className="w-48 h-1 bg-green-500 mx-auto my-4 opacity-70"></div>
          <Typography variant="body2" className="font-mono text-green-400 opacity-70 mb-6">
            &lt;Selecione uma categoria para navegar nos itens disponíveis&gt;
          </Typography>
        </Box>
        
        {/* Carregamento */}
        {loading ? (
          <div className="w-full">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
              <Skeleton variant="rounded" width={400} height={48} sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)' }} />
            </Box>
            <Grid container spacing={3}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <Skeleton 
                    variant="rounded" 
                    width="100%" 
                    height={300} 
                    sx={{ bgcolor: 'rgba(0, 255, 0, 0.1)' }} 
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        ) : (
          <>
            {/* Abas de categorias */}
            <Box 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'rgba(0, 255, 0, 0.3)',
                mb: 4,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#00FF00',
                  opacity: 0.5,
                  boxShadow: '0 0 8px #00FF00'
                }
              }}
            >
              <Tabs 
                value={currentCategory} 
                onChange={handleCategoryChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#00FF00',
                    height: 3,
                    boxShadow: '0 0 10px #00FF00'
                  },
                  '& .MuiTab-root': {
                    color: 'rgba(0, 255, 0, 0.6)',
                    fontFamily: 'monospace',
                    letterSpacing: '1px',
                    '&.Mui-selected': {
                      color: '#00FF00',
                      fontWeight: 'bold'
                    }
                  }
                }}
              >
                {/* Adiciona a opção "Todos" como primeira categoria */}
                <Tab label="TODOS" />
                
                {/* Mapeia as categorias da API */}
                {categories.map((category, index) => (
                  <Tab key={category.id} label={category.name.toUpperCase()} />
                ))}
              </Tabs>
            </Box>
            
            {/* Grid de produtos */}
            <Grid container spacing={3}>
              {(currentCategory === 0 
                ? categories.flatMap(category => category.products) 
                : categories[currentCategory - 1]?.products || []
              ).map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      backgroundColor: 'rgba(18, 18, 18, 0.8)',
                      border: '1px solid rgba(0, 255, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 5px 15px rgba(0, 255, 0, 0.3)',
                        border: '1px solid #00FF00'
                      },
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Linha de escaneamento para efeito */}
                    <div className="scan-line absolute inset-x-0 h-1"></div>
                    
                    <CardActionArea 
                      onClick={() => navigate(`/product/${product.id}`)}
                      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                    >
                      <Box sx={{ position: 'relative', paddingTop: '70%', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'drop-shadow(0 0 1px #00FF00) brightness(0.9) contrast(1.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              filter: 'drop-shadow(0 0 3px #00FF00) brightness(1) contrast(1.2)',
                            }
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-80 border border-green-500 px-2 py-1 text-green-400 font-mono text-sm">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </Box>
                    </CardActionArea>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="div"
                        sx={{ 
                          color: '#00FF00',
                          fontFamily: 'monospace',
                          fontWeight: 'bold'
                        }}
                      >
                        {product.name}
                      </Typography>
                      
                      <Chip 
                        label={categories.find(cat => 
                          cat.products.some(p => p.id === product.id)
                        )?.name}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(0, 255, 0, 0.1)', 
                          color: '#00FF00',
                          borderColor: 'rgba(0, 255, 0, 0.3)',
                          fontFamily: 'monospace',
                          fontSize: '0.7rem',
                          mb: 2
                        }}
                        variant="outlined"
                      />
                      
                      <div className="flex justify-between items-center mt-4">
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                          sx={{
                            backgroundColor: '#121212',
                            color: '#00FF00',
                            border: '1px solid #00FF00',
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 255, 0, 0.1)',
                              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'
                            }
                          }}
                        >
                          VER DETALHES
                        </Button>
                      </div>
                    </CardContent>
                    
                    {/* Cantos decorativos */}
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-green-500 opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-green-500 opacity-60"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-green-500 opacity-60"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-green-500 opacity-60"></div>
                  </Card>
                </Grid>
              ))}
              
              {/* Mensagem se não houver produtos */}
              {(currentCategory === 0 
                ? categories.flatMap(category => category.products) 
                : categories[currentCategory - 1]?.products || []
              ).length === 0 && (
                <Box 
                  sx={{ 
                    width: '100%', 
                    textAlign: 'center', 
                    padding: 4,
                    border: '1px dashed rgba(0, 255, 0, 0.3)',
                    borderRadius: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    margin: 2
                  }}
                >
                  <Typography variant="body1" sx={{ color: '#00FF00', fontFamily: 'monospace' }}>
                    [INFO] Nenhum produto encontrado nesta categoria
                  </Typography>
                </Box>
              )}
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default ProductPage;