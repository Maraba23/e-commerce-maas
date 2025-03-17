import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  InputBase, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Box,
  Avatar
} from '@mui/material';

// Nós usaremos ícones padrão do MUI para manter a compatibilidade
// Você pode substituir por outros ícones se preferir
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import CategoryIcon from '@mui/icons-material/Category';
import HomeIcon from '@mui/icons-material/Home';
import TerminalIcon from '@mui/icons-material/Terminal';

const HackerNavbar = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [terminalText, setTerminalText] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);

  // Estado que indica se já renderizou a animação de texto
  const [hasAnimated, setHasAnimated] = useState(false);

  // Simulação de terminal com texto digitado
  useEffect(() => {
    if (showTerminal && !hasAnimated) {
      const commands = [
        "$ ./connect --secure",
        "$ loading user preferences...",
        "$ scanning store inventory..."
      ];
      
      let currentCommandIndex = 0;
      let currentCharIndex = 0;
      let timerId;
      
      const typeText = () => {
        if (currentCommandIndex < commands.length) {
          const currentCommand = commands[currentCommandIndex];
          
          if (currentCharIndex < currentCommand.length) {
            setTerminalText(prev => prev + currentCommand[currentCharIndex]);
            currentCharIndex++;
          } else {
            setTerminalText(prev => prev + '\n');
            currentCommandIndex++;
            currentCharIndex = 0;
          }
          
          timerId = setTimeout(typeText, Math.random() * 50 + 30);
        } else {
          setHasAnimated(true);
        }
      };
      
      typeText();
      
      return () => clearTimeout(timerId);
    }
  }, [showTerminal, hasAnimated]);

  const resetTerminal = () => {
    setTerminalText('');
    setHasAnimated(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    if (!mobileOpen) {
      setShowTerminal(true);
      resetTerminal();
    }
  };

  const handleLogout = () => {
    // Remover token do localStorage
    localStorage.removeItem('authToken');
    // Redirecionar para a página de login
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      // Implementar a lógica de busca aqui
      console.log('Buscando por:', searchQuery);
      // navigate(`/search?q=${searchQuery}`);
    }
  };

  const isMenuOpen = Boolean(anchorEl);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          backgroundColor: '#121212',
          border: '1px solid #00FF00',
          color: '#00FF00',
          '& .MuiMenuItem-root': {
            fontFamily: 'monospace',
            '&:hover': {
              backgroundColor: 'rgba(0, 255, 0, 0.1)'
            }
          }
        }
      }}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <div className="flex items-center">
          <AccountCircleIcon className="mr-2" /> Perfil
        </div>
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/orders'); }}>
        <div className="flex items-center">
          <TerminalIcon className="mr-2" /> Meus Pedidos
        </div>
      </MenuItem>
      <Divider sx={{ backgroundColor: 'rgba(0, 255, 0, 0.2)' }} />
      <MenuItem onClick={handleLogout}>
        <div className="flex items-center text-red-400">
          <LogoutIcon className="mr-2" /> Logout
        </div>
      </MenuItem>
    </Menu>
  );

  // Drawer para menu mobile
  const drawer = (
    <Box sx={{ 
      width: 250, 
      height: '100%', 
      backgroundColor: '#121212',
      color: '#00FF00',
      border: 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Scanline animation */}
      <div className="scan-line absolute w-full h-1 top-0 left-0"></div>
      
      {/* Fake terminal window */}
      <Box 
        sx={{ 
          backgroundColor: 'rgba(0, 20, 0, 0.3)', 
          padding: '10px',
          height: '80px',
          borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
          margin: '10px',
          overflow: 'hidden'
        }}
      >
        <pre className="text-green-400 text-xs font-mono">
          {terminalText}<span className="cursor-blink">_</span>
        </pre>
      </Box>

      <div className="absolute top-2 right-2 flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <List>
        <ListItem 
          button 
          onClick={() => navigate('/')} 
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
            margin: '5px 0',
            borderRadius: '4px'
          }}
        >
          <HomeIcon className="mr-3 text-green-400" />
          <ListItemText 
            primary="Início" 
            primaryTypographyProps={{ 
              style: { fontFamily: 'monospace', letterSpacing: '1px' } 
            }} 
          />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => navigate('/products')} 
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
            margin: '5px 0',
            borderRadius: '4px'
          }}
        >
          <CategoryIcon className="mr-3 text-green-400" />
          <ListItemText 
            primary="Produtos" 
            primaryTypographyProps={{ 
              style: { fontFamily: 'monospace', letterSpacing: '1px' } 
            }} 
          />
        </ListItem>
        
        <ListItem 
          button 
          onClick={() => navigate('/cart')} 
          sx={{ 
            '&:hover': { backgroundColor: 'rgba(0, 255, 0, 0.1)' },
            margin: '5px 0',
            borderRadius: '4px'
          }}
        >
          <ShoppingCartIcon className="mr-3 text-green-400" />
          <ListItemText 
            primary="Carrinho" 
            primaryTypographyProps={{ 
              style: { fontFamily: 'monospace', letterSpacing: '1px' } 
            }}
            secondary={cartItemCount > 0 ? `${cartItemCount} itens` : undefined}
            secondaryTypographyProps={{ 
              style: { color: '#00FF00', opacity: 0.7, fontFamily: 'monospace' } 
            }}
          />
        </ListItem>
      </List>
      
      <Divider sx={{ backgroundColor: 'rgba(0, 255, 0, 0.2)', margin: '10px 0' }} />
      
      <ListItem 
        button 
        onClick={handleLogout} 
        sx={{ 
          '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' },
          margin: '5px 10px',
          borderRadius: '4px',
          color: '#ff4444'
        }}
      >
        <LogoutIcon className="mr-3" />
        <ListItemText 
          primary="Logout" 
          primaryTypographyProps={{ 
            style: { fontFamily: 'monospace', letterSpacing: '1px' } 
          }}
        />
      </ListItem>
      
      {/* Decorative corners */}
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500"></div>
      <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500"></div>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          borderBottom: '1px solid #00FF00',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)'
        }}
      >
        <Toolbar className="relative">
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#00FF00' }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              fontFamily: 'monospace', 
              letterSpacing: '2px',
              fontWeight: 'bold',
              color: '#00FF00',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
            className="glitch-text"
          >
            CYBER_MARKET
          </Typography>
          
          {/* Status indicator */}
          <div className="hidden sm:flex items-center ml-4 bg-black bg-opacity-30 px-2 py-1 rounded border border-green-500 text-xs text-green-400 font-mono">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            SECURE::CONN
          </div>
          
          {/* Navigation links - desktop only */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            <Typography
              variant="body2"
              component="div"
              sx={{ 
                mr: 3,
                fontFamily: 'monospace',
                color: '#00FF00',
                cursor: 'pointer',
                '&:hover': { textShadow: '0 0 5px #00FF00' }
              }}
              onClick={() => navigate('/products')}
            >
              PRODUTOS
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{ 
                mr: 3,
                fontFamily: 'monospace',
                color: '#00FF00',
                cursor: 'pointer',
                '&:hover': { textShadow: '0 0 5px #00FF00' }
              }}
              onClick={() => navigate('/about')}
            >
              PEDIDOS
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />

          {/* Search */}
          <Box 
            sx={{ 
              position: 'relative', 
              borderRadius: '4px', 
              backgroundColor: 'rgba(0, 20, 0, 0.3)',
              border: '1px solid rgba(0, 255, 0, 0.5)',
              '&:hover': { border: '1px solid #00FF00' },
              marginRight: 2,
              marginLeft: 0,
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: '100%', sm: '300px' }
            }}
            className="flex items-center"
          >
            <SearchIcon sx={{ color: '#00FF00', mx: 1 }} />
            <InputBase
              placeholder="BUSCAR..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleSearchSubmit}
              sx={{
                color: '#00FF00',
                fontFamily: 'monospace',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: '8px',
                  transition: 'width 300ms',
                  width: '100%',
                },
              }}
            />
          </Box>
          
          {/* Cart icon */}
          <IconButton 
            color="inherit" 
            sx={{ color: '#00FF00' }}
            onClick={() => navigate('/cart')}
          >
            <Badge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          
          {/* Profile icon */}
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ color: '#00FF00' }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                backgroundColor: 'black', 
                border: '1px solid #00FF00',
                color: '#00FF00'
              }}
            >
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          
          {/* Decorative scan line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 opacity-20"></div>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250, backgroundColor: '#121212' },
        }}
      >
        {drawer}
      </Drawer>
      
      {renderMenu}
    </>
  );
};

export default HackerNavbar;