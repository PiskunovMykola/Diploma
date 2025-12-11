export interface IProjectBase{
    Id: number;
    Sell: number;
    Name: string;
    Type: string;
    Price: number;
    Location: string;
    Technologies: string;
    Image?: string;
    Photos?: string[];
    Videos?: string[];
    Description: string;
    ContactEmail?: string;
    ContactPhone?: string;
    ContactOther?: string;
}