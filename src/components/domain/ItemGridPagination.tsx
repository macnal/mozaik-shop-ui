'use client'

import {Pagination, PaginationItem} from "@mui/material";
import NextLink from "next/link";
import {ApiPageResponsePage} from "@/types/responses";
import {usePathname, useSearchParams} from "next/navigation";

export const ItemGridPagination = ({pagination}: { pagination: ApiPageResponsePage }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const page = +(searchParams.get('page') || 1);

  return <Pagination
    size={'large'}
    defaultValue={page}
    count={pagination.totalPages}
    variant="outlined"
    color="primary"
    renderItem={(item) => {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set('page', `${item.page || 1}`);
      const nextUrl = `${pathname}?${nextSearchParams.toString()}`

      return <PaginationItem
        {...item}
        component={NextLink}
        href={nextUrl}
      />
    }}
  />
}
