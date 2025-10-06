import {NoSsr, Typography} from "@mui/material";
import {PageContainer} from "@/components/PageContainer";
import {WebLinkerService} from "@/services/weblinker";
import {splitSlug} from "@/utils/slug";
import {CategoriesChips} from "@/components/domain/CategoriesChips";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import {notFound} from "next/navigation";
import {PageFilter} from "@/components/common/PageFilter";
import config from "@/../public/config.json";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page: string, size: string }>
}

export default async function CategoryPage({params, searchParams}: CategoryPageProps) {
  const {page, size} = (await searchParams);
  const {categorySlug} = await params;
  const [id] = splitSlug(categorySlug);

  const dataSource = WebLinkerService();
  const {item: category} = await dataSource.fetchCategory(id);

  //const res = await fetch(`${process.env.PUBLIC_URL}/config.json`);
  //const config = await res.json();


  if (!category) {
    throw notFound();
  }

  const {formSchema, layoutSchema} = await dataSource.fetchCategoryFormSchema(id);
  console.log([formSchema, layoutSchema]);

  const r = dataSource.fetchProducts({
    page: isNaN(+page) ? 0 : +page,
    size: isNaN(+size) ? config.interface.itemsPerPage : +size,
  });
  const items = await r.then(({items}) => items);
  const pagination = await r.then(({page}) => page);

  const {items: childCategories} = await dataSource.fetchCategories({
    parentIds: [id],
  });

  return (
    <PageContainer>
      <Typography variant={'h1'} sx={{mb: 2}}>
        {category.name}
      </Typography>

      <NoSsr>
        <PageFilter schema={formSchema} uiSchema={layoutSchema} initialData={{}}/>
      </NoSsr>

      <CategoriesChips items={childCategories} sx={{mb: 6}}/>

      <ItemsGrid items={items} pagination={pagination}/>
    </PageContainer>
  );
}

