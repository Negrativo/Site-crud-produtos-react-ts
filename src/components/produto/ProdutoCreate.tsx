import * as React from 'react';
import { useNavigate } from 'react-router';
import useNotifications from '../../hooks/useNotifications/useNotifications';
import {
  createOne as createProduto,
  validate as validateProduto,
} from '../../data/produtos';
import ProdutoForm, {
  type FormFieldValue,
  type ProdutoFormState,
} from './ProdutoForm';
import PageContainer from '../PageContainer';
import {Produto} from "../../server/produtosService";

// @ts-ignore
const INITIAL_FORM_VALUES: Partial<ProdutoFormState['values']> = {
  role: 'Market',
  isFullTime: true,
};

export default function ProdutoCreate() {
  const navigate = useNavigate();

  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<ProdutoFormState>(() => ({
    values: INITIAL_FORM_VALUES,
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
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

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
      await createProduto(formValues as Omit<Produto, 'id'>);
      notifications.show('Produto criado com sucesso.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      navigate('/produto');
    } catch (createError) {
      notifications.show(
        `Falha ao criar produto. Mensagem: ${(createError as Error).message}`,
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
      title="Novo Produto"
      breadcrumbs={[{ title: 'Produtos', path: '/produto' }, { title: 'Novo' }]}
    >
      <ProdutoForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        submitButtonLabel="Criar"
      />
    </PageContainer>
  );
}
