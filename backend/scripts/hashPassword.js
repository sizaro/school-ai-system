// scripts/hashPassword.js
import bcrypt from "bcrypt";

const saltRounds = 10;

//    OwnerPassword123!

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: node scripts/hashPassword.js <plainPassword>");
    process.exit(1);
  }
  const plain = arg;
  try {
    const hash = await bcrypt.hash(plain, saltRounds);
    console.log("BCRYPT HASH:");
    console.log(hash);
  } catch (err) {
    console.error("Error hashing:", err);
    process.exit(1);
  }
}

main();
