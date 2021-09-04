
import { Request, Response, RequestParamHandler } from 'express'
import { StaticDB } from 'src/libs/StaticDB';
export type Req  = Request<RequestParamHandler, any, any, qs.ParsedQs, Record<string, any>>;
export type Resp = Response;

export type TStaticDB = StaticDB

