//./lib/with-session.ts
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import {
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextApiHandler,
} from "next";


declare module "iron-session" {
    interface IronSessionData {
        sessionid:string,
        user?: {
            identity: string;
            admin?: boolean;
        };
    }
}
const sessionOptions = {
    password: process.env.IRON_PASSWORD as string,
    cookieName: "lake",
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
};

export function withSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
    P extends { [key: string]: unknown } = { [key: string]: unknown },
>(
    handler: (
        context: GetServerSidePropsContext,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
) {
    return withIronSessionSsr(handler, sessionOptions);
}
export interface Options{
    sessionid:string,
    dark:number,
    greeting?:string,
    giftSuggestions?:string,
    noExplain:false,
    imagesString?:string;
    selectedImage?:string;
    from?:string;
    to?:string;
    occasion?:string;
    reflections?:string;
    instructions?:string;
    inastyleof?:string;
    language?:string;
    interests?:string;
 }