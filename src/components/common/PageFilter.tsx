'use client'
import {materialCells, materialRenderers,} from '@jsonforms/material-renderers';
import {JsonForms} from '@jsonforms/react';
import {useState} from 'react';
import {JsonSchema, UISchemaElement} from "@jsonforms/core";
import {ErrorBoundary} from "./ErrorBoundary";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {deepmerge} from '@mui/utils';
import {ThemeOptions} from "@mui/system";
import {usePathname, useSearchParams} from "next/navigation";


export const PageFilter = ({schema, uiSchema, initialData}: {
  schema: JsonSchema;
  uiSchema: UISchemaElement;
  initialData: unknown;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
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
          schema={schema}
          uischema={uiSchema}
          data={searchParams}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({data, errors}) => {

            console.log(data);
            const nextSearchParams = new URLSearchParams(data);
            console.log(nextSearchParams.toString());
            //nextSearchParams.set('page', `${item.page || 1}`);
            const nextUrl = `${pathname}?${nextSearchParams.toString()}`

          }}
        />
      </ThemeProvider>
    </ErrorBoundary>

  );
}
