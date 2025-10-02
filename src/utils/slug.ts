import slugify from "slugify";


interface Slugable {
  name: string;
  id: number;
}


export const getSlug = (item: Slugable) => {
  return `${slugify(item.name)}-${item.id}`;
}

export const splitSlug = (slug: string) => {
  const arr = slug.split("-");
  const id = Number(arr[arr.length - 1]);
  const rest = arr.toSpliced(0, arr.length - 1);

  return [id, rest.join('-')] as const;
}
