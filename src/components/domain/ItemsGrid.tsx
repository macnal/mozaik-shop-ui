import {Grid, Skeleton} from "@mui/material";
import {getSlug} from "@/utils/slug";
import {ItemCard} from "@/components/domain/ItemCard";
import {Suspense} from "react";
import {ItemGridPagination} from "@/components/domain/ItemGridPagination";
import {PageMetadataSummary, WeblinkerProductSummary} from "@/api/gen/model";

const size = {xs: 5, md: 3, lg: 2};

interface ItemsGridProps {
  items: WeblinkerProductSummary[], //Promise<Game[]> |
  pagination: PageMetadataSummary | null, //Promise<ApiPageResponsePage> |
}

type ItemsGridInnerProps = Awaited<ItemsGridProps>

const ItemsGridInner = ({items, pagination: promisePagination}: ItemsGridInnerProps) => {
  const data = items; //use
  const pagination = promisePagination;

  return <>{data.map(x => {
    return <Grid key={getSlug(x)} size={size} sx={{display: "flex", flexDirection: "column"}}>
      <ItemCard item={x}/>
    </Grid>
  })}

    <Grid size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center', mt: 6}}>
      {pagination && <Suspense>
        <ItemGridPagination pagination={pagination}/>
      </Suspense>}

    </Grid>
  </>
}


export const ItemsGrid = ({items, pagination}: ItemsGridProps) => {


  return <Grid container spacing={{xs: 1, md: 2}} columns={10}><ItemsGridInner items={items} pagination={pagination}/>
    {/*<Suspense fallback={<>*/}
    {/*  {[1, 2, 3, 4, 5, 6, 7].map(x => <Grid key={x} size={size} sx={{display: "flex", flexDirection: "column"}}>*/}
    {/*    <Skeleton variant={'rectangular'} width={"100%"} height={339}/>*/}
    {/*  </Grid>)}*/}
    {/*</>}>*/}
    {/*  <ItemsGridInner items={items} pagination={pagination}/>*/}
    {/*</Suspense>*/}
  </Grid>
}

export const ItemsGridSkeleton = () => {
  return <Grid container spacing={2} columns={10}>
    {[1, 2, 3, 4, 5, 6, 7].map(x => <Grid key={x} size={size} sx={{display: "flex", flexDirection: "column"}}>
      <Skeleton variant={'rectangular'} width={"100%"} height={339}/>
    </Grid>)}
  </Grid>

}
