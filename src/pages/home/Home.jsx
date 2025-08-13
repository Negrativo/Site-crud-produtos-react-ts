import React, {useContext, useState} from "react";
import {Container, Typography} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import './Home.css';
import {AuthContext} from "../../context/AuthContext";

function Home() {
    const { logout } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const sair = () => {
        logout();
    }

    return (
        <div style={{height: '100%', width: '100%'}}>
            <div className='header'>
                <div style={{gap: '15px', display: 'flex'}}>
                    <Typography variant="h6" gutterBottom color="white">Atualiza sitemas de etiquetas</Typography>
                </div>
                <IconButton style={{color: 'white'}}  onClick={sair}>
                    <Typography style={{color: 'white', fontSize: 18, marginRight: 5}}>Sair</Typography>
                    <LogoutIcon sx={{ fontSize: 40, color: 'white' }}/>
                </IconButton>
            </div>
            <Container maxWidth="xl">

            </Container>
        </div>
    );
}

export default Home;