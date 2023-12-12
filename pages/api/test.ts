import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { date, isTree } = req.query as any  
      
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

      if (isTree) {
        const response = [
          { title: '20/12/2023', value: '20/12/2023', children: [{ value: '19', title: '19h00' }, { value: '20', title: '20h00' }] },
          { title: '30/12/2023', value: '30/12/2023', children: [{ value: '17', title: '17h00' }, { value: '18', title: '18h00' }] },
        ]
        return res.status(200).json({ data: response })
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