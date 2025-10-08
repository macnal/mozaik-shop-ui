import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import config from "@/../public/config.json";
import {PageContainer} from "@/components/PageContainer";
import {NoSsr, Typography} from "@mui/material";
import {PageFilter} from "@/components/common/PageFilter";
import {convertJsonSchemaToZod} from 'zod-from-json-schema';
import {ZodType} from "zod";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page: string, size: string, query: string }>
}

export default async function CategoryPage({params, searchParams}: CategoryPageProps) {
  const {page, query, ...restParams} = await searchParams;
  const dataSource = WebLinkerService();
  const {categorySlug} = await params;

  const category = await dataSource.fetchCategory(categorySlug);
  const {formSchema, layoutSchema} = await dataSource.fetchCategoryFormSchema(category.id);
  const zodSchema = convertJsonSchemaToZod(formSchema) as ZodType<Record<string, string | string[]>>

  const {data, error} = zodSchema.safeParse(restParams);
  console.log({
    data,
    error
  });

  const r = dataSource.fetchProducts({
    page: isNaN(+page) ? 0 : +page,
    size: config.interface.itemsPerPage,
    category: category.id,
    query,
    ...data,
  });

  const items = await r.then(({items}) => items);
  const pagination = await r.then(({page}) => page);

  // const {items: childCategories} = await dataSource.fetchCategories({
  //   parentId: category.id,
  // });

  return (<PageContainer>
      <Typography variant={'h1'} gutterBottom>
        {category.name}
      </Typography>

      <NoSsr>
        <PageFilter
          formSchema={formSchema}
          layoutSchema={layoutSchema}
          initialData={await searchParams}
          sx={{mb: 6}}
        />
      </NoSsr>

      <ItemsGrid items={items} pagination={pagination}/>
    </PageContainer>
  );
}

