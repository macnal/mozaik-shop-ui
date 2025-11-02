'use client';
import React, {createContext, useCallback, useContext, useState} from 'react';
import {Alert, AlertColor, Snackbar} from '@mui/material';

type NotificationContextType = {
    showNotification: (message: string, severity?: AlertColor, duration?: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({children}: {children: React.ReactNode}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');
    const [duration, setDuration] = useState<number | undefined>(4000);

    const showNotification = useCallback((msg: string, sev: AlertColor = 'info', dur: number = 4000) => {
        setMessage(msg);
        setSeverity(sev);
        setDuration(dur);
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const value = React.useMemo(() => ({showNotification}), [showNotification]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}>
                <Alert onClose={handleClose} severity={severity} sx={{width: '100%'}}>
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return ctx;
};
