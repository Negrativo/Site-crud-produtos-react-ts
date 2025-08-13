import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  createOne as createCategoria,
  validate as validateCategoria,
} from '../../data/categoria';
import DepartamentoForm, {
  type FormFieldValue,
  type CategoriaFormState,
} from './DepartamentoForm';
import PageContainer from '../PageContainer';
import {Categoria} from "../../server/categoriaService";

// @ts-ignore
const INITIAL_FORM_VALUES: Partial<CategoriaFormState['values']> = {
  role: 'Market',
  isFullTime: true,
};

export default function DepartamentoCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<CategoriaFormState>(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await createCategoria(formValues as Omit<Categoria, 'id'>);
      notifications.show('Categoria criado com sucesso.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/categoria');
    } catch (createError) {
      notifications.show(
        `Falha ao criar categoria. Mensagem: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, navigate, notifications, setFormErrors]);

  return (
    <PageContainer
      title="Novo Categoria"
      breadcrumbs={[{ title: 'Categorias', path: '/categoria' }, { title: 'Novo' }]}
    >
      <DepartamentoForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Criar"
      />
    </PageContainer>
  );
}
