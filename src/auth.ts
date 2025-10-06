import 'server-only';
import type {GetServerSidePropsContext, NextApiRequest, NextApiResponse,} from "next"
import {getServerSession} from "next-auth"
import {authConfig} from "@/auth.config";

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authConfig)
}
