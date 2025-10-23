import {WebLinkerService} from "@/services/weblinker";
import {Category} from "@/types/responses";
import {NavbarCategorySubmenuClient} from "@/app/@navbar/_components/NavbarCategorySubmenu.client";

export const NavbarCategorySubmenu = async ({
                                              parent
                                            }: {
  parent: Category
}) => {
  const dataSource = await WebLinkerService();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const {items: categories} = await dataSource.fetchCategories({parentId: 5052434 || parent.id});

  return <NavbarCategorySubmenuClient
    categories={categories}
    parent={parent}
  />
}
