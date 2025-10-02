import {Grid, Skeleton} from "@mui/material";
import {getSlug} from "@/utils/slug";
import {ItemCard} from "@/components/domain/ItemCard";
import {Suspense, use} from "react";
import {ApiPageResponsePage, Game} from "@/types/responses";
import {ItemGridPagination} from "@/components/domain/ItemGridPagination";

const size = {xs: 12, md: 3, lg: 2};

interface ItemsGridProps {
  items: Promise<Game[]>,
  pagination: Promise<ApiPageResponsePage>
}

type ItemsGridInnerProps = Awaited<ItemsGridProps>

const ItemsGridInner = ({items, pagination: promisePagination}: ItemsGridInnerProps) => {
  const data = use(items);
  const pagination = use(promisePagination);

  return <>{data.map(x => {
    return <Grid key={getSlug(x)} size={size} sx={{display: "flex", flexDirection: "column"}}>
      <ItemCard {...x} />
    </Grid>
  })}

    <Grid size={{xs: 12}} sx={{display: 'flex', justifyContent: 'center', mt: 6}}>
      <ItemGridPagination pagination={pagination}/>
    </Grid>
  </>
}


export const ItemsGrid = ({items, pagination}: ItemsGridProps) => {


  return <Grid container spacing={2} columns={10}>
    <Suspense fallback={<>
      {[1, 2, 3, 4, 5, 6, 7].map(x => <Grid key={x} size={size} sx={{display: "flex", flexDirection: "column"}}>
        <Skeleton variant={'rectangular'} width={"100%"} height={339}/>
      </Grid>)}
    </>}>
      <ItemsGridInner items={items} pagination={pagination}/>
    </Suspense>
  </Grid>
}
