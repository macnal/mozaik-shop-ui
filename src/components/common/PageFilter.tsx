'use client'
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {ErrorBoundary} from "./ErrorBoundary";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {deepmerge} from '@mui/utils';
import {ThemeOptions} from "@mui/system";
import {usePathname, useRouter} from "next/navigation";
import {useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, SxProps, useMediaQuery} from '@mui/material';
import FilterListTwoToneIcon from '@mui/icons-material/FilterListTwoTone';
import {Close} from '@mui/icons-material';

export const PageFilter = ({layoutSchema, formSchema, initialData, sx}: {
  formSchema: JsonSchema;
  layoutSchema: UISchemaElement;
  initialData: unknown;
  sx?: SxProps;
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const pathname = usePathname();
  // const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [isOpen, setOpen] = useState(false);
  // const debounced = useDebounceCallback(setValue, 500);

  const handleSubmit = () => {
    const nextSearchParams = new URLSearchParams(form);
    const nextUrl = `${pathname}?${nextSearchParams.toString()}`;
    router.push(nextUrl);
  }

  const formEl = <ErrorBoundary fallback={<p>Upss... Niewłaściwe filtry</p>}>
    <ThemeProvider theme={theme => createTheme(deepmerge(theme, {
      components: {
        MuiFormControl: {
          defaultProps: {
            size: "small",
          }
        }
      }

    } as Omit<Partial<ThemeOptions>, "shadows">))}>

      <JsonForms
        schema={formSchema}
        uischema={layoutSchema}
        data={form}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({data, errors}) => {
          setForm(data);
        }}
      />
    </ThemeProvider>
  </ErrorBoundary>

  if (isMobile) {
    return <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<FilterListTwoToneIcon/>}
      >Filtruj</Button>

      <Dialog fullScreen open={isOpen} onClose={() => setOpen(false)}>
        <DialogTitle variant={'h1'} sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          Filtruj

          <IconButton onClick={() => setOpen(false)}>
            <Close/>
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {formEl}

          <Button
            onClick={() => {
              handleSubmit();
              setOpen(false);
            }}
            variant="contained"
            fullWidth
            sx={{mt: 3}}
          >
            Szukaj
          </Button>
        </DialogContent>
      </Dialog>
    </>
  }

  return (<Stack sx={sx} direction={'row'}>
      {formEl}

      <Button onClick={handleSubmit}>
        Szukaj
      </Button>
    </Stack>
  );
}
