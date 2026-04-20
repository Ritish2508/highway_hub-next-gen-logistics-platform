// hash.js
import bcrypt from "bcryptjs";

const run = async () => {
  const hashedPassword = await bcrypt.hash("owner123", 10);
  console.log("Hashed password:", hashedPassword);
};

run();
