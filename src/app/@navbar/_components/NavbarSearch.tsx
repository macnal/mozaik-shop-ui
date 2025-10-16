'use client'

import {Search} from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  debounce,
  IconButton,
  InputAdornment, ListItemAvatar,
  OutlinedInput,
  Stack,
  Typography
} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {useEffect, useMemo, useRef, useState,} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import NextLink from 'next/link';
import Link from "next/link";
import ImageTwoToneIcon from '@mui/icons-material/ImageTwoTone';
const handleFetch = async (searchParams: { query: string } | null = null) => {

  return await fetch(`/api/search${searchParams ? `?${
    new URLSearchParams({
      ...searchParams,
    })
  }` : ``}`)
    .then((res) => res.json())
    .then((data) => {
      return data.items as Option[];
    });
};

interface Option {
  id: number,
  name: string,
  categoryName: string,
  url: string,
  image: string
}

export const NavbarSearch = ({defaultValue}: {
  defaultValue?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [value, setValue] = useState<Option | string | null>(null);
  const lastSearchTimestampRef = useRef<number | null>(null);

  useEffect(() => {
    setInputValue(() => searchParams.get("query") || '');
  }, [searchParams]);

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

        if ((inputValue?.length || 0) >= 3) {
          void handleFetchDebounced({
            query: inputValue,
          });
        }


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

  const goToSearchPage = () => {
    router.push(`/szukaj?query=${inputValue}`);
  }

  return <Autocomplete
    open={open && !!options?.length}
    onOpen={() => {
      setOpen(true);
    }}
    onClose={() => {
      setOpen(false);
    }}
    inputValue={inputValue}
    onInputChange={(event, newValue: string, reason) => {
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
        return option?.name === value.name;
      }


    }}
    getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
    options={options}
    loading={loading}
    value={value}
    onChange={(event, newValue) => {
      if (typeof newValue === 'string') {

      } else if (newValue) {
        setValue(newValue.name);
        // router.push(`/`);
      } else {
        setValue(newValue);
      }
    }}
    onKeyDown={(event) => {
      if (event.key === "Enter") {
        goToSearchPage();
      }
    }}
    freeSolo
    renderOption={(props, option) => {
      const {key, ...optionProps} = props;
      return (
        <Stack component={'li'}
               key={key}

               {...optionProps}>
          <Stack
            component={NextLink}
            href={option.url}
            direction={'row'}

            // component="li"
            spacing={2}
            sx={{width: '100%', textDecoration: 'none', color: 'text.primary', alignItems: 'center'}}

          >
            <Avatar variant={"square"} src={option.image}>
              <ImageTwoToneIcon />
            </Avatar>

            <Stack sx={{overflow: 'hidden'}}>
              <Typography variant={'subtitle1'} whiteSpace={'nowrap'} sx={{textOverflow: 'hidden', overflow: 'hidden'}}>
                {option.name}
              </Typography>
              <Typography variant={'body2'} whiteSpace={'nowrap'} color={"textSecondary"}>
                {option.categoryName}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      );
    }}
    filterOptions={(x) => x}
    sx={{flexBasis: 400,}}
    renderInput={({InputProps, InputLabelProps, ...params}) => (
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
          <IconButton edge={'end'} color={'primary'} onClick={goToSearchPage}>
            <ArrowForwardIcon/>
          </IconButton>
        </InputAdornment>}
        placeholder={"Szukaj..."}
      />)}

  />


}
