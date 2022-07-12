import { users } from "../../mocked_data/users";
import { User } from "./types";

export const getCurrentUser = () =>
  new Promise<User>((resolve) => {
    setTimeout(() => {
      resolve(users[Math.round(Math.random() * (users.length - 1))]);
    }, Math.random() * 3000);
  });
