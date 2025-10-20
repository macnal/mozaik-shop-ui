import {Stack, Typography} from "@mui/material";
import {WebLinkerService} from "@/services/weblinker";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';

interface TransactionStatusPageProps {
  params: Promise<{ orderId: string }>
}

export default async function TransactionStatusPage({params}: TransactionStatusPageProps) {
  const {orderId} = await params;
  const dataSource = await WebLinkerService();

  const fetchStatus = async () => {
    const {paymentStatus} = await dataSource.fetchOrderStatus(orderId);

    if (paymentStatus === 'PENDING') {
      return await fetchStatus();
    }

    return paymentStatus
  }


  const paymentStatus = await fetchStatus();


  if (paymentStatus === "FAILED" || paymentStatus === "CANCELLED") {
    return <Stack sx={{alignItems: 'center'}}>
      <HighlightOffTwoToneIcon sx={{fontSize: '8rem', color: 'error.light'}}/>

      <Typography sx={{fontSize: '3rem', fontWeight: 600}}>
        Upsss...
      </Typography>

      <Typography color={'textSecondary'}>
        Coś poszło nie tak
      </Typography>
    </Stack>
  }


  return (
    <Stack sx={{alignItems: 'center'}}>
      <CheckCircleOutlineIcon sx={{fontSize: '8rem', color: 'success.light'}}/>

      <Typography sx={{fontSize: '3rem', fontWeight: 600}}>
        Sukces!
      </Typography>

      <Typography color={'textSecondary'}>
        Dziękujemy za twoją płatność. Za chwilę zaczniemy pakować zamówienie.
      </Typography>
    </Stack>
  );
}
