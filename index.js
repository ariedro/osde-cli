const { createHmac } = require("crypto");
const { user, seed } = require("./config.json");

if (seed.startsWith("<")) {
  console.log("Usage: Please fill your OTP seed on config.json");
  process.exit(1);
}

const generateToken = (secret) => {
  const counter = Math.floor(new Date().getTime() / 300000)
    .toString(16)
    .padStart(16, "0");
  const digest = createHmac("sha256", secret)
    .update(Buffer.from(counter, "hex"))
    .digest();
  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);
  const tokenNumber = binary % Math.pow(10, 3);
  return tokenNumber.toString().padStart(3, "0");
};

const getRemainingTime = () => {
  const seconds = 300 - (Math.floor(new Date().getTime() / 1000) % 300);
  return Math.floor(seconds / 60) + "m " + (seconds % 60) + "s";
};

if (user) {
  console.log(user.name);
  console.log(user.membershipNumber);
  console.log(user.plan);
}

console.log("Token:", generateToken(seed));
console.log("Se actualizará en", getRemainingTime());
