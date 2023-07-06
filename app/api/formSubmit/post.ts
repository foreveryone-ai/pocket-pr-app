import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const result = await axios.post(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.status(200).json(result.data);
    } catch (error) {
      return res.status(500).json({ message: "Error submitting form" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
