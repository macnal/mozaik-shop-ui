import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import config from "@/../public/config.json";
import {PageContainer} from "@/components/PageContainer";
import {Typography} from "@mui/material";
import {Metadata, ResolvingMetadata} from "next";
import {getCategoryBySlug} from "@/data/categories";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page: string, size: string, query: string }>
}

export async function generateMetadata(
  {params}: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const dataSource = await WebLinkerService();
  const {categorySlug} = await params;
  const category = getCategoryBySlug(categorySlug);

  return {
    title: { default: `${category.name}`, template: `%s | ${category.name}` },
    openGraph: {

    },
  }
}

export default async function CategoryPage({params, searchParams}: CategoryPageProps) {
  const {page, query, ...restParams} = await searchParams;
  const dataSource = await WebLinkerService();
  const {categorySlug} = await params;

  const category = getCategoryBySlug(categorySlug);
  // const {formSchema, layoutSchema} = await dataSource.fetchCategoryFormSchema(category.id);
  // const zodSchema = convertJsonSchemaToZod(formSchema as JSONSchema.BaseSchema) as ZodType<Record<string, string | string[]>>
  // const {data, error} = zodSchema.safeParse(restParams);

  const r = dataSource.fetchProducts({
    page: isNaN(+page) ? 0 : +page,
    size: config.interface.itemsPerPage,
    category: category.id,
    query,
    // ...data,
  });

  const items = await r.then(({items}) => items);
  const pagination = await r.then(({page}) => page);

  return (<PageContainer>
      <Typography variant={'h1'} gutterBottom>
        {category.name}
      </Typography>

      {/*<Stack direction={'row'} sx={{*/}
      {/*  display: 'flex',*/}
      {/*  justifyContent: {*/}
      {/*    xs: 'flex-end',*/}
      {/*    md: 'flex-start'*/}
      {/*  },*/}
      {/*  mb: {*/}
      {/*    xs: 2,*/}
      {/*    md: 6*/}
      {/*  }*/}
      {/*}}>*/}
      {/*  <NoSsr>*/}
      {/*    <PageFilter*/}
      {/*      formSchema={formSchema}*/}
      {/*      layoutSchema={layoutSchema}*/}
      {/*      initialData={await searchParams}*/}
      {/*    />*/}
      {/*  </NoSsr>*/}
      {/*</Stack>*/}


      <ItemsGrid items={items} pagination={pagination}/>
    </PageContainer>
  );
}

