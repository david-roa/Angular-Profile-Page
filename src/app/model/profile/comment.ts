export class Comment{
    id:number;
    user:string;
    message:string;
    date:Date;  
    
    constructor(){
        this.id = new Date().getTime();
        this.date = new Date();
    }
}