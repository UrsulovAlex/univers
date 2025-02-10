import { NewDocStatus } from "../../core/interfaces/document.interface";
import { Filter } from "../../core/interfaces/filter.interface";
import { UsetsStatusList } from "../../core/interfaces/usersStatusList";

export const NEW_DOCUMENT_STATUS: NewDocStatus[] = [
    { 
        name: 'Draft',
        status: 'DRAFT',
    },
    { 
        name: 'Ready for review',
        status: 'READY_FOR_REVIEW',
    },
]

export const STATUS_FILTER_CONFIG: Filter[] = [
    {
        value: 'APPROVED',
        name: 'Approved'
    },
    {
        value: 'DECLINED',
        name: 'Declined'
    },
    {
        value: 'DRAFT',
        name: 'Draft'
    },
    {
        value: 'READY_FOR_REVIEW',
        name: 'Ready for review'
    },
    {
        value: 'REVOKE',
        name: 'Revoke'
    },
    {
        value: 'UNDER_REVIEW',
        name: 'Under review'
    }
]

export const STATUS_LIST_REVIEWER: UsetsStatusList[] = [
    {
        value: 'APPROVED',
        name: 'Approved'
    },
    {
        value: 'DECLINED',
        name: 'Declined'
    },
    {
        value: 'UNDER_REVIEW',
        name: 'Under review'
    }
]

export const STATUS_LIST_USER: UsetsStatusList[] = [
    {
        value: 'DRAFT',
        name: 'Draft'
    },
    {
        value: 'READY_FOR_REVIEW',
        name: 'Ready for review'
    },
]

export interface CreatorList {
    id: string,
    fullName: string,
}

export const STATUS_VIEW = {
    DRAFT:'Draft',
    REVOKE:'Revoke',
    READY_FOR_REVIEW:'Ready for review',
    UNDER_REVIEW:'Under review',
    APPROVED:'Approved',
    DECLINED:'Declined'
}