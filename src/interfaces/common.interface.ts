

export interface Message{
        [code: string]: {message: string, code: string};
}

export type ENV = 'development'|'production'

export interface AuthCredentials{
        username: string;
        password: string;
}