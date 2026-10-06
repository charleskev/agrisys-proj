import bcrypt from "bcrypt";
import { pool } from "../src/config/db.js";
import {
  createUser,
  findUserByContact,
  findUserByEmail,
} from "../src/api/models/userModel.js";

function readHidden(prompt) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this script in an interactive terminal.");
  }

  return new Promise((resolve, reject) => {
    let value = "";
    const input = process.stdin;
    process.stdout.write(prompt);
    input.setEncoding("utf8");
    input.setRawMode(true);
    input.resume();

    function finish(error) {
      input.off("data", onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write("\n");
      error ? reject(error) : resolve(value);
    }

    function onData(chunk) {
      for (const character of chunk) {
        if (character === "\u0003") return finish(new Error("Cancelled."));
        if (character === "\r" || character === "\n") return finish();
        if (character === "\u007f" || character === "\b") value = value.slice(0, -1);
        else if (character >= " ") value += character;
      }
    }

    input.on("data", onData);
  });
}

try {
  const [nameArg, emailArg, phoneArg] = process.argv.slice(2);
  const fullName = (nameArg || "").trim();
  const email = (emailArg || "").trim().toLowerCase();
  const contactNumber = (phoneArg || "").replace(/\D/g, "");

  if (!fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Usage: node .\\scripts\\seed-staff.mjs "Staff Name" staff@example.com 09XXXXXXXXX');
  }
  if (!/^09\d{9}$/.test(contactNumber)) {
    throw new Error("Use a Philippine mobile number in 09XXXXXXXXX format.");
  }
  if (await findUserByEmail(email) || await findUserByContact(contactNumber)) {
    throw new Error("An account already uses that email or mobile number; no changes made.");
  }

  const password = await readHidden("Staff password (12+ characters): ");
  const confirm = await readHidden("Confirm password: ");
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");
  if (password !== confirm) throw new Error("Passwords do not match.");

  await createUser({
    fullName,
    email,
    contactNumber,
    passwordHash: await bcrypt.hash(password, 12),
    role: "staff",
  });

  console.log(`Staff account created for ${email}.`);
} catch (error) {
  console.error(`Seed failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}