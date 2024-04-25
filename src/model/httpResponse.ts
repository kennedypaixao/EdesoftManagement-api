export interface IHttpResponse<T> {
    Data: T;
    ErrorMessages: string[];
}

export function HttpResponse<T>(data: T = null, errorMessages:string[] = []): IHttpResponse<T> {
    const obj:IHttpResponse<T> = {
        Data: data,
        ErrorMessages: errorMessages
    }
    return obj;
}