import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Grid';
import {SelectChangeEvent} from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {useNavigate} from 'react-router';
// @ts-ignore
import dayjs, {Dayjs} from 'dayjs';
import {Categoria} from "../../server/categoriaService";

export interface CategoriaFormState {
  values: Partial<Omit<Categoria, 'id'>>;
  errors: Partial<Record<keyof CategoriaFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface CategoriaFormProps {
  formState: CategoriaFormState;
  onFieldChange: (
    name: keyof CategoriaFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<CategoriaFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<CategoriaFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function DepartamentoForm(props: CategoriaFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    backButtonPath,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof CategoriaFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof CategoriaFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof CategoriaFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof CategoriaFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else if (formValues[fieldName]) {
        onFieldChange(fieldName, null);
      }
    },
    [formValues, onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof CategoriaFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backButtonPath ?? '/categoria');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{width: '100%'}}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{mb: 2, width: '100%'}}>
          <Grid size={{xs: 12, sm: 6}} sx={{display: 'flex'}}>
            <TextField
              value={formValues.nome ?? ''}
              onChange={handleTextFieldChange}
              name="nome"
              label="Nome"
              error={!!formErrors.nome}
              helperText={formErrors.nome ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{xs: 12, sm: 6}} sx={{display: 'flex'}}>
            <TextField
              type="string"
              value={formValues.nomeDepartamento ?? ''}
              onChange={handleTextFieldChange}
              name="nomeDepartamento"
              label="Departamento"
              error={!!formErrors.nomeDepartamento}
              helperText={formErrors.nomeDepartamento ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{xs: 12, sm: 6}} sx={{display: 'flex'}}>
            {/*<Autocomplete*/}
            {/*    type="number"*/}
            {/*    value={formValues.categoriaId ?? ''}*/}
            {/*    onChange={handleNumberFieldChange}*/}
            {/*    name="ean"*/}
            {/*    label="Codigo de barras"*/}
            {/*    error={!!formErrors.ean}*/}
            {/*    helperText={formErrors.ean ?? ' '}*/}
            {/*    fullWidth*/}
            {/*/>*/}
          </Grid>
          <Grid size={{xs: 12, sm: 6}} sx={{display: 'flex'}}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.dataCadastro ? dayjs(formValues.dataCadastro) : null}
                onChange={handleDateFieldChange('dataCadastro')}
                name="dataCadastro"
                label="Data de cadastro"
                slotProps={{
                  textField: {
                    error: !!formErrors.dataCadastro,
                    helperText: formErrors.dataCadastro ?? ' ',
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon/>}
          onClick={handleBack}
        >
          Voltar
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
        >
          {submitButtonLabel}
        </Button>
      </Stack>
    </Box>
  );
}
