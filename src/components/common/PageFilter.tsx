'use client'
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {ErrorBoundary} from "./ErrorBoundary";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {deepmerge} from '@mui/utils';
import {ThemeOptions} from "@mui/system";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useState} from 'react';
import {Button, Stack, SxProps} from '@mui/material';


export const PageFilter = ({layoutSchema, formSchema, initialData, sx}: {
  formSchema: JsonSchema;
  layoutSchema: UISchemaElement;
  initialData: unknown;
  sx?: SxProps;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  // const debounced = useDebounceCallback(setValue, 500);

  const handleSubmit = () => {
    const nextSearchParams = new URLSearchParams(form);
    const nextUrl = `${pathname}?${nextSearchParams.toString()}`;
    router.push(nextUrl);
  }

  // const data = useMemo(() => ({...searchParams}), [searchParams]);

  return (<Stack sx={sx} direction={'row'}>
      <ErrorBoundary fallback={<p>Upss... Niewłaściwe filtry</p>}>
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

          <Button onClick={handleSubmit}>
            Szukaj
          </Button>
        </ThemeProvider>
      </ErrorBoundary>
    </Stack>
  );
}
