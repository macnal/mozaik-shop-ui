import {PropsWithChildren} from "react";
import {PageContainer} from "@/components/PageContainer";
import {NoSsr, Typography} from "@mui/material";
import {PageFilter} from "@/components/common/PageFilter";
import {CategoriesChips} from "@/components/domain/CategoriesChips";
import {WebLinkerService} from "@/services/weblinker";
import {notFound} from "next/navigation";

interface CategoryLayoutProps {
  params: Promise<{ categorySlug: string }>,
  searchParams: Promise<{ page: string, size: string }>
}


const Layout = async ({children, params}: PropsWithChildren<CategoryLayoutProps>) => {
  const {categorySlug} = await params;

  const dataSource = WebLinkerService();
  const category = await dataSource.fetchCategory(categorySlug);

  if (!category) {
    throw notFound();
  }

  const {formSchema, layoutSchema} = await dataSource.fetchCategoryFormSchema(category.id);
  console.log([formSchema, layoutSchema]);


  const {items: childCategories} = await dataSource.fetchCategories({
    parentId: category.id,
  });

  return <PageContainer>
    <Typography variant={'h1'} sx={{mb: 2}}>
      {category.name}
    </Typography>

    <NoSsr>
      <PageFilter schema={formSchema} uiSchema={layoutSchema} initialData={{}}/>
    </NoSsr>

    <CategoriesChips items={childCategories} sx={{mb: 6}}/>

    {children}
  </PageContainer>
}

export default Layout;
