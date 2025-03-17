import { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";

// Componente Toast personalizado
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

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Efeito de digitação para o terminal
  useEffect(() => {
    const messages = [
      "Inicializando protocolo de autenticação...",
      "Estabelecendo conexão segura...",
      "Criptografia de dados ativada...",
      "Aguardando credenciais...",
    ];
    
    let currentMessageIndex = 0;
    let currentCharIndex = 0;
    let timer;
    
    const typeText = () => {
      if (currentMessageIndex < messages.length) {
        const currentMessage = messages[currentMessageIndex];
        
        if (currentCharIndex < currentMessage.length) {
          setTerminalText(prev => prev + currentMessage[currentCharIndex]);
          currentCharIndex++;
        } else {
          setTerminalText(prev => prev + "\n$ ");
          currentMessageIndex++;
          currentCharIndex = 0;
        }
        
        timer = setTimeout(typeText, Math.random() * 50 + 30);
      }
    };
    
    typeText();
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("login/", {
        username: formData.username,
        password: formData.password
      });

      // Guarda o token no localStorage
      localStorage.setItem("authToken", response.data.token);
      
      setToast({
        type: 'success',
        message: '[ACCESS_GRANTED] Login bem-sucedido! Redirecionando...'
      });
      
      // Pequeno delay antes de redirecionar (ajuste conforme necessário)
      setTimeout(() => {
        navigate("/products"); // Ajuste conforme sua rota pós-login
      }, 2000);
      
    } catch (error) {
      setToast({
        type: 'error',
        message: `[ACCESS_DENIED] ${error.response?.data?.message || "Credenciais inválidas. Acesso negado."}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-black overflow-hidden relative">
      {/* Toast notification */}
      {toast && (
        <HackerToast 
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      
      {/* Fundo animado com código matrix */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="matrix-code"></div>
      </div>
      
      {/* Grid de linhas de grade */}
      <div className="absolute inset-0 grid-background"></div>
      
      <Box
        className="w-full max-w-md p-6 rounded-lg shadow-lg relative z-10 overflow-hidden transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,0,0.5)]"
        sx={{ 
          backgroundColor: "rgba(14, 17, 14, 0.85)",
          border: "1px solid #00FF00",
          boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)",
          backdropFilter: "blur(8px)"
        }}
      >
        {/* Animação de linha de escaneamento */}
        <div className="absolute inset-x-0 top-0 h-1 scan-line"></div>
        
        {/* Elementos decorativos em estilo "hacker" */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
        
        <div className="absolute top-3 left-3 text-xs text-green-400 font-mono opacity-70">SEC::AUTH_v3.0</div>
        
        <Typography 
          variant="h4" 
          className="text-green-400 text-center mb-2 font-mono glitch-text"
          sx={{ letterSpacing: "2px", fontWeight: "bold" }}
        >
          AUTENTICAÇÃO
        </Typography>
        
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 border-2 border-green-500 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center overflow-hidden">
              <div className="lock-icon text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full h-16 bg-black border border-green-500 rounded-md mb-4 p-2 overflow-hidden">
          <pre className="text-green-400 text-xs font-mono h-full overflow-hidden">
            {terminalText}<span className="cursor-blink">_</span>
          </pre>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Identificação de Usuário"
            name="username"
            variant="outlined"
            required
            onChange={handleChange}
            InputProps={{ 
              style: { color: "#00FF00", fontFamily: "monospace" },
              startAdornment: <span className="text-green-400 mr-2">&gt;</span>
            }}
            sx={inputStyle}
          />
          
          <TextField
            fullWidth
            label="Senha de Acesso"
            name="password"
            type="password"
            variant="outlined"
            required
            onChange={handleChange}
            InputProps={{ 
              style: { color: "#00FF00", fontFamily: "monospace" },
              startAdornment: <span className="text-green-400 mr-2">*</span>
            }}
            sx={inputStyle}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="h-12 pulse-button"
            sx={{
              mt: 3,
              backgroundColor: "#121212",
              color: "#00FF00",
              border: "1px solid #00FF00",
              fontFamily: "monospace",
              letterSpacing: "1px",
              "&:hover": { 
                backgroundColor: "#00FF00", 
                color: "#121212",
                boxShadow: "0 0 10px #00FF00"
              },
              position: "relative",
              overflow: "hidden"
            }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#00FF00" }} />
            ) : (
              <>ACESSAR SISTEMA</>
            )}
          </Button>
        </form>
        
        <div className="mt-6 border-t border-green-900 pt-4 flex justify-center">
          <Typography variant="body2" className="text-green-400 text-center font-mono">
            Não possui uma conta?{" "}
            <span 
              className="cursor-pointer hover:text-green-300 underline underline-offset-4" 
              onClick={() => navigate("/register")}
            >
              Registrar-se
            </span>
          </Typography>
        </div>
        
        {/* Mensagem de segurança */}
        <div className="mt-4 text-xs text-green-400 opacity-60 font-mono text-center">
          [ ATENÇÃO: Acesso monitorado. Tentativas não autorizadas serão rastreadas. ]
        </div>
        
        {/* Efeito de escaneamento biométrico */}
        <div className="absolute bottom-5 left-5 right-5 h-1 bg-green-500 opacity-50 scan-horizontal"></div>
        
        {/* Decoração de canto */}
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-green-500"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-green-500"></div>
        <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-green-500"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-green-500"></div>
      </Box>
    </div>
  );
}

// Estilos dos campos de entrada
const inputStyle = {
  "& label": { 
    color: "rgba(0, 255, 0, 0.7)",
    fontFamily: "monospace"
  },
  "& label.Mui-focused": { 
    color: "#00FF00",
    fontWeight: "bold"
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { 
      borderColor: "rgba(0, 255, 0, 0.5)",
      borderWidth: "1px"
    },
    "&:hover fieldset": { 
      borderColor: "#00FF00",
      borderWidth: "2px"
    },
    "&.Mui-focused fieldset": { 
      borderColor: "#00FF00",
      boxShadow: "0 0 5px rgba(0, 255, 0, 0.5)"
    },
    backgroundColor: "rgba(0, 20, 0, 0.3)"
  },
  marginBottom: "16px"
};

// Adicione estes estilos ao seu CSS global (se você não tiver feito isso para o Register)
/*

*/