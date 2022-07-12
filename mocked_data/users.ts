import { User } from "../src/user/types";

export const users: User[] = [];

for (let i = 0; i < Math.random() * 50; i++) {
  users.push({
    id: `user_${i + 1}`,
    name: `User #${i + 1}`,
    profilePicture: "https://i.pravatar.cc/150?___v=" + i + 1,
  });
}
