import {Button, Grid, Stack, Typography} from "@mui/material";
import {PageContainer} from "@/components/PageContainer";
import {Breadcrumb} from "@/types/client";
import {formatMoney} from "@/utils/money";
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import {Gallery} from "@/components/domain/Gallery";
import {WebLinkerService} from "@/services/weblinker";
import {getSlug, splitSlug} from "@/utils/slug";
import ReactMarkdown from "react-markdown";

interface ItemPageProps {
  params: Promise<{ itemSlug: string, categorySlug: string }>
}

export default async function ItemPage({params}: ItemPageProps) {
  const {itemSlug} = await params;
  const [id] = splitSlug(itemSlug);

  const dataSource = WebLinkerService();
  const {item} = await dataSource.fetchProduct(id);

  const {items: categories} = await dataSource.fetchCategories({parentIds: [5052433]});
  const {item: category} = await dataSource.fetchCategory(5052433);

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
            <Button variant={'contained'} size={'large'} startIcon={<ShoppingCartTwoToneIcon/>}
                    disabled={item.stock === 0}>
              Dodaj do koszyka
            </Button>
          </Stack>

          <Stack>
            <ReactMarkdown>{item.description}</ReactMarkdown>
          </Stack>
        </Grid>


      </Grid>
    </PageContainer>


  );
}
