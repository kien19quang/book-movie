export interface ILoginDto {
  email: string,
  password: string
}

export interface IRegisterDto {
  name: string,
  email: string,
  password: string
  role?: string
}

export interface IProfileUser {
  name: string,
  email: string,
}