import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  TextField,
  CircularProgress,
  Fade,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockIcon from '@mui/icons-material/Lock';
import SecurityIcon from '@mui/icons-material/Security';
import TerminalIcon from '@mui/icons-material/Terminal';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';

const HackerLanding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [terminalText, setTerminalText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [showMainContent, setShowMainContent] = useState(false);
  const [showGlitchEffect, setShowGlitchEffect] = useState(false);
  const [showFinalAccess, setShowFinalAccess] = useState(false);
  const terminalRef = useRef(null);

  // Simular texto sendo digitado no terminal
  useEffect(() => {
    let isMounted = true;
    const initialText = `
> initializing secure connection...
> bypassing firewall protocols...
> accessing darknet node...
> connection established
> welcome to CyberMarket
> type 'access' to enter the system
`;

    const typeText = async () => {
      setTerminalText('');
      for (let i = 0; i < initialText.length; i++) {
        if (!isMounted) return;
        setTerminalText(prev => prev + initialText.charAt(i));
        await new Promise(r => setTimeout(r, Math.random() * 10 + 10));
      }
    };

    typeText();
    
    return () => { isMounted = false; };
  }, []);

  // Scroll automático do terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalText]);

  // Processador de comandos
  const processCommand = async (command) => {
    // Adicionar comando ao histórico
    setCommandHistory(prev => [...prev, `> ${command}`]);
    setUserInput('');
    
    // Processar diferentes comandos
    switch(command.toLowerCase()) {
      case 'access':
        setCommandHistory(prev => [...prev, '> initializing authentication sequence...']);
        setLoading(true);
        
        await new Promise(r => setTimeout(r, 2000));
        
        setLoading(false);
        setCommandHistory(prev => [...prev, '> authentication successful']);
        setCommandHistory(prev => [...prev, '> decrypting marketplace data...']);
        
        await new Promise(r => setTimeout(r, 1500));
        
        setAccessGranted(true);
        setShowMainContent(true);
        break;
        
      case 'help':
        setCommandHistory(prev => [...prev, 
          '> available commands:',
          '> access - enter the marketplace',
          '> about - show information about our platform',
          '> security - display security information',
          '> clear - clear terminal',
          '> shop - proceed to shop directly'
        ]);
        break;
        
      case 'about':
        setCommandHistory(prev => [...prev, 
          '> CyberMarket is an exclusive marketplace for digital artifacts',
          '> We provide secure, anonymous transactions',
          '> Established 2023 by a collective of digital freedom advocates',
          '> Our mission is to connect buyers and sellers in a secure environment'
        ]);
        break;
        
      case 'security':
        setCommandHistory(prev => [...prev, 
          '> All transactions are encrypted end-to-end',
          '> Zero-knowledge protocols implemented',
          '> No logging of user activity',
          '> Tor network routing available',
          '> Multiple cryptocurrency payment options'
        ]);
        break;
        
      case 'clear':
        setCommandHistory([]);
        break;
        
      case 'shop':
        setCommandHistory(prev => [...prev, '> initializing direct access...']);
        
        await new Promise(r => setTimeout(r, 1000));
        
        setShowGlitchEffect(true);
        
        await new Promise(r => setTimeout(r, 1500));
        
        navigate('/products');
        break;
        
      default:
        setCommandHistory(prev => [...prev, `> command not recognized: ${command}`]);
        setCommandHistory(prev => [...prev, `> type 'help' for available commands`]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userInput.trim()) {
      processCommand(userInput.trim());
    }
  };

  const handleEnterSystem = () => {
    setShowGlitchEffect(true);
    setTimeout(() => {
      setShowFinalAccess(true);
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    }, 1000);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#000', 
        color: '#00FF00',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden opacity-20 z-0">
        <div className="matrix-code"></div>
      </div>
      
      <div className="fixed inset-0 grid-background z-0"></div>
      
      {/* Glitch effect overlay */}
      {showGlitchEffect && (
        <div className="fixed inset-0 z-50 glitch-overlay">
          <div className="glitch-lines"></div>
        </div>
      )}
      
      {/* Final access screen */}
      {showFinalAccess && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <Typography variant="h1" className="text-green-500 font-mono glitch-text text-center">
            ACCESS GRANTED
          </Typography>
        </div>
      )}
      
      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Initial terminal interface */}
        <Box 
          sx={{ 
            border: '1px solid #00FF00', 
            p: 3, 
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            mb: 4,
            position: 'relative',
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
            display: showMainContent ? 'none' : 'block'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: 'monospace', 
              textAlign: 'center', 
              mb: 2,
              color: '#00FF00',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
            }}
          >
            CYBER_MARKET TERMINAL
          </Typography>
          
          {/* Terminal output */}
          <Box 
            ref={terminalRef}
            sx={{ 
              bgcolor: 'black', 
              color: '#00FF00', 
              p: 2, 
              height: '300px', 
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '14px',
              mb: 2
            }}
          >
            <pre>{terminalText}</pre>
            {commandHistory.map((cmd, index) => (
              <div key={index}>{cmd}</div>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ color: '#00FF00', mr: 1 }} />
                <span>processing...</span>
              </Box>
            )}
          </Box>
          
          {/* Command input */}
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ mr: 1, fontFamily: 'monospace' }}>{'>'}</Typography>
            <TextField
              variant="standard"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiInput-input': {
                  color: '#00FF00',
                  fontFamily: 'monospace',
                  caretColor: '#00FF00'
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'rgba(0, 255, 0, 0.5)'
                },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: '#00FF00'
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#00FF00'
                }
              }}
              autoFocus
            />
          </Box>
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-green-500"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-green-500"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-green-500"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-green-500"></div>
        </Box>
        
        {/* Main content - shown after access granted */}
        <Fade in={showMainContent} timeout={1000}>
          <Box>
            <Typography 
              variant="h2" 
              className="glitch-text"
              sx={{ 
                fontFamily: 'monospace', 
                textAlign: 'center', 
                mb: 4,
                color: '#00FF00',
                textShadow: '0 0 15px rgba(0, 255, 0, 0.7)'
              }}
            >
              WELCOME TO CYBER_MARKET
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                fontFamily: 'monospace', 
                textAlign: 'center', 
                mb: 6,
                color: 'rgba(0, 255, 0, 0.8)'
              }}
            >
              SECURE. ANONYMOUS. UNTRACEABLE.
            </Typography>
            
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    border: '1px solid rgba(0, 255, 0, 0.5)',
                    p: 3,
                    height: '100%',
                    backgroundColor: 'rgba(0, 10, 0, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(0, 20, 0, 0.6)'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <SecurityIcon sx={{ fontSize: 60, color: '#00FF00' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'monospace', mb: 2, textAlign: 'center' }}>
                    SECURE TRANSACTIONS
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'rgba(0, 255, 0, 0.8)' }}>
                    End-to-end encryption ensures your data remains protected. All transactions utilize
                    zero-knowledge protocols and multi-signature verification.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    border: '1px solid rgba(0, 255, 0, 0.5)',
                    p: 3,
                    height: '100%',
                    backgroundColor: 'rgba(0, 10, 0, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(0, 20, 0, 0.6)'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <TerminalIcon sx={{ fontSize: 60, color: '#00FF00' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'monospace', mb: 2, textAlign: 'center' }}>
                    ADVANCED ACCESS
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'rgba(0, 255, 0, 0.8)' }}>
                    Our platform utilizes advanced routing techniques to ensure your activity 
                    remains private. IP masking and traffic randomization come standard.
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box 
                  sx={{ 
                    border: '1px solid rgba(0, 255, 0, 0.5)',
                    p: 3,
                    height: '100%',
                    backgroundColor: 'rgba(0, 10, 0, 0.5)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 0 15px rgba(0, 255, 0, 0.5)',
                      transform: 'translateY(-5px)',
                      backgroundColor: 'rgba(0, 20, 0, 0.6)'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <CodeIcon sx={{ fontSize: 60, color: '#00FF00' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontFamily: 'monospace', mb: 2, textAlign: 'center' }}>
                    DIGITAL ARTIFACTS
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'rgba(0, 255, 0, 0.8)' }}>
                    Discover exclusive digital tools and artifacts not available through 
                    conventional channels. Our marketplace connects you with verified vendors.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box 
              sx={{ 
                textAlign: 'center',
                position: 'relative',
                p: 4,
                border: '1px solid rgba(0, 255, 0, 0.7)',
                backgroundColor: 'rgba(0, 10, 0, 0.7)',
                mb: 6
              }}
            >
              <Typography variant="h4" sx={{ fontFamily: 'monospace', mb: 3 }}>
                READY TO ACCESS THE MARKET?
              </Typography>
              
              <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 4, maxWidth: '800px', mx: 'auto' }}>
                By entering our system, you acknowledge the secure nature of our platform and agree to maintain
                operational security practices. Cyber_Market is not responsible for individual actions.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                startIcon={<LockIcon />}
                onClick={handleEnterSystem}
                sx={{
                  backgroundColor: 'black',
                  color: '#00FF00',
                  border: '2px solid #00FF00',
                  fontFamily: 'monospace',
                  py: 1.5,
                  px: 4,
                  fontSize: '18px',
                  letterSpacing: '2px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.7)'
                  }
                }}
              >
                ENTER SYSTEM
              </Button>
              
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-green-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-green-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-green-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-green-500"></div>
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                opacity: 0.7, 
                fontFamily: 'monospace' 
              }}
            >
              CYBER_MARKET © 2023-2025 | DECENTRALIZED OPERATIONS
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default HackerLanding;

// Adicione os seguintes estilos CSS ao seu arquivo global:
/*

*/