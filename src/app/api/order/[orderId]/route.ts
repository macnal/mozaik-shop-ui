import {NextRequest} from "next/server";
import {WebLinkerService} from "@/services/weblinker";

interface GETRouteProps {
  params: Promise<{ orderId: string }>,
}

export async function GET(request: NextRequest, {params}: GETRouteProps) {
  const {orderId} = await params;

  const dataSource = await WebLinkerService();
  return Response.json(await dataSource.fetchOrderStatus(orderId!));
}
