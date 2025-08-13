import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
// @ts-ignore
import dayjs, { Dayjs } from 'dayjs';
import {Produto} from "../../server/produtosService";
import {Autocomplete} from "@mui/material";

export interface ProdutoFormState {
  values: Partial<Omit<Produto, 'id'>>;
  errors: Partial<Record<keyof ProdutoFormState['values'], string>>;
}

export type FormFieldValue = string | string[] | number | boolean | File | null;

export interface ProdutoFormProps {
  formState: ProdutoFormState;
  onFieldChange: (
    name: keyof ProdutoFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<ProdutoFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<ProdutoFormState['values']>) => void;
  submitButtonLabel: string;
  backButtonPath?: string;
}

export default function ProdutoForm(props: ProdutoFormProps) {
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
        event.target.name as keyof ProdutoFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleNumberFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof ProdutoFormState['values'],
        Number(event.target.value),
      );
    },
    [onFieldChange],
  );

  const handleCheckboxFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange(event.target.name as keyof ProdutoFormState['values'], checked);
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof ProdutoFormState['values']) => (value: Dayjs | null) => {
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
        event.target.name as keyof ProdutoFormState['values'],
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
    navigate(backButtonPath ?? '/produto');
  }, [navigate, backButtonPath]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: '100%' }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              value={formValues.descricao ?? ''}
              onChange={handleTextFieldChange}
              name="descricao"
              label="Descrição"
              error={!!formErrors.descricao}
              helperText={formErrors.descricao ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              type="number"
              value={formValues.ean ?? ''}
              onChange={handleNumberFieldChange}
              name="ean"
              label="Codigo de barras"
              error={!!formErrors.ean}
              helperText={formErrors.ean ?? ' '}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
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
          startIcon={<ArrowBackIcon />}
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
