import {PageContainer} from "@/components/PageContainer";
import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import config from "@/../public/config.json";

interface SearchPageProps {
    params: Promise<{ categorySlug: string }>,
    searchParams: Promise<{ page: string, size: string, query: string }>
}

export default async function HomePage({params, searchParams}: SearchPageProps) {
    const {page, query} = await searchParams;
    const dataSource = await WebLinkerService();
    // const res = await fetch(`${process.env.PUBLIC_URL}/config.json`);
    // const config = await res.json();

    const r = dataSource.fetchProducts({
        page: isNaN(+page) ? 0 : +page,
        size: config.interface.itemsPerPage,
    });
    const items = await r.then(({items}) => items);
    /*
      const page = await r.then(({page}) => page);
    */
    const pagination = await r.then(({page}) => page);

    return (
        <PageContainer>
            <ItemsGrid items={items} pagination={pagination}/>

        </PageContainer>
    );
}
