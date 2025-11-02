import {WebLinkerService} from "@/services/weblinker";
import {NextRequest} from "next/server";
import {getCategoryById} from "@/data/categories";


export const GET = async (
  request: NextRequest,
) => {
  const query = request.nextUrl.searchParams.get('query') || '';
  //const {query} = req.query;

  const dataSource = await WebLinkerService();
  const {items} = await dataSource.fetchProducts({
    query,
    page: 0,
    size: 10
  });

  return Response.json({
    items: await Promise.all(
      items.map(async (item) => {
        const category = getCategoryById(item.categoryId);

        return ({
          id: item.id,
          name: item.name,
          categoryName: category.name,
          url: `/${category.slug}/${item.slug}`,
          image: item.image
        })
      }))
  })
}
