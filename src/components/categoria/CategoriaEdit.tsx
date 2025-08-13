import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  getOne as getCategoria,
  updateOne as updateCategoria,
  validate as validateCategoria
} from '../../data/categoria';
import CategoriaForm, {
  type FormFieldValue,
  type CategoriaFormState,
} from './CategoriaForm';
import PageContainer from '../PageContainer';
import {Categoria} from "../../server/categoriaService";

function CategoriaEditForm({
  initialValues,
  onSubmit,
}: {
  initialValues: Partial<CategoriaFormState['values']>;
  onSubmit: (formValues: Partial<CategoriaFormState['values']>) => Promise<void>;
}) {
  const { categoriaId } = useParams();
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<CategoriaFormState>(() => ({
    values: initialValues,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  const setFormValues = React.useCallback(
    (newFormValues: Partial<CategoriaFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<CategoriaFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof CategoriaFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<CategoriaFormState['values']>) => {
        const { issues } = validateCategoria(values);
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
    const { issues } = validateCategoria(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await onSubmit(formValues);
      notifications.show('Categoria editado com sucesso.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/categoria');
    } catch (editError) {
      notifications.show(
        `Falha ao editar categoria. Motivo: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formValues, navigate, notifications, onSubmit, setFormErrors]);

  return (
    <CategoriaForm
      formState={formState}
      onFieldChange={handleFormFieldChange}
      onSubmit={handleFormSubmit}
      onReset={handleFormReset}
      submitButtonLabel="Save"
      backButtonPath={`/categoria/${categoriaId}`}
    />
  );
}

export default function CategoriaEdit() {
  const { categoriaId } = useParams();

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

  const handleSubmit = React.useCallback(
    async (formValues: Partial<CategoriaFormState['values']>) => {
      const updatedData = await updateCategoria(Number(categoriaId), formValues);
      setCategoria(updatedData);
    },
    [categoriaId],
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

    return categoria ? (
      <CategoriaEditForm initialValues={categoria} onSubmit={handleSubmit} />
    ) : null;
  }, [isLoading, error, categoria, handleSubmit]);

  return (
    <PageContainer
      title={`Editar Categoria: ${categoria != null ? categoria.nome : categoriaId}`}
      breadcrumbs={[
        { title: 'Categorias', path: '/categoria' },
        { title: `Categoria ${categoriaId}`, path: `/categoria/${categoriaId}` },
        { title: 'Editar' },
      ]}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>{renderEdit}</Box>
    </PageContainer>
  );
}
