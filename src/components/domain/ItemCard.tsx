import {Card, CardActionArea, CardContent, Chip, Stack, Typography} from "@mui/material";
import {blue, orange, purple, red, yellow} from "@mui/material/colors";
import Image from "next/image";
import Link from "next/link";
import {AspectRatio} from "@/components/common/AspectRatio";
import {WebLinkerService} from "@/services/weblinker";
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

export const ItemCard = async ({
                                   item
                               }: { item: WeblinkerProductSummary }) => {
    const {
        image,
        name,
        shortDescription,
        slug,
        categoryId,
        tag,
        stock,
        id,
        price,
        minPrice30Days
    } = item;
    const mainImage = image;
    const {interface: {availableProductsMin}} = await getAppConfig();
    const dataSource = await WebLinkerService();
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

                '.MuiFab-root': {
                    opacity: 0,
                    transition: 'opacity .3s'
                },

                '&:hover, &:focus, &:active': {
                    '.MuiFab-root': {
                        opacity: 1,
                        transition: 'opacity .3s'
                    }
                }


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
                {!isAvailable && <Chip
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


            <Stack sx={{
                p: {
                    xs: 2,
                    md: 3
                },
                //alignItems: "center",

                '& > img': {
                    height: 'auto',
                    width: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                }
            }}>
                <AspectRatio>
                    {mainImage && <Image
                        src={mainImage}
                        fill
                        alt="Picture of the author"
                        style={{objectFit: 'contain'}}
                    />}
                </AspectRatio>
            </Stack>

            <CardContent sx={{alignItems: 'center', textAlign: 'center'}}>
                <Typography gutterBottom variant="h3">
                    {name}
                </Typography>

                <Typography variant="body2" color={'textSecondary'} sx={{mb: 1}}>
                    {category.name}
                </Typography>

                {minPrice30Days === price ? <Typography variant={'subtitle1'}>
                    {formatMoney(price)}
                </Typography> : <Typography variant={'subtitle1'}>
                    <Typography
                        variant={'inherit'}
                        sx={{textDecoration: 'line-through', color: 'action.disabled'}}
                    >{formatMoney(minPrice30Days)}</Typography>{' '}
                    <Typography variant={'inherit'}>{formatMoney(price)}</Typography>
                </Typography>}


            </CardContent>

            <ItemCardAddToCart itemId={id} disabled={!isAvailable}/>

        </CardActionArea>
    </Card>
}
