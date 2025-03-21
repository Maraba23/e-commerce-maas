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

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [terminalText, setTerminalText] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Efeito de digitação para o terminal
  useEffect(() => {
    const messages = [
      "Inicializando sistema de registro...",
      "Verificando conexão segura...",
      "Criptografia ativada...",
      "Sistema pronto para novos usuários...",
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
    setError(""); // Limpa erros ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se as senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setToast({
        type: 'success',
        message: '[SUCCESS] Registro bem-sucedido! Redirecionando para o login...'
      });
      
      // Aguarda um momento antes de redirecionar
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      setToast({
        type: 'error',
        message: `[ERROR] ${error.response?.data?.message || "Falha na autenticação. Verifique os dados fornecidos."}`
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
        
        <div className="absolute top-3 left-3 text-xs text-green-400 font-mono opacity-70">SEC::ACCESS_v2.1</div>
        
        <Typography 
          variant="h4" 
          className="text-green-400 text-center mb-2 font-mono glitch-text"
          sx={{ letterSpacing: "2px", fontWeight: "bold" }}
        >
          CRIAR ACESSO
        </Typography>
        
        <div className="w-full h-16 bg-black border border-green-500 rounded-md mb-4 p-2 overflow-hidden">
          <pre className="text-green-400 text-xs font-mono h-full overflow-hidden">
            {terminalText}<span className="cursor-blink">_</span>
          </pre>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
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
            label="Endereço E-mail"
            name="email"
            type="email"
            variant="outlined"
            required
            onChange={handleChange}
            InputProps={{ 
              style: { color: "#00FF00", fontFamily: "monospace" },
              startAdornment: <span className="text-green-400 mr-2">@</span>
            }}
            sx={inputStyle}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Senha"
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
            <TextField
              fullWidth
              label="Confirmar Senha"
              name="confirmPassword"
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
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded p-2 mt-2">
              <Typography className="text-red-400 text-sm font-mono flex items-center">
                <span className="mr-2">!</span> {error}
              </Typography>
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="pulse-button"
            sx={{
              mt: 2,
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
            {loading ? <CircularProgress size={24} sx={{ color: "#00FF00" }} /> : "INICIAR ACESSO"}
          </Button>
        </form>
        
        <div className="mt-6 border-t border-green-900 pt-4 flex justify-center">
          <Typography variant="body2" className="text-green-400 text-center font-mono">
            Acesso já autorizado?{" "}
            <span 
              className="cursor-pointer hover:text-green-300 underline underline-offset-4" 
              onClick={() => navigate("/login")}
            >
              Entrar no sistema
            </span>
          </Typography>
        </div>
        
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

// Adicione estes estilos ao seu CSS global
/*

*/