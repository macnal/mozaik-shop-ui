import {Card, CardActionArea, CardContent, Chip, Stack, Typography, Box} from "@mui/material";
import {blue, orange, purple, red, yellow} from "@mui/material/colors";
import Image from "next/image";
import Link from "next/link";
import {AspectRatio} from "@/components/common/AspectRatio";
import {ItemCardAddToCart} from "@/components/domain/ItemCardAddToCart";
import {formatMoney} from "@/utils/money";
import {getAppConfig} from "@/app.config";
import {WeblinkerProductSummary} from "@/api/gen/model";
import {getCategoryById} from "@/data/categories";

const colors = {
    orange,
    blue,
    red,
    purple,
    yellow
}

export const ItemPromocCard = async ({
                                         item
                                     }: { item: WeblinkerProductSummary }) => {
    const {
        image,
        name,
        slug,
        categoryId,
        tag,
        stock,
        star,
        id,
        price,
        minPrice30Days
    } = item;
    const mainImage = image;
    const {interface: {availableProductsMin}} = await getAppConfig();
    const category = getCategoryById(categoryId);
    const url = `/${category.slug}/${slug}`;

    const isAvailable = availableProductsMin < stock

    return <Card component={'article'} sx={{flexGrow: 1}}>
        <CardActionArea
            component={Link}
            href={url}
            data-prevent-progress={true}
            sx={{
                position: 'relative',
                height: '100%',

                // '.MuiFab-root': {
                //     opacity: 0,
                //     transition: 'opacity .3s'
                // },

                // '&:hover, &:focus, &:active': {
                //     '.MuiFab-root': {
                //         opacity: 1,
                //         transition: 'opacity .3s'
                //     }
                // }


            }}>
            <Stack
                sx={{
                    zIndex: 3,
                    alignItems: "flex-end",
                    position: 'absolute',
                    top: 32,
                    right: 0
                }}
                spacing={1}
            >
                {!isAvailable ? <Chip
                    label={"Brak w magazynie"}
                    variant={"filled"}
                    color={"default"}
                    sx={{
                        boxShadow: 1,
                        fontWeight: 600,
                        bgcolor: 'grey.300',
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                /> : <Chip
                    label={`Dostępne ${stock} szt.`}
                    variant={"filled"}
                    color={"primary"}
                    sx={{
                        boxShadow: 1,
                        fontWeight: 600,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                />}

                {!!tag && <Chip
                    label={tag}
                    variant={"filled"}
                    color={"primary"}
                    sx={{
                        boxShadow: 1,
                        fontWeight: 600,
                        bgcolor: colors.orange[600],
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                />}

                {/*{badges.map(({color, label}) => (<Chip*/}
                {/*  key={label}*/}
                {/*  label={label}*/}
                {/*  variant={"filled"}*/}
                {/*  color={"primary"}*/}
                {/*  sx={{*/}
                {/*    fontWeight: 600,*/}
                {/*    bgcolor: colors[color][600],*/}
                {/*    borderTopRightRadius: 0,*/}
                {/*    borderBottomRightRadius: 0,*/}
                {/*  }}*/}
                {/*/>))}*/}
            </Stack>


            {/* image + content side-by-side on md+, stacked on xs */}
            <Stack direction={{ xs: 'column', md: 'row' }} sx={{ p: { xs: 2, md: 3 }, alignItems: 'center' }}>
                <Box sx={{ flex: { xs: '0 0 auto', md: '0 0 50%' }, width: { xs: '100%', md: '50%' }, '& > img': { height: 'auto', width: '100%', maxWidth: '100%', maxHeight: '100%' } }}>
                    <AspectRatio>
                        {mainImage && <Image
                            src={mainImage}
                            fill
                            alt={!!name ? name : 'Product image'}
                            style={{ objectFit: 'contain' }}
                        />}
                    </AspectRatio>
                </Box>

                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: { xs: 'center', md: 'left' }, alignItems: { xs: 'center', md: 'flex-start' }, pl: { xs: 0, md: 2 } }}>
                    <Typography gutterBottom variant="h3">
                        {name}
                    </Typography>

                    <Typography variant="body2" color={'textSecondary'} sx={{ mb: 1 }}>
                        {category.name}
                    </Typography>

                    {minPrice30Days === price ? <Typography variant={'subtitle1'}>
                        {formatMoney(price)}
                    </Typography> : <Typography variant={'subtitle1'}>
                        <Typography
                            variant={'inherit'}
                            sx={{ textDecoration: 'line-through', color: 'action.disabled' }}
                        >{formatMoney(minPrice30Days)}</Typography>{' '}
                        <Typography variant={'inherit'}>{formatMoney(price)}</Typography>
                    </Typography>}

                </CardContent>

            </Stack>

            <ItemCardAddToCart itemId={id} disabled={!isAvailable}/>

         </CardActionArea>
     </Card>
 }
