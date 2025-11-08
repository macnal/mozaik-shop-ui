import {PageContainer} from "@/components/PageContainer";
import {Typography, Button, Stack} from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <PageContainer>
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{py: 8}}>
        <Typography variant="h3" component="h1">404</Typography>
        <Typography variant="h5">Nie znaleziono strony</Typography>
        <Typography color="text.secondary" align="center" sx={{maxWidth: 600}}>
          Strona, której szukasz, nie istnieje lub została przeniesiona. Sprawdź adres URL lub wróć do strony głównej.
        </Typography>
        <Button component={Link} href="/" variant="contained">
          Powrót do strony głównej
        </Button>
      </Stack>
    </PageContainer>
  );
}
