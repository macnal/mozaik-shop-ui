'use client';

import {CheckboxElement, useFormContext} from 'react-hook-form-mui'
import {useEffect, useRef} from "react";
import {Box, Button, Link, Stack, Typography} from "@mui/material";
import NextLink from "next/link";
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';


export const KoszykSubmitButton = () => {
    const {trigger, formState: {isSubmitted, isValid, isSubmitting}, watch,} = useFormContext()
    const wantInvoice = watch('wantInvoice');
    const acceptedTerms = watch('acceptedTerms');
    const init = useRef(true);

    useEffect(() => {
        // trigger validation on subsequent changes of dependent toggles
        if (init.current) {
            init.current = false;
            return;
        }

        void trigger();

    }, [wantInvoice, acceptedTerms, trigger]);

    const disabled = isSubmitting || (isSubmitted && !isValid) || !acceptedTerms;

    return <>
        <Button
            loading={isSubmitting}
            disabled={disabled}
            type={"submit"}
            variant={'contained'}
            size={'large'}
            fullWidth
            color={'success'}
            startIcon={<LockTwoToneIcon/>}
        >
            Bezpieczna płatność
        </Button>

        {disabled && (
            <Typography variant="body2" color="error" sx={{mt: 1}}>
                Wypełnij wymagane informacje dotyczące sposobu dostawy i danych klienta.
            </Typography>
        )}

        <Box sx={{mt: 1}}>
            <CheckboxElement name={'acceptedTerms'} label={'Akceptuję regulamin (obowiązkowe)'} />
            <Stack direction={'row'} spacing={2}>
                <Link component={NextLink} href={'/strony/regulamin'}>Regulamin</Link>
                <Link component={NextLink} href={'/strony/polityka-prywatnosci'}>Polityka
                    prywatności</Link>
            </Stack>
        </Box>
    </>
}
