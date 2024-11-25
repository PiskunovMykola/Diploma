import { IProjectBase } from "./iprojectbase";

export class Project implements IProjectBase{
    Id!: number;
    Sell!: number;
    Name!: string;
    Type!: string;
    Price!: number;
    Location!: string;
    Technologies!: string;
    Image?: string;
    Description?: string;
}