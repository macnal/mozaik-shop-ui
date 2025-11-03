"use client"

import React, {useEffect, useRef, useState} from 'react';
import {CircularProgress, Stack, Typography} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

interface Props {
    orderId: string;
    pollIntervalMs?: number;
    maxAttempts?: number;
}

type PaymentStatus = string | undefined;

export default function PaymentStatusClient({orderId, pollIntervalMs = 3000, maxAttempts = 30}: Props) {
    const attemptsRef = useRef(0);
    const [attemptsState, setAttemptsState] = useState(0); // for rendering
    const [status, setStatus] = useState<PaymentStatus>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let cancelled = false;

        const scheduleNext = (fn: () => void, ms: number) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(fn, ms);
        }

        const doFetch = async () => {
            try {
                const res = await fetch(`/api/order/${orderId}`);
                if (!res.ok) {
                    setError(`HTTP ${res.status}`);
                    setLoading(false);
                    return;
                }
                const json = await res.json();
                if (cancelled) return;

                setStatus(json.paymentStatus);
                setLoading(false);

                if (json.paymentStatus === 'PENDING') {
                    attemptsRef.current += 1;
                    setAttemptsState(attemptsRef.current);

                    if (attemptsRef.current < maxAttempts) {
                        scheduleNext(doFetch, pollIntervalMs);
                    }
                }
            } catch (err: unknown) {
                if (cancelled) return;
                setError(String(err));
                setLoading(false);
            }
        }

        attemptsRef.current = 0;
        setAttemptsState(0);
        setLoading(true);
        setError(null);
        doFetch();

        return () => {
            cancelled = true;
            if (timerRef.current) clearTimeout(timerRef.current);
        }
    }, [orderId, pollIntervalMs, maxAttempts]);

    if (error) {
        return (
            <Stack sx={{alignItems: 'center'}}>
                <HighlightOffTwoToneIcon sx={{fontSize: '5rem', color: 'error.light'}}/>
                <Typography sx={{fontSize: '2rem', fontWeight: 600}}>Upsss...</Typography>
                <Typography color={'textSecondary'}>Coś poszło nie tak. Odśwież stronę.</Typography>
                <Typography color={'textSecondary'}>
                    Jeżeli problem będzie się powtarzał skontaktuj się z nami.
                </Typography>
                <Typography color={'textSecondary'}>Numer zamówienia: {orderId}</Typography>
            </Stack>
        )
    }

    if (loading || status === 'PENDING') {
        return (
            <Stack sx={{alignItems: 'center'}}>
                <CircularProgress sx={{mb: 2}}/>
                <Typography sx={{fontSize: '1.25rem', fontWeight: 600}}>Oczekiwanie na płatność.</Typography>
                <Typography color={'textSecondary'}>Próba: {attemptsState}</Typography>
            </Stack>
        )
    }

    if (status === 'FAILED' || status === 'CANCELLED') {
        return (
            <Stack sx={{alignItems: 'center'}}>
                <HighlightOffTwoToneIcon sx={{fontSize: '5rem', color: 'error.light'}}/>
                <Typography sx={{fontSize: '2rem', fontWeight: 600}}>Upsss...</Typography>
                <Typography color={'textSecondary'}>Coś poszło nie tak. Odśwież stronę.</Typography>
                <Typography color={'textSecondary'}>
                    Jeżeli problem będzie się powtarzał skontaktuj się z nami.
                </Typography>
                <Typography color={'textSecondary'}>Numer zamówienia: {orderId}</Typography>
            </Stack>
        )
    }

    return (
        <Stack sx={{alignItems: 'center'}}>
            <CheckCircleOutlineIcon sx={{fontSize: '5rem', color: 'success.light'}}/>
            <Typography sx={{fontSize: '2rem', fontWeight: 600}}>Sukces!</Typography>
            <Typography color={'textSecondary'}>Dziękujemy za twoją płatność.</Typography>
            <Typography color={'textSecondary'}>Za chwilę zaczniemy pakować zamówienie.</Typography>
            <Typography color={'textSecondary'}>Numer zamówienia: {orderId}</Typography>
        </Stack>
    )
}
