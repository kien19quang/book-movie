import ApiClient from "../configs/axiosConfig"
import { CreateProvince } from "../types/cinema"

class Service {
  async getProvince() {
    try {
      const listCinemaTicket = await ApiClient.GET('/api/cinema/province')
      return listCinemaTicket
    } catch(e) {
      console.log(e)
    }
  }

  async addProvince(data: CreateProvince) {
    try {
      const response = await ApiClient.POST('/api/cinema/province', data)

      return response
    } catch(e) {
      console.log(e)
    }
  }

  async deleteProvince(id: number) {
    try {
      const url = `/api/cinema/province?id=${id}`
      const response = await ApiClient.DELETE(url)

      return response
    } catch(e) {  
      console.log(e)
    }
  }

  async getScreening(provinceId: number, cinemaId: string, dayBookTicket: string) {
    try {
      const url = `/api/cinema/screenings?provinceId=${provinceId}&cinemaId=${cinemaId}&dayBookTicket=${dayBookTicket}`
      const response = await ApiClient.GET(url)

      return response
    } catch(e) {  
      console.log(e)
    }
  }
}

const CinemaService = new Service()

export default CinemaService