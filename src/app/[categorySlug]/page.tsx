import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import {notFound} from "next/navigation";
import config from "@/../public/config.json";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page: string, size: string }>
}

export default async function CategoryPage({params, searchParams}: CategoryPageProps) {
  const {page, size} = (await searchParams);
  const {categorySlug} = await params;

  const dataSource = WebLinkerService();
  const category = await dataSource.fetchCategory(categorySlug);

  if (!category) {
    throw notFound();
  }

  const r = dataSource.fetchProducts({
    page: isNaN(+page) ? 0 : +page,
    size: isNaN(+size) ? config.interface.itemsPerPage : +size,
  });
  const items = await r.then(({items}) => items);
  const pagination = await r.then(({page}) => page);


  return (
    <ItemsGrid items={items} pagination={pagination}/>
  );
}

