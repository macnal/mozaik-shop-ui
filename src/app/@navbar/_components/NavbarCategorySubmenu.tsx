import {NavbarCategorySubmenuClient} from "@/app/@navbar/_components/NavbarCategorySubmenu.client";
import {WeblinkerCategory} from "@/api/gen/model";


export const NavbarCategorySubmenu = async ({parent}: {
    parent: WeblinkerCategory
}) => {
    try {
        return <NavbarCategorySubmenuClient
            categories={[]}
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
