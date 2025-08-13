import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate, useParams} from 'react-router';
// @ts-ignore
import dayjs from 'dayjs';
import {useDialogs} from '../../hooks/useDialogs/useDialogs';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {deleteOne as deleteCategoria, getOne as getCategoria} from '../../data/categoria';
import PageContainer from '../PageContainer';
import {Categoria} from "../../server/categoriaService";

export default function DepartamentoShow() {
  const {categoriaId} = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [categoria, setCategoria] = React.useState<Categoria | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getCategoria(Number(categoriaId));

      setCategoria(showData);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [categoriaId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategoriaEdit = React.useCallback(() => {
    navigate(`/categoria/${categoriaId}/editar`);
  }, [navigate, categoriaId]);

  const handleCategoriaDelete = React.useCallback(async () => {
    if (!categoria) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `Você deseja excluir ${categoria.nome}?`,
      {
        title: `Deletar categoria?`,
        severity: 'error',
        okText: 'Deletar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteCategoria(Number(categoriaId));

        navigate('/categoria');

        notifications.show('Categoria com sucesso.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `Falha ao deletar categoria. Motivo:' ${(deleteError as Error).message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [categoria, dialogs, categoriaId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/categoria');
  }, [navigate]);

  const renderShow = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            m: 1,
          }}
        >
          <CircularProgress/>
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{flexGrow: 1}}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return categoria ? (
      <Box sx={{flexGrow: 1, width: '100%'}}>
        <Grid container spacing={2} sx={{width: '100%'}}>
          <Grid size={{xs: 12, sm: 6}}>
            <Paper sx={{px: 2, py: 1}}>
              <Typography variant="overline">Nome</Typography>
              <Typography variant="body1" sx={{mb: 1}}>
                {categoria.nome}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <Paper sx={{px: 2, py: 1}}>
              <Typography variant="overline">Departamento</Typography>
              <Typography variant="body1" sx={{mb: 1}}>
                {categoria.nomeDepartamento}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6}}>
            <Paper sx={{px: 2, py: 1}}>
              <Typography variant="overline">Data Cadastro</Typography>
              <Typography variant="body1" sx={{mb: 1}}>
                {dayjs(categoria.dataCadastro).format('MMMM D, YYYY')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{my: 3}}/>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon/>}
            onClick={handleBack}
          >
            Voltar
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon/>}
              onClick={handleCategoriaEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon/>}
              onClick={handleCategoriaDelete}
            >
              Deletar
            </Button>
          </Stack>
        </Stack>
      </Box>
    ) : null;
  }, [
    isLoading,
    error,
    categoria,
    handleBack,
    handleCategoriaEdit,
    handleCategoriaDelete,
  ]);

  const pageTitle = `Categoria ${categoriaId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        {title: 'Categorias', path: '/categoria'},
        {title: pageTitle},
      ]}
    >
      <Box sx={{display: 'flex', flex: 1, width: '100%'}}>{renderShow}</Box>
    </PageContainer>
  );
}
