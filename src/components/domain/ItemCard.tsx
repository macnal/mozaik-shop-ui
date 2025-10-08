import {Game} from "@/types/responses"
import {Card, CardActionArea, CardContent, Chip, Rating, Stack, Typography} from "@mui/material";
import {blue, orange, purple, red, yellow} from "@mui/material/colors";
import Image from "next/image";
import Link from "next/link";
import {AspectRatio} from "@/components/common/AspectRatio";
import {WebLinkerService} from "@/services/weblinker";
import {ItemCardAddToCart} from "@/components/domain/ItemCardAddToCart";

const colors = {
  orange,
  blue,
  red,
  purple,
  yellow
}

export const ItemCard = async ({
                                 image,
                                 name,
                                 shortDescription,
                                 slug,
                                 categoryId,
                                 rating = 4,
                                 tag,
                                 stock,
                                 id,
                                 // categories = [],

                               }: Game & {

  //tags?: { color: keyof typeof colors, label: string, }[],
  rating?: number
}) => {
  const mainImage = image;
  const dataSource = WebLinkerService();
  const category = await dataSource.fetchCategoryById(categoryId);
  const url = `/${category.slug}/${slug}`;

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
        <Chip
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
        />

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
        p: 3,
        '& > img': {
          height: 'auto',
          maxWidth: '100%'
        }
      }}>
        <AspectRatio>
          {mainImage && <Image
            src={mainImage}
            fill
            alt="Picture of the author"
          />}
        </AspectRatio>
      </Stack>

      <CardContent sx={{alignItems: 'center', textAlign: 'center'}}>
        <Typography gutterBottom variant="h3">
          {name}
        </Typography>

        <Typography variant="body2" color={'textSecondary'} sx={{ mb: 1 }}>
          {shortDescription}
        </Typography>

        <Rating size={'small'} value={rating} precision={0.5} readOnly/>
      </CardContent>

      <ItemCardAddToCart itemId={id} disabled={stock === 0}/>

    </CardActionArea>
  </Card>
}
