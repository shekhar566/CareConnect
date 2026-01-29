import bcrypt from "bcryptjs";
import { User, Account } from "@/database";
import { TestUser } from "../fixtures/users";

export async function createTestUser({
  name,
  username,
  email,
  password,
}: TestUser) {
  const user = await User.create({
    name,
    username,
    email,
  });

  await Account.create({
    userId: user._id,
    provider: "credentials",
    providerAccountId: email,
    password: await bcrypt.hash(password ?? "password123", 12),
  });

  console.log(`Created test user: ${user.username}`);
  return user;
}
