import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import config from "@/../public/config.json";
import {PageContainer} from "@/components/PageContainer";
import {Stack, Typography} from "@mui/material";

interface SearchPageProps {
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page: string, size: string, query: string }>
}

export default async function SearchPage({params, searchParams}: SearchPageProps) {
  const {page, query} = await searchParams;
  const dataSource = WebLinkerService();
  //const {categorySlug} = await params;

  //const category = await dataSource.fetchCategory(categorySlug);
  //const {formSchema, layoutSchema} = await dataSource.fetchCategoryFormSchema(category.id);

  const r = dataSource.fetchProducts({
    page: isNaN(+page) ? 0 : +page,
    size: config.interface.itemsPerPage,
    //category: category.id,
    query
  });

  const items = await r.then(({items}) => items);
  const pagination = await r.then(({page}) => page);

  // const {items: childCategories} = await dataSource.fetchCategories({
  //   parentId: category.id,
  // });

  return (<PageContainer>
      <Typography variant={'h1'} gutterBottom>
        Wyszukiwanie
      </Typography>

      <Stack sx={{mb:6}}>

      <span>
        <Typography variant='subtitle2'>Fraza:</Typography>
        <Typography variant={'body2'}>{query}</Typography>
      </span>
      </Stack>


      {/*<NoSsr>*/}
      {/*  <PageFilter*/}
      {/*    formSchema={formSchema}*/}
      {/*    layoutSchema={layoutSchema}*/}
      {/*    initialData={await searchParams}*/}
      {/*    sx={{mb: 6}}*/}
      {/*  />*/}
      {/*</NoSsr>*/}

      <ItemsGrid items={items} pagination={pagination}/>
    </PageContainer>
  );
}

