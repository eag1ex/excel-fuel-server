
import { Request, Router, Response, RequestParamHandler } from 'express'
import { PetrolModel } from '.';
export type Req  = Request<RequestParamHandler, any, any, qs.ParsedQs, Record<string, any>>;
export type Resp = Response;

export interface StaticDB{
    petrolList(): Promise<PetrolModel[]>
}
