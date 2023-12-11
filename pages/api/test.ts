import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { date } = req.query as any  
      
      const result = {
        "15/12/2023": [
          { value: 14, label: "Quảng Ninh" },
          { value: 29, label: "Hà Nội" },
          { value: 36, label: "Thanh Hoá" },
          { value: 88, label: "Vĩnh Phúc" },
        ],
        "18/12/2023": [
          { value: 14, label: "Nam Định" },
          { value: 29, label: "Hồ Chí Minh" },
          { value: 36, label: "Cần Thơ" },
        ]
      }

      return res.status(200).json({ data: result })
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}