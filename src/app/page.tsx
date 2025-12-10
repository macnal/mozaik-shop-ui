import {PageContainer} from "@/components/PageContainer";
import {WebLinkerService} from "@/services/weblinker";
import {ItemsGrid} from "@/components/domain/ItemsGrid";
import config from "@/../public/config.json";
import {WeblinkerProductSummary} from "@/api/gen/model";
import Box from "@mui/material/Box";
import {ItemPromocCard} from "@/components/domain/ItemPromoCard";

interface SearchPageProps {
    params: Promise<{ categorySlug: string }>,
    searchParams: Promise<{ page: string, size: string, query: string }>
}

export default async function HomePage({searchParams}: SearchPageProps) {
    const {page} = await searchParams;
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

    const found = items.find((p) => p.star === 3);
    const promo: WeblinkerProductSummary | undefined = found
        ? {...found,  tag: 'Produkt Tygodnia' } : undefined;


    return (
        <PageContainer>
            {promo && <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
                <Box width={'100%'} >
                    <ItemPromocCard item={promo} />
                </Box>
            </Box>}
            <ItemsGrid items={items} pagination={pagination}/>

        </PageContainer>
    );
}
