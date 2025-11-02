import {WebLinkerService} from "@/services/weblinker";
import {Category} from "@/types/responses";
import {NavbarCategorySubmenuClient} from "@/app/@navbar/_components/NavbarCategorySubmenu.client";

export const NavbarCategorySubmenu = async ({
                                              parent
                                            }: {
  parent: Category
}) => {
  try {
    const dataSource = await WebLinkerService();
    const {items: categories} = await dataSource.fetchCategories({parentId: parent.id});

    return <NavbarCategorySubmenuClient
      categories={categories}
      parent={parent}
    />
  } catch (error_) {
    console.error('Failed to fetch categories for submenu', parent?.id, error_);
    // fallback: render client submenu with empty categories and pass fetchError for client notification
    return <NavbarCategorySubmenuClient
      categories={[]}
      parent={parent}
      fetchError={true}
    />
  }
}
