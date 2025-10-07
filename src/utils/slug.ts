interface Slugable {
  slug: string;
}

export const getSlug = (item: Slugable) => {
  return item.slug
}

export const splitSlug = (slug: string) => {
  const arr = slug.split("-");
  const id = Number(arr[arr.length - 1]);
  const rest = arr.toSpliced(0, arr.length - 1);

  return [id, rest.join('-')] as const;
}
