import {Stack} from "@mui/material";
import PaymentStatusClient from './PaymentStatusClient';

interface TransactionStatusPageProps {
    readonly params: Promise<{ orderId: string }>
}

export default async function TransactionStatusPage({params}: TransactionStatusPageProps) {
    const {orderId} = await params;

    return (
        <Stack sx={{alignItems: 'center'}}>
            <PaymentStatusClient orderId={orderId} />
        </Stack>
    )
}
