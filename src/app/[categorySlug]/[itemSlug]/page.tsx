import {Grid, Stack, Typography} from "@mui/material";
import {PageContainer} from "@/components/PageContainer";
import {Breadcrumb} from "@/types/client";
import {formatMoney} from "@/utils/money";
import {Gallery} from "@/components/domain/Gallery";
import {WebLinkerService} from "@/services/weblinker";
import {getSlug, splitSlug} from "@/utils/slug";
import ReactMarkdown from "react-markdown";
import {notFound} from "next/navigation";
import {AddToCartButton} from "./AddToCartButton";
import {Metadata} from "next";
import {getCategoryById} from "@/data/categories";
import {WeblinkerProductDetail} from "@/api/gen/model";

interface ItemPageProps {
    params: Promise<{ itemSlug: string, categorySlug: string }>
}

export async function generateMetadata(
    {params}: ItemPageProps
): Promise<Metadata> {
    const {itemSlug} = await params;
    const {categorySlug} = await params;
    const itemSlugName = itemSlug.replace('-', ' ')
    const categorySlugName = categorySlug.replace('-', ' ')

    return {
        title: {default: `${itemSlugName} | ${categorySlugName}`, template: `%s | ${itemSlugName} | ${categorySlugName}`},
        openGraph: {
            url: `${process.env.PUBLIC_URL}/${categorySlug}/${itemSlug}`,
            title: itemSlugName,
        },
    }
}

export default async function ItemPage({params}: ItemPageProps) {
    const {itemSlug} = await params;
    const [id] = splitSlug(itemSlug);

    let item: WeblinkerProductDetail | undefined;

    try {
        const dataSource = await WebLinkerService();
        const result = await dataSource.fetchProduct(id);
        item = result?.item;
    } catch (error) {
        console.error("ItemPage: failed to fetch product", error);
        notFound();
    }

    if (!item) {
        notFound();
    }

    const category = getCategoryById(item.categoryId);

    if (!category) {
        notFound();
    }

    const breadcrumbs: Breadcrumb[] = [
        {
            href: `/${getSlug(category)}`,
            label: category.name,
        },
        {
            href: `/${getSlug(category)}/${getSlug(item)}`,
            label: item.name
        },
    ];

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <Grid container spacing={4}>
                <Grid size={{md: 6}}>
                    <Gallery items={item.images}/>
                </Grid>


                <Grid size={{md: 6}}>
                    <Stack>
                        <Typography>
                            {item.name}
                        </Typography>
                        <Typography>
                            {/*{item.subtitle}*/}
                        </Typography>
                    </Stack>

                    <Stack>
                        {/*{*/}
                        {/*  item.prev_price*/}
                        {/*    ? <Typography component={'span'}>*/}
                        {/*      <Typography variant="h5" component={'span'}>*/}
                        {/*        {formatMoney(item.price)}*/}
                        {/*      </Typography>*/}

                        {/*      <Typography variant="h5" component={'span'} sx={{textDecoration: 'line-through'}}>*/}
                        {/*        {formatMoney(item.prev_price)}*/}
                        {/*      </Typography>*/}
                        {/*    </Typography>*/}
                        {/*    : <Typography variant="h5" component={'span'}>*/}
                        {/*      {formatMoney(item.price)}*/}
                        {/*    </Typography>*/}

                        {/*}*/}

                        <Typography variant="h5" component={'span'}>
                            {formatMoney(item.price)} zł
                        </Typography>
                    </Stack>

                    <Stack>
                        <AddToCartButton item={item}/>
                    </Stack>

                    <Stack>
                        <ReactMarkdown>{item.description}</ReactMarkdown>
                    </Stack>
                </Grid>


            </Grid>
        </PageContainer>


    );
}
