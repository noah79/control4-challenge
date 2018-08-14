import {observable} from 'mobx';

export class UserStore {
	@observable accessToken : string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjamtpbzdwMnQ0eXBhMGI0M2NnZnpiM3dnIiwiaWF0IjoxNTMzNTgzODI1fQ.r4YfLYkOfJ4QEcAcHrG5oVXqht7sqrKf-I79Oxf3cLQ";
	@observable idToken: string;
}

export const user = new UserStore();