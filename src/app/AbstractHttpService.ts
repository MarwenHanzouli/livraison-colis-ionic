import { environment } from '../environments/environment.prod'

export abstract class AbstractHttpService{
    url = environment.apiUrl;
    constructor(){}
}