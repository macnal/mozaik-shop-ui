import {PageContainer} from "@/components/PageContainer";
import {PropsWithChildren} from "react";

interface TransactionStatusLayoutProps {
  params: Promise<{ orderId: string }>
}

export default async function TransactionStatusLayout({
                                                        params,
                                                        children
                                                      }: PropsWithChildren<TransactionStatusLayoutProps>) {
  const {orderId} = await params;

  return (
    <PageContainer>
      {children}
    </PageContainer>


  );
}
