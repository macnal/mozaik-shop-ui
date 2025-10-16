import React, {useState} from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import InpostGeowidget, {InpostGeowidgetProps} from '@majlxrd/inpost-geowidget-next';
import {Stack} from '@mui/material';



interface InpostPoint {
  pointId: number;
  name: string;
  address_details: {
    street: string;
    city: string;
  }
}

export default function KoszykPageSummaryInpost() {
  const [selectedPoint, setSelectedPoint] = useState<InpostPoint | null>(null);

  const handlePointSelect: InpostGeowidgetProps['onPointSelect'] = (point: InpostPoint) => {
    console.log("Parcel locker selected:", point);
    setSelectedPoint(point);
  };

  const handleApiReady: InpostGeowidgetProps['onApiReady'] = (api: string) => {
    console.log("GeoWidget API is ready:", api);
    // You can now use the API, for example: api.openMap();
  };

  return (
    <Stack>
      <div style={{width: '100%', height: '700px'}}>
        <InpostGeowidget
          token={process.env.NEXT_PUBLIC_INPOST_TOKEN}
          sandbox={true} // Use true for testing, false for production
          onPointSelect={handlePointSelect}
          onApiReady={handleApiReady}
        />
      </div>

      {selectedPoint && (
        <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0'}}>
          <h3>Selected Point Details:</h3>
          <p><strong>Name:</strong> {selectedPoint.name}</p>
          <p>
            <strong>Address:</strong> {`${selectedPoint.address_details.street}, ${selectedPoint.address_details.city}`}
          </p>
        </div>
      )}
    </Stack>

  );
}
