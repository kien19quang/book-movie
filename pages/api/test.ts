import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const result = [
        { value: 14, label: "Quảng Ninh" },
        { value: 29, label: "Hà Nội" },
        { value: 36, label: "Thanh Hoá" },
        { value: 88, label: "Vĩnh Phúc" },
        { value: 22, label: "Tuyên Quang" },
      ]

      return res.status(200).json(result)
    }
    else {
      return res.status(405).end()
    }
  } catch(error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` })
  }
}