import React, {useContext, useEffect, useState} from 'react';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import { useNotification } from '../../context/NotificationContext';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginWeb } from '../../server/loginService';
import {AuthContext} from "../../context/AuthContext";

function Login() {
  const { triggerNotification } = useNotification();
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false);

  useEffect(() => {
    console.log('is autenticado? ', isAuthenticated);
    if (isAuthenticated) {
      console.log('is autenticado!');
      navigate('/atualiza-etiq/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isLoading) {
      setIsLoadingLogin(true);
    } else {
      setIsLoadingLogin(false);
    }
  }, [isLoading])

  async function handleLoginWeb() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    if (username && password) {
      setIsLoadingLogin(true);
      try {
        const loginData = await loginWeb(username, password);
        if (!!loginData) {
          login(loginData);
          navigate('/atualiza-etiq/home');
          triggerNotification('Logado com sucesso!', 'success');
        } else {
          const mensagem =
            loginData.message ||
            'Login inválido ou não foi possível realizar o login!';
          triggerNotification(mensagem, 'warning');
        }
      } catch (error) {
        console.error('Erro durante o login:', error);
        triggerNotification('Erro ao tentar logar. Tente novamente.', 'error');
      } finally {
        setIsLoadingLogin(false);
      }
    } else {
      triggerNotification('Por favor, preencha todos os campos.', 'warning');
    }
  }

  const handleCodigoChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSenhaChange = (event) => {
    setPassword(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLoginWeb();
    }
  };

  return (
    <div className="container-login">
      <div className="text-welcome">
        <img className="img-login" height={70} src={`${process.env.PUBLIC_URL}/grupo_muffato.png`} alt="Logo Muffato" />
        <Typography variant="h4" gutterBottom>
          Sistema de atualização de etiquetas
          <LocalOfferIcon sx={{ verticalAlign: 'middle', mr: 1, width: 30, height: 30 }} />
        </Typography>
        <div className="text-subtitle">
          <Typography variant="subtitle1" gutterBottom>
            Realize o login para acessar a aplicação.
          </Typography>
        </div>
      </div>
      <div className="inputs">
        <TextField
          label="Login"
          fullWidth
          onChange={handleCodigoChange}
          margin="normal"
          onKeyDown={handleKeyDown}
        />
        <TextField
          label="Senha"
          onKeyDown={handleKeyDown}
          type="password" fullWidth onChange={handleSenhaChange} margin="normal" />
        <Button
          style={{ marginBottom: '10px' }}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLoginWeb}
          disabled={isLoadingLogin}
        >
          {isLoadingLogin ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Entrar'
          )}
        </Button>
       
      </div>
    </div>
  );
}

export default Login;
