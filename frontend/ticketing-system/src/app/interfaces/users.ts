export interface Users {
  id: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
}
export interface userRegister {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone: string;
}
export interface userLogin {
  email: string;
  password: string;
}
