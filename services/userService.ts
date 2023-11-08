import ApiClient from "../configs/axiosConfig"
import { CreateCinemaTicketDto } from "../types/user"

class Service {
  async getCinemaTicket(userId: string, status?: string) {
    try {
      let url = `/api/user/cinema-ticket?userId=${userId}`
      if (status) {
        url += `&status=${status}`
      }
      const listCinemaTicket = await ApiClient.GET(url)
      return listCinemaTicket
    } catch(e) {
      console.log(e)
    }
  }

  async addCinemaTicket(data: CreateCinemaTicketDto) {
    try {
      const response = await ApiClient.POST('/api/user/cinema-ticket', data)

      return response
    } catch(e) {
      console.log(e)
    }
  }

  async updateCinemaTicket(data: CreateCinemaTicketDto, type: 'book' | 'reset') {
    try {
      const response = await ApiClient.PUT(`/api/user/cinema-ticket?type=${type}`, data)

      return response
    } catch(e) {
      console.log(e)
    }
  }

  async deleteCinemaTicket(userId: string, movieId: number, type: 'cancel' | 'delete') {
    try {
      const url = `/api/user/cinema-ticket?userId=${userId}&movieId=${movieId}&type=${type}`
      const response = await ApiClient.DELETE(url)

      return response
    } catch(e) {  
      console.log(e)
    }
  }
}

const UserService = new Service()

export default UserService