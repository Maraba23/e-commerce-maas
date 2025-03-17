import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography,
  Button,
  Box,
  Paper,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HackerNavbar from '../components/Navbar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [terminalText, setTerminalText] = useState('');
  
  // Verificar se o usuário está autenticado
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);
  
  // Terminal animation
  useEffect(() => {
    const text = `$ processing_payment...\n$ payment_received: [OK]\n$ generating_order: #${Math.floor(10000 + Math.random() * 90000)}\n$ sending_confirmation: [OK]\n$ transaction_complete`;
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setTerminalText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 25);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* Navbar */}
      <HackerNavbar cartItemCount={0} />
      
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden opacity-10 z-0">
        <div className="matrix-code"></div>
      </div>
      
      <div className="fixed inset-0 grid-background z-0"></div>
      
      <Container className="py-16 relative z-10">
        <Paper 
          elevation={0}
          sx={{ 
            backgroundColor: 'rgba(18, 18, 18, 0.7)',
            border: '1px solid rgba(0, 255, 0, 0.3)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(5px)',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          {/* Scan line effect */}
          <div className="scan-line absolute inset-x-0 h-1"></div>
          
          <CheckCircleIcon sx={{ fontSize: 80, color: '#00FF00', mb: 2 }} />
          
          <Typography 
            variant="h3" 
            component="h1" 
            className="font-mono mb-2 text-green-400 glitch-text"
            sx={{ letterSpacing: '3px', fontWeight: 'bold' }}
          >
            PEDIDO CONFIRMADO
          </Typography>
          
          <Typography variant="h6" className="font-mono mb-6" sx={{ color: '#00FF00' }}>
            Seu pedido foi processado com sucesso!
          </Typography>
          
          <Box 
            sx={{ 
              backgroundColor: 'black',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              p: 3,
              my: 4,
              maxHeight: '150px',
              overflow: 'auto',
              textAlign: 'left',
              borderRadius: '4px',
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto 30px auto'
            }}
          >
            <pre className="text-green-400 text-xs font-mono">
              {terminalText}<span className="cursor-blink">_</span>
            </pre>
          </Box>
          
          <Typography variant="body1" className="font-mono mb-3">
            Obrigado pela sua compra! Você receberá em breve mais informações sobre seu pedido.
          </Typography>
          
          <Typography variant="body2" className="font-mono mb-6 opacity-70">
            Um email de confirmação foi enviado para o endereço associado à sua conta.
          </Typography>
          
          <Divider sx={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#00FF00',
                border: '1px solid #00FF00',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                py: 1.5,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
                }
              }}
            >
              PÁGINA INICIAL
            </Button>
            
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
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
                }
              }}
            >
              CONTINUAR COMPRANDO
            </Button>
          </Box>
          
          {/* Cantos decorativos */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500 opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500 opacity-60"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500 opacity-60"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500 opacity-60"></div>
        </Paper>
      </Container>
    </div>
  );
};

export default OrderConfirmation;