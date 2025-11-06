"use client";

import React, {useEffect, useState} from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    // Logujemy błąd po stronie klienta, żeby trafił do konsoli (lub narzędzi monitoringowych)
    console.error("Unhandled error (global):", error);
  }, [error]);

  const handleRetry = () => {
    // Zablokuj przycisk natychmiast
    setIsReloading(true);

    // Przygotuj location (bez any)
    const g = globalThis as unknown;
    const loc = typeof g === "object" && g !== null && "location" in g ? (g as { location: Location }).location : undefined;

    // Daj Reactowi chwilę na wyrenderowanie overlay/zmian stylów zanim zrobimy reset/reload
    setTimeout(() => {
      try {
        reset();
      } catch (err) {

        console.warn("reset() threw:", err);
      }

      if (loc) {
        // Dodatkowe krótkie opóźnienie przed reload, aby UX był płynniejszy
        setTimeout(() => loc.reload(), 300);
      }
    }, 80);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{textAlign: "center", px: 3}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trwają prace serwisowe
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coś poszło nie tak. Pracujemy nad naprawą — spróbuj ponownie za chwilę.
        </Typography>

        <Box sx={{mt: 3}}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRetry}
            disabled={isReloading}
            aria-busy={isReloading}
            disableRipple={isReloading}
            disableElevation={isReloading}
            tabIndex={isReloading ? -1 : 0}
            sx={{
              opacity: isReloading ? 0.6 : 1,
              pointerEvents: isReloading ? "none" : "auto",
              cursor: isReloading ? "wait" : "pointer",
              filter: isReloading ? "grayscale(100%)" : "none",
              backgroundColor: isReloading ? "rgba(0,0,0,0.12) !important" : undefined,
              color: isReloading ? "rgba(0,0,0,0.38) !important" : undefined,
              boxShadow: isReloading ? "none !important" : undefined,
              borderColor: isReloading ? "transparent !important" : undefined,
              "&.Mui-disabled": {
                pointerEvents: "none",
                cursor: "wait",
                backgroundColor: "rgba(0,0,0,0.12) !important",
                color: "rgba(0,0,0,0.38) !important",
                opacity: 0.6,
                filter: "grayscale(100%)",
              },
            }}
          >
            {isReloading ? (
              <>
                <CircularProgress size={18} color="inherit" sx={{mr: 1}} />
                Trwa przeładowanie...
              </>
            ) : (
              "Spróbuj ponownie"
            )}
          </Button>
        </Box>
      </Box>

      {/* Overlay wyszarzający i blokujący cały ekran podczas reload */}
      {isReloading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            // ciemniejsze wyszarzenie, żeby cały ekran był wyraźnie przygaszony
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // bardzo wysoki z-index żeby przykryć wszystko
            zIndex: 2147483647,
            pointerEvents: "all",
          }}
        >
          <Box sx={{display: "flex", alignItems: "center", flexDirection: "column", gap: 2}}>
            <CircularProgress />
            <Typography variant="body1">Trwa przeładowanie...</Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
}
