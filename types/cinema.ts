export interface CreateProvince {
  id: number;
  name: string;
}

export interface UpdateProvince extends CreateProvince {
  oldId: number
}

export interface CreateCinema {
  name: string;
  provinceId: number
}

export interface UpdateCinema extends CreateCinema {
  id: string
}

export interface IOption {
  label: string,
  value: string
}

export interface CreateScreening {
  cinemaId: string
  dayBookTicket: string
  types: IOption[],
  movieScreenTimes: IOption[]
}

export interface ICinema {
  id: string
  name: string,
  provinceId: number
  province: CreateProvince
}

export interface IProvince {
  id: number,
  name: string,
  cinema: ICinema[]
}

export interface IScreening {
  id: string,
  provinceId: number
  cinemaId: string
  dayBookTicket: string
  types: IOption[],
  movieScreenTimes: IOption[]
}