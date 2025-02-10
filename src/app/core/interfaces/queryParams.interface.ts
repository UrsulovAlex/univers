import { DocumentStatusType } from "../Types/documentStatus";

export interface QueryParams {
    page?: string;
    size?: string;
    sort?: string;
    status?: string;
    creator?: string;
}