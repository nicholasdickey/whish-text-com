// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withSessionRoute, Options } from "../../../lib/with-session";
import {updateSession} from "../../../lib/api"
export default withSessionRoute(handler);

/**
 * Note: the incoming session object could be only partial, will be merged over existing session
 * 
 * @param req 
 * 
 * @param res 
 * @returns 
 */
async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    }
   // let options: Options = req.session.options ? req.session.options : ({} as Options);
    const body = req.body;
    const session=req.body.session;
    console.log("save session",session);
    req.session.sessionid = session.sessionid;//Object.assign(options, inSession);
    await updateSession(session.sessionid,session);
    console.log("save session2", session.options);
    await req.session.save();
   

    res.status(200).json({})
}
