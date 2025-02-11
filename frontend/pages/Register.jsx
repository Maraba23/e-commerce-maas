import { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress } from "@mui/material";
import axiosInstance from "../services/axiosConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

      Swal.fire({
        icon: "success",
        title: "Registro bem-sucedido!",
        text: "Agora você pode fazer login.",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro no registro",
        text: error.response?.data?.message || "Verifique os dados e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <Box
        className="w-full max-w-md p-6 rounded-lg shadow-lg"
        sx={{ backgroundColor: "#1E1E1E", border: "1px solid #00FF00" }}
      >
        <Typography variant="h4" className="text-green-400 text-center mb-4">
          Criar Conta
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuário"
            name="username"
            variant="outlined"
            margin="normal"
            required
            onChange={handleChange}
            InputProps={{ style: { color: "#00FF00" } }}
            sx={inputStyle}
          />
          <TextField
            fullWidth
            label="E-mail"
            name="email"
            type="email"
            variant="outlined"
            margin="normal"
            required
            onChange={handleChange}
            InputProps={{ style: { color: "#00FF00" } }}
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
              InputProps={{ style: { color: "#00FF00" } }}
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
              InputProps={{ style: { color: "#00FF00" } }}
              sx={inputStyle}
            />
          </div>

          {error && <Typography className="text-red-500 text-sm mt-2">{error}</Typography>}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#00FF00",
              color: "#1E1E1E",
              "&:hover": { backgroundColor: "#00CC00" },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#1E1E1E" }} /> : "Registrar"}
          </Button>
        </form>
        <Typography variant="body2" className="text-green-400 text-center mt-4">
          Já tem uma conta?{" "}
          <span className="cursor-pointer underline" onClick={() => navigate("/login")}>
            Faça login
          </span>
        </Typography>
      </Box>
    </div>
  );
}

// Estilos dos campos de entrada
const inputStyle = {
  "& label.Mui-focused": { color: "#00FF00" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#00FF00" },
    "&:hover fieldset": { borderColor: "#00FF00" },
    "&.Mui-focused fieldset": { borderColor: "#00FF00" },
  },
};
