import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "Hi, mom" })
}
export async function DELETE(req: Request) {
  const data = req.body;
  console.log(data)
  return NextResponse.json({ message: "User deleted successfully!!" });
}

// async function deletePosts(req: NextApiRequest, res: NextApiResponse) {
//   const { userId } = req.query;
//   console.log(userId)
//   try {
//     const deletedUser = users_arr.filter(
//       (user) => user.id === Number(userId)
//     )[0];
//     if (deletedUser) {
//       users_arr = users_arr.filter((user) => user.id !== Number(userId));
//       res
//         .status(200)
//         .send({ message: "User deleted successfully!!" });
//     } else {
//       res.status(200).send({ message: "User not found!" });
//     }
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ message: "Internal Server error" });
//   }
// }