import {FormControlLabel, FormControlLabelProps, Radio, RadioGroup, Stack, SxProps, Typography} from "@mui/material"
import {ReactNode} from "react";
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import PersonTwoToneIcon from '@mui/icons-material/PersonTwoTone';
import {ReactComponentLike} from "prop-types";
import {mergeSx} from "@/utils/sx";
import {useRadioGroup} from '@mui/material/RadioGroup';
import KoszykPageSummaryShippingInpost from "@/app/koszyk/KoszykPageSummaryShippingInpost";
import {useController} from "react-hook-form";

export type ShippingType = "INPOST" | "HOME" | "PERSONAL_PICKUP"


const RadioBtn = ({label, Icon, sx, ...props}: Partial<FormControlLabelProps> & {
  label: ReactNode,
  Icon: ReactComponentLike,
  sx?: SxProps
}) => {
  const {value: selectedValue} = useRadioGroup() || {};
  const isSelected = selectedValue === props.value;

  return <FormControlLabel
    {...props}

    sx={[
      {
        border: `1px solid`,
        borderColor: 'divider',
        p: `8px`,
      },
      isSelected && {
        borderColor: 'primary.main',
        p: `7px`,
        borderWidth: 2
      },
      {

        mr: 0,
        ml: 0,
        borderRadius: 2,
      },
      ...mergeSx(sx)
    ]}
    control={<Radio
      edge={false}
      sx={{
        mr: 1
      }}
    />}
    label={<Stack direction={'row'} spacing={1.5} sx={{alignItems: 'center'}}>
      <Icon sx={[isSelected ? {color: 'inherit'} : {color: 'action.active'}]} fontSize={'large'}/> <Typography
      variant={'subtitle1'}>
      {label}
    </Typography>
    </Stack>}/>
}


export const KoszykPageSummaryShipping = () => {
  // const [value, setValue] = useState<ShippingType>("INPOST");
  const {field: {value, onChange, onBlur}, fieldState: {error}} = useController({name: 'shippingMethod'})

  return <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    value={value || null}
    onChange={(event, nextValue) => {
      onChange(nextValue as ShippingType);
      onBlur();
    }}

    sx={{gap: 1}}
  >
    <RadioBtn
      Icon={Inventory2TwoToneIcon}
      label={'Paczkomat'}
      value={'INPOST'}
    />

    {value === "INPOST" && (
      <KoszykPageSummaryShippingInpost/>
    )}

    <RadioBtn
      Icon={LocalShippingTwoToneIcon}
      label={'Dostawa na adres'}
      value={'HOME'}
    />
    {value === "HOME" && (<Stack
      direction={'row'}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',

        pl: `${42 + 16}px`,
        pt: 1,
        pb: 3
      }}
    >
      <Typography color={'textSecondary'}>
        Zamówienie zostanie wysłane na podany wyżej adres.
      </Typography>
    </Stack>)}


    <RadioBtn
      Icon={PersonTwoToneIcon}
      label={'Odbiór osobisty'}
      value={'PERSONAL_PICKUP'}
    />

    {value === "PERSONAL_PICKUP" && (
      <Stack
        direction={'row'}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',

          pl: `${42 + 16}px`,
          pt: 1,
          pb: 3
        }}
      >
        <Typography color={'textSecondary'}>
          Zapraszamy do odbioru w naszym sklepie stacjonarnym: <strong>Kraków, ul. Długa 10</strong>
        </Typography>
      </Stack>
    )}

    {error && <Typography color={'error'}>
      {error.message}
    </Typography>}
  </RadioGroup>
}
// <KoszykPageSummaryInpost/>
