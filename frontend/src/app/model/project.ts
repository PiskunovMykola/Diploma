import { IProjectBase } from "./iprojectbase";

export class Project implements IProjectBase{
    Id!: number;
    Sell!: number;
    Name!: string;
    Type!: string;
    Goal!: number;
    Funded?: number;
    Location!: string;
    Technologies!: string;
    Image?: string;
    Photos?: string[];
    Videos?: string[];
    Description!: string;
    Rewards?: string;
    ContactEmail?: string;
    ContactPhone?: string;
    ContactOther?: string;
    By?: string;

    constructor() {
        this.Funded = 0;
    }
}