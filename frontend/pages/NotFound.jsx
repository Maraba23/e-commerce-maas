import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorIcon from '@mui/icons-material/Error';
import HomeIcon from '@mui/icons-material/Home';

const NotFound = () => {
  const navigate = useNavigate();
  const [terminalText, setTerminalText] = useState('');
  const [countdown, setCountdown] = useState(10);

  // Efeito de digitação para o terminal
  useEffect(() => {
    const text = `$ error 404\n$ resource_not_found\n$ attempting to locate resource...\n$ search_failed\n$ initiating auto-redirect sequence...`;
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setTerminalText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  // Contagem regressiva
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden opacity-10 z-0">
        <div className="matrix-code"></div>
      </div>
      
      <div className="fixed inset-0 grid-background z-0"></div>
      
      <Container maxWidth="md" className="relative z-10">
        <Box 
          sx={{ 
            backgroundColor: 'rgba(18, 18, 18, 0.7)',
            border: '1px solid rgba(255, 0, 0, 0.5)',
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(5px)'
          }}
        >
          {/* Scan line effect */}
          <div className="scan-line absolute inset-x-0 h-1"></div>
          
          <ErrorIcon sx={{ fontSize: 60, color: '#FF0000', mb: 2 }} />
          
          <Typography 
            variant="h3" 
            component="h1" 
            className="font-mono mb-3 text-red-500 glitch-text"
            sx={{ letterSpacing: '3px', fontWeight: 'bold' }}
          >
            ERROR 404
          </Typography>
          
          <Typography variant="h5" className="font-mono mb-4" sx={{ color: '#FF5555' }}>
            ACESSO NEGADO - RECURSO NÃO ENCONTRADO
          </Typography>
          
          <Box 
            sx={{ 
              backgroundColor: 'black',
              border: '1px solid rgba(255, 0, 0, 0.5)',
              p: 2,
              my: 4,
              maxHeight: '150px',
              overflow: 'auto',
              textAlign: 'left'
            }}
          >
            <pre className="text-red-400 text-xs font-mono">
              {terminalText}<span className="cursor-blink">_</span>
            </pre>
          </Box>
          
          <Typography variant="body1" className="font-mono mb-5">
            A página ou recurso solicitado não existe ou foi removido.
            <br />
            Redirecionamento automático em <span className="text-red-400 font-bold">{countdown}</span> segundos...
          </Typography>
          
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
              py: 1,
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
              }
            }}
          >
            RETORNAR À BASE
          </Button>
          
          {/* Cantos decorativos */}
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-red-500 opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-red-500 opacity-60"></div>
          <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-red-500 opacity-60"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-red-500 opacity-60"></div>
        </Box>
      </Container>
    </div>
  );
};

export default NotFound;