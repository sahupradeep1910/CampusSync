export type ResourceType='Book'|'Equipment';
export interface Resource{ id:string; name:string; type:ResourceType; category:string; isAvailable:boolean; description:string; location:string; rating:number; usageCount:number; addedDate:string; }
export interface BorrowRecord{ id:string; studentName:string; studentId:string; resourceId:string; resourceName:string; borrowDate:string; returned:boolean; returnDate?:string; }
export interface AppState{resources:Resource[];borrowHistory:BorrowRecord[];isLoading:boolean;}
