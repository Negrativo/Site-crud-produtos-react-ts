import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  getOne as getProduto,
  updateOne as updateProduto,
  validate as validateProduto
} from '../../data/produtos';
import ProdutoForm, {
  type FormFieldValue,
  type ProdutoFormState,
} from './ProdutoForm';
import PageContainer from '../PageContainer';
import {Produto} from "../../server/produtosService";

function ProdutoEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<ProdutoFormState['values']>;
  onSubmit: (formValues: Partial<ProdutoFormState['values']>) => Promise<void>;
}) {
  const { produtoId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<ProdutoFormState>(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<ProdutoFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<ProdutoFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof ProdutoFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<ProdutoFormState['values']>) => {
        const { issues } = validateProduto(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateProduto(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Produto editado com sucesso.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/produto');
    } catch (editError) {
      notifications.show(
        `Falha ao editar produto. Motivo: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <ProdutoForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Atualizar dados"
      backButtonPath={`/produto/${produtoId}`}
    />
  );
}

export default function ProdutoEdit() {
  const { produtoId } = useParams();

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

  const handleSubmit = React.useCallback(
    async (formValues: Partial<ProdutoFormState['values']>) => {
      const updatedData = await updateProduto(Number(produtoId), formValues);
      setProduto(updatedData);
    },
    [produtoId],
  );

  const renderEdit = React.useMemo(() => {
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
      <ProdutoEditForm initialValues={produto} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, produto, handleSubmit]);

  return (
    <PageContainer
      title={`Editar Produto: ${produto != null ? produto.descricao : produtoId}`}
      breadcrumbs={[
        { title: 'Produtos', path: '/produto' },
        { title: `Produto ${produtoId}`, path: `/produto/${produtoId}` },
        { title: 'Editar' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
