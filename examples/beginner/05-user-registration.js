import { connect, close } from "../../config/db.js";
import { randomBytes, scryptSync } from "crypto";

// ── Validation helpers ────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Validate user registration input.
 * Returns an array of error messages (empty when input is valid).
 */
function validateRegistrationInput({ name, email, password }) {
  const errors = [];

  if (!name || name.trim() === "") {
    errors.push("Name is required.");
  }

  if (!email || email.trim() === "") {
    errors.push("Email is required.");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Email must be in a valid format (e.g. user@example.com).");
  }

  if (!password || password.trim() === "") {
    errors.push("Password is required.");
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
    );
  }

  return errors;
}

// ── Registration service ──────────────────────────────────────────────────────

/**
 * Hash a password using scrypt with a random salt.
 * Returns a string in the format "salt:hash" (both hex-encoded).
 */
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Register a new user after validating input.
 * Returns { success, errors, user } where `user` is the inserted document on
 * success, or `null` on failure.
 */
async function registerUser(db, { name, email, password }) {
  const errors = validateRegistrationInput({ name, email, password });
  if (errors.length > 0) {
    return { success: false, errors, user: null };
  }

  const coll = db.collection("registered_users");

  const existing = await coll.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    return {
      success: false,
      errors: ["An account with this email already exists."],
      user: null,
    };
  }

  const newUser = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashPassword(password),
    createdAt: new Date(),
  };

  const result = await coll.insertOne(newUser);
  return { success: true, errors: [], user: { ...newUser, _id: result.insertedId } };
}

// ── Demo ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log("=== User Registration with Validation ===\n");

  const { db } = await connect();
  const coll = db.collection("registered_users");
  await coll.deleteMany({});

  const testCases = [
    {
      label: "Missing all fields",
      input: { name: "", email: "", password: "" },
    },
    {
      label: "Invalid email format",
      input: { name: "Alice", email: "not-an-email", password: "securePass1" },
    },
    {
      label: "Password too short (< 8 chars)",
      input: { name: "Bob", email: "bob@example.com", password: "short" },
    },
    {
      label: "Valid registration",
      input: {
        name: "Carol",
        email: "carol@example.com",
        password: "strongPass1",
      },
    },
    {
      label: "Duplicate email",
      input: {
        name: "Carol Again",
        email: "carol@example.com",
        password: "anotherPass1",
      },
    },
  ];

  for (const { label, input } of testCases) {
    console.log(`--- ${label} ---`);
    const result = await registerUser(db, input);
    if (result.success) {
      console.log("  ✓ Registration successful! User ID:", result.user._id);
      console.log("    Name:", result.user.name, "| Email:", result.user.email);
    } else {
      console.log("  ✗ Registration failed:");
      result.errors.forEach((e) => console.log("    •", e));
    }
    console.log();
  }

  const totalUsers = await coll.countDocuments();
  console.log("Total registered users in DB:", totalUsers);

  await close();
  console.log("\nDone.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
