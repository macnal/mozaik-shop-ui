'use client'

import {Search} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  debounce,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useEffect, useMemo, useRef, useState,} from "react";
import {Game} from "@/types/responses";

const handleFetch = async (searchParams: any = null) => {

  return await fetch(`/api/search${searchParams ? `?${
    new URLSearchParams({
      ...searchParams,
      page: 0,
      size: 10
    })
  }` : ``}`)
    .then((res) => res.json())
    .then((data) => {
      return data.items as Game[];
    });
};

type Option = Game;

export const NavbarSearch = ({defaultValue}: {
  defaultValue?: string;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [value, setValue] = useState<Game | string | null>(null);
  const lastSearchTimestampRef = useRef<number | null>(null);


  const handleFetchDebounced = useMemo(() => {

    return debounce(({query}) => {
      setLoading(true);
      return handleFetch({
        query
      }).then((nextOptions) => {
        setOptions(() => nextOptions);
        setLoading(false);
      });

    }, 400)
  }, []);


  // const loading = open && options.length === 0;

  const handleInputChange = (nextValue: string) => {
    setInputValue(nextValue);
  };

  useEffect(() => {
    if (defaultValue) {

      (async () => {
        //if (fetchStrategyFn[fetchStrategy](inputValue)) {
        setLoading(true);
        //if (active) {
        const timestamp = +Date.now();
        if (!lastSearchTimestampRef?.current || timestamp > lastSearchTimestampRef.current) {
          lastSearchTimestampRef.current = timestamp;
        }

        const nextOptions = await handleFetchDebounced({
          query: inputValue,
        });

        // console.log('nextOptions effect', nextOptions);
        //
        // if (timestamp === lastSearchTimestampRef.current) {
        //     setOptions(() => nextOptions);
        //
        //     const target = nextOptions.find(({ label }) => label === defaultValue);
        //
        //     if (target) {
        //         setInputValue(() => target.label);
        //         setValue(() => target);
        //     }
        //
        //     setLoading(false);
        // }
      })();
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (open) {
        setLoading(true);

        const timestamp = +Date.now();
        if (!lastSearchTimestampRef?.current || timestamp > lastSearchTimestampRef.current) {
          lastSearchTimestampRef.current = timestamp;
        }

        void handleFetchDebounced({
          query: inputValue,
        });
        // console.log('nextOptions fetchStrategyFn', nextOptions);
        // if (timestamp === lastSearchTimestampRef.current) {
        //     setOptions(() => nextOptions);
        //     setLoading(false);
        // }

      }
    })();

  }, [open, inputValue]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return <Autocomplete
    open={open && !!options?.length}
    onOpen={() => {
      setOpen(true);
    }}
    onClose={() => {
      setOpen(false);
    }}
    inputValue={inputValue}
    onInputChange={(event: any, newValue: string, reason) => {
      handleInputChange(newValue);
    }}

    id={'search-box'}
    isOptionEqualToValue={(option, value) => {
      console.log({
        option,
        value,
      });
      if (typeof value === 'string' || (typeof option === 'string')) {
        return false;
      } else {
        return option?.label === value.label;
      }


    }}
    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
    options={options}
    loading={loading}
    value={value}
    onChange={(event: any, newValue: Option | string | null) => {
      if (typeof newValue === 'string') {

      } else if (newValue) {
        setValue(newValue.name);
        router.push(`/`);
      } else {
        setValue(newValue);
      }


    }}
    freeSolo
    renderOption={(props: any, option: any) => {
      const {key, ...optionProps} = props;
      return (
        <Stack
          direction={'row'}
          key={key}
          component="li"
          spacing={2}
          {...optionProps}
        >
          <Avatar variant={"rounded"} >
            AD
          </Avatar>

          <Stack>
            <Typography variant={'subtitle1'} whiteSpace={'nowrap'}>
              {option.name}
            </Typography>
          </Stack>
        </Stack>
      );
    }}
    filterOptions={(x) => x}
    sx={{flexBasis: 400,}}
    renderInput={({InputProps, ...params}) => (
      <OutlinedInput
        {...InputProps}
        {...params}
        size={'small'}
        sx={{
          bgcolor: 'background.paper',

          '.MuiInputAdornment-positionEnd': {
            opacity: 0,
            transition: 'opacity .3s'
          },

          '&:hover, &:focus, &:active, &.Mui-focused': {
            // "& fieldset": {
            //
            // },
            '.MuiInputAdornment-positionEnd': {
              opacity: 1,
              transition: 'opacity .3s'
            }
          }
        }}
        id="outlined-adornment-weight"
        startAdornment={<InputAdornment position="start">
          <Search/>
        </InputAdornment>}
        endAdornment={<InputAdornment position="end">
          <IconButton edge={'end'} color={'primary'}>
            <ArrowForwardIcon/>
          </IconButton>
        </InputAdornment>}
        placeholder={"Szukaj..."}
      />)}

  />


}
