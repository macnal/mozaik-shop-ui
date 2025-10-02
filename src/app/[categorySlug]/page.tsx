import {Typography} from "@mui/material";
import {PageContainer} from "@/components/PageContainer";
import {WebLinkerService} from "@/services/weblinker";
import {splitSlug} from "@/utils/slug";
import {CategoriesChips} from "@/components/domain/CategoriesChips";
import {ItemsGrid} from "@/components/domain/ItemsGrid";

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

  const r = dataSource.fetchProducts({
    page: isNaN(+page) ? 0 : +page,
    size: isNaN(+size) ? 10 : +size,
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

      <CategoriesChips items={childCategories} sx={{mb: 6}}/>

      <ItemsGrid items={items} pagination={pagination}/>
    </PageContainer>
  );
}

