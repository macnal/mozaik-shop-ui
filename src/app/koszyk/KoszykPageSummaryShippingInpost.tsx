import React, {useEffect, useState} from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import InpostGeowidget, {InpostGeowidgetProps} from '@majlxrd/inpost-geowidget-next';
import {Button, Dialog, DialogTitle, IconButton, Stack, Typography} from '@mui/material';
import {Close} from '@mui/icons-material';
import {useController} from 'react-hook-form';


interface InpostPoint {
  pointId: number;
  name: string;
  address_details: {
    street: string;
    city: string;
  }
}

export default function KoszykPageSummaryShippingInpost() {
  const [open, setOpen] = React.useState(false);
  const {field: {value, onChange, onBlur}, fieldState: {error}} = useController({name: 'inpostMachineCode'})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedPoint, setSelectedPoint] = useState<InpostPoint | null>(null);

  useEffect(() => {
    onChange(selectedPoint?.pointId);
    onBlur();

    return () => {
      onBlur();
      onChange('');
    }
  }, [selectedPoint?.pointId])



  const handlePointSelect: InpostGeowidgetProps['onPointSelect'] = (point: InpostPoint) => {
    console.log("Parcel locker selected:", point);
    setSelectedPoint(point);
    setOpen(false);
  };

  const handleApiReady: InpostGeowidgetProps['onApiReady'] = (api: InpostGeowidget) => {
   
    // You can now use the API, for example: api.openMap();
  };

  return (<>
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
        {selectedPoint ? <Stack>
            <Typography>
              Wybrany punkt:
            </Typography>
            <strong>{selectedPoint.pointId} - {selectedPoint.name}</strong>
            <p>
              <strong>Adres:</strong> {`${selectedPoint.address_details.street}, ${selectedPoint.address_details.city}`}
            </p>
          </Stack>
          : <Stack>
            <Typography color={error ? 'error' : 'textSecondary'}>
              {error ? 'Musisz wybrać paczkomat!' : 'Wybierz swój paczkomat'}
            </Typography>
          </Stack>}

        <Button
          variant={'outlined'}
          onClick={handleClickOpen}
          color={error && "error" }
        >
          Wybierz paczkomat
        </Button>
      </Stack>

      <Dialog
        open={open}
        fullWidth
        fullScreen
        onClose={handleClose}
      >
        <DialogTitle
          sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
        >
          <Typography variant={'inherit'}>
            Wybierz paczkomat
          </Typography>

          <IconButton
            size={'large'}
            sx={{}}
            onClick={() => {
              setOpen(false);
            }}>
            <Close fontSize={'large'}/>
          </IconButton>
        </DialogTitle>
        <div style={{width: '100%', height: '100%', flexGrow: 1}}>
          <InpostGeowidget
            identifier={'summary'}
            token={process.env.NEXT_PUBLIC_INPOST_TOKEN}
            sandbox={false} // Use true for testing, false for production
            onPointSelect={handlePointSelect}
            onApiReady={handleApiReady}
          />
        </div>
      </Dialog>


    </>

  );
}
