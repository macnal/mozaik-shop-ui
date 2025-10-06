import {Skeleton, Typography} from "@mui/material";
import {PageContainer} from "@/components/PageContainer";
import {ItemsGridSkeleton} from "@/components/domain/ItemsGrid";


export default async function CategoryPageLoader() {


  return (
    <PageContainer>
      <Typography variant={'h1'} sx={{mb: 2}}>
        <Skeleton variant={"text"} width={200}/>
      </Typography>

      {/*<NoSsr>*/}
      {/*  <PageFilter schema={formSchema} uiSchema={layoutSchema} initialData={{}}/>*/}
      {/*</NoSsr>*/}

      {/*<CategoriesChips items={childCategories} sx={{mb: 6}}/>*/}

      <ItemsGridSkeleton/>
    </PageContainer>
  );
}

