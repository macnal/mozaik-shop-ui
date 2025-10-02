import {PageContainer} from "@/components/PageContainer";
import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";

export default async function HomePage() {
  const dataSource = WebLinkerService();

  const r = dataSource.fetchProducts({
    page: 0,
    size: 10,
  });
  const items = r.then(({items}) => items);
  const page = r.then(({page}) => page);

  return (
    <PageContainer>
      <ItemsGrid items={items} pagination={page}/>

    </PageContainer>
  );
}
