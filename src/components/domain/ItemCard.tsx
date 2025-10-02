import {Game} from "@/types/responses"
import {getSlug} from "@/utils/slug";
import {Card, CardActionArea, CardContent, Chip, Rating, Stack, Typography} from "@mui/material";
import {blue, orange, purple, red, yellow} from "@mui/material/colors";
import Image from "next/image";
import Link from "next/link";
import {AspectRatio} from "@/components/common/AspectRatio";
import {WebLinkerService} from "@/services/weblinker";

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
                                 id,
                                 rating = 4,
                                 tag,
  stock,
                                 // categories = [],

                               }: Game & {

  //tags?: { color: keyof typeof colors, label: string, }[],
  rating?: number
}) => {


  const slug = getSlug({name, id});


  const mainImage = image;

  const dataSource = WebLinkerService();
  const {items: categories} = await dataSource.fetchCategories({parentIds: [5052433]});
  const category = categories[0];
  const url = `/${getSlug(category)}/${slug}`;

  return <Card component={'article'}>
    <CardActionArea component={Link} href={url} sx={{position: 'relative'}}>
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

        <Typography gutterBottom variant="body2" color={'textSecondary'}>
          {shortDescription}
        </Typography>

        <Typography variant="body2" sx={{color: 'text.secondary'}}>
          <Rating value={rating} precision={0.5} readOnly/>
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
}
