import {ItemsGridSkeleton} from "@/components/domain/ItemsGrid";
import {PageContainer} from "@/components/PageContainer";
import {Grid, Skeleton, Typography} from "@mui/material";


export default function CategoryPageLoader() {


  return (<PageContainer>
      <Typography variant={'h1'} gutterBottom>
        <Skeleton variant={'text'} width={300} height={"100%"}/>
      </Typography>

      <Grid container spacing={2} sx={{mb: 6}}>
        <Grid>
          <Skeleton variant={'text'} width={70} />
          <Skeleton variant={'rounded'} width={200} height={40}/></Grid>
        <Grid>
          <Skeleton variant={'text'} width={60} />
          <Skeleton variant={'rounded'} width={200} height={40}/></Grid>
        <Grid>
          <Skeleton variant={'text'} width={90} />
          <Skeleton variant={'rounded'} width={200} height={40}/></Grid>
        <Grid>
          <Skeleton variant={'text'} width={80} />
          <Skeleton variant={'rounded'} width={200} height={40}/></Grid>
        <Grid>
          <Skeleton variant={'text'} width={60} />
          <Skeleton variant={'rounded'} width={200} height={40}/></Grid>
      </Grid>

      <ItemsGridSkeleton/>
    </PageContainer>
  );
}

