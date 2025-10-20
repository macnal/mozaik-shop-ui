import {NextRequest} from "next/server";
import {WebLinkerService} from "@/services/weblinker";

export async function GET(request: NextRequest, {params}: any) {
  const {orderId} = await params;

  const dataSource = await WebLinkerService();
  return Response.json(await dataSource.fetchOrderStatus(orderId!));
}
