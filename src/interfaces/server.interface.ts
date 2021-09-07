import { SessionData } from 'express-session';

import { Request, Response } from 'express'
import { StaticDB } from 'src/libs/StaticDB';

interface ParamsDictionary {
    [key: string]: string;
}
export type Req  = Request<ParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>;
export type Resp = Response;
export type TStaticDB = StaticDB

type Ses = Partial<SessionData>

export interface Session extends Ses{
    accessToken?:string
}