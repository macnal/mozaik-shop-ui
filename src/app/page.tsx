import {PageContainer} from "@/components/PageContainer";
import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import config from "@/../public/config.json";

export default async function HomePage() {
  const dataSource = await WebLinkerService();
  // const res = await fetch(`${process.env.PUBLIC_URL}/config.json`);
  // const config = await res.json();

  const r = dataSource.fetchProducts({
    page: 0,
    size: config?.interface?.itemsPerPage || 10,
  });
  const items = await r.then(({items}) => items);
  const page = await r.then(({page}) => page);

  return (
    <PageContainer>
      <ItemsGrid items={items} pagination={null}/>

    </PageContainer>
  );
}
