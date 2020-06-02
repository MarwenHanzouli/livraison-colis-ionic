export class User{
    public uid:string;
    public emailVerified:boolean;
    public disabled:boolean;
    public verified:boolean;
    constructor(public nom:string,
        public prenom:string,
        public email:string,
        public telephone:string,
        public password:string,
        public role:string,
        public deviceToken?:string,
        public tokens?:string[]
        ){}
}