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
import {Metadata, ResolvingMetadata} from "next";

interface ItemPageProps {
  params: Promise<{ itemSlug: string, categorySlug: string }>
}

export async function generateMetadata(
  {params}: ItemPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const {itemSlug} = await params;
  const [id] = splitSlug(itemSlug);

  const dataSource = await WebLinkerService();
  const {item} = await dataSource.fetchProduct(id);
  const category = await dataSource.fetchCategoryById(item.categoryId);

  return {
    title: { default: `${item.name} | ${category.name}`, template: `%s | ${item.name} | ${category.name}` },
    description: item.shortDescription,
    openGraph: {
      url: `${process.env.PUBLIC_URL}//${getSlug(category)}/${getSlug(item)}`,
      images: [item.image],
      title: item.name,
      description: item.shortDescription,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...item?.openGraph,
    },
  }
}

export default async function ItemPage({params}: ItemPageProps) {
  const {itemSlug} = await params;
  const [id] = splitSlug(itemSlug);

  const dataSource = await WebLinkerService();
  const {item} = await dataSource.fetchProduct(id);

  if (!item) {
    throw notFound();
  }

  const category = await dataSource.fetchCategoryById(item.categoryId);

  if (!category) {
    throw notFound();
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
              {formatMoney(item.price)}
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
