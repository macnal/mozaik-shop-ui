import React, {PropsWithChildren, useMemo} from "react";
import {Generate} from "@jsonforms/core";
import {JsonFormsStateProvider} from "@jsonforms/react";
import {JsonFormsDispatch, JsonFormsInitStateProps, JsonFormsReactProps} from "@jsonforms/react";

export const CustomJsonFormsDispatch = JsonFormsDispatch

export const CustomJsonForms = (
  props: JsonFormsInitStateProps & JsonFormsReactProps & PropsWithChildren
) => {
  const {
    ajv,
    data,
    schema,
    uischema,
    renderers,
    cells,
    onChange,
    config,
    uischemas,
    readonly,
    validationMode,
    i18n,
    additionalErrors,
    middleware,
    children,
  } = props;
  const schemaToUse = useMemo(
    () => (schema !== undefined ? schema : Generate.jsonSchema(data)),
    [schema, data]
  );
  const uischemaToUse = useMemo(
    () =>
      typeof uischema === 'object'
        ? uischema
        : Generate.uiSchema(schemaToUse, undefined, undefined, schemaToUse),
    [uischema, schemaToUse]
  );

  return (
    <JsonFormsStateProvider
      initState={{
        core: {
          ajv,
          data,
          schema: schemaToUse,
          uischema: uischemaToUse,
          validationMode: validationMode,
          additionalErrors: additionalErrors,
        },
        config,
        uischemas,
        renderers,
        cells,
        readonly,
        i18n,
      }}
      onChange={onChange}
      middleware={middleware}
    >
      {children}
    </JsonFormsStateProvider>
  );
};
