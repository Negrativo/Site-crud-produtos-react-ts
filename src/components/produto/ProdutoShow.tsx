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
import { useNavigate, useParams } from 'react-router';
// @ts-ignore
import dayjs from 'dayjs';
import { useDialogs } from '../../hooks/useDialogs/useDialogs';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteProduto,
  getOne as getProduto
} from '../../data/produtos';
import PageContainer from '../PageContainer';
import {Produto} from "../../server/produtosService";

export default function ProdutoShow() {
  const { produtoId } = useParams();
  const navigate = useNavigate();

  const dialogs = useDialogs();
  const notifications = useNotifications();

  const [produto, setProduto] = React.useState<Produto | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const showData = await getProduto(Number(produtoId));

      setProduto(showData);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [produtoId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProdutoEdit = React.useCallback(() => {
    navigate(`/produto/${produtoId}/editar`);
  }, [navigate, produtoId]);

  const handleProdutoDelete = React.useCallback(async () => {
    if (!produto) {
      return;
    }

    const confirmed = await dialogs.confirm(
      `Você deseja excluir ${produto.descricao}?`,
      {
        title: `Deletar produto?`,
        severity: 'error',
        okText: 'Deletar',
        cancelText: 'Cancelar',
      },
    );

    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteProduto(Number(produtoId));

        navigate('/produto');

        notifications.show('Produto deleted successfully.', {
          severity: 'success',
          autoHideDuration: 3000,
        });
      } catch (deleteError) {
        notifications.show(
          `Failed to delete produto. Reason:' ${(deleteError as Error).message}`,
          {
            severity: 'error',
            autoHideDuration: 3000,
          },
        );
      }
      setIsLoading(false);
    }
  }, [produto, dialogs, produtoId, navigate, notifications]);

  const handleBack = React.useCallback(() => {
    navigate('/produto');
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
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">{error.message}</Alert>
        </Box>
      );
    }

    return produto ? (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Descrição</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {produto.descricao}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Cod Barras</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {produto.ean}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Categoria</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {produto.categoria}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Departamento</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {produto.nomeDepartamento}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Data Cadastro</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {dayjs(produto.dataCadastro).format('MMMM D, YYYY')}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="overline">Unid Medida</Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {produto.unidadeMedida}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={2} justifyContent="space-between">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Voltar
          </Button>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleProdutoEdit}
            >
              Editar
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleProdutoDelete}
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
    produto,
    handleBack,
    handleProdutoEdit,
    handleProdutoDelete,
  ]);

  const pageTitle = `Produto ${produtoId}`;

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[
        { title: 'Produtos', path: '/produto' },
        { title: pageTitle },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1, width: '100%' }}>{renderShow}</Box>
    </PageContainer>
  );
}
