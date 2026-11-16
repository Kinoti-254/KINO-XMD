const digits = value => String(value || "").replace(/\D/g, "");

const configuredOwnerNumber = digits(process.env.OWNER_NUMBER);
const ownerNumber = configuredOwnerNumber || "254111341897";
const configuredPrefix = process.env.PREFIX;
const prefix = configuredPrefix === undefined || configuredPrefix === "" ? "." : String(configuredPrefix);

const channel = Object.freeze({
  name: "Byte Dev KE",
  jid: "120363409425500220@newsletter"
});

export default Object.freeze({
  name: String(process.env.BOT_NAME || "KINO MD").trim() || "KINO MD",
  version: String(process.env.BOT_VERSION || "1.0.0").trim() || "1.0.0",
  prefix,
  ownerName: String(process.env.OWNER_NAME || "Byte Dev").trim() || "Byte Dev",
  ownerNumber,
  ownerNumbers: Object.freeze([ownerNumber]),
  defaultMode: String(process.env.BOT_MODE || "public").toLowerCase() === "private" ? "private" : "public",
  sessionDirectory: String(process.env.FEI_SESSION_DIR || "./auth_info_baileys").trim() || "./auth_info_baileys",
  dataDirectory: String(process.env.FEI_DATA_DIR || "./data").trim() || "./data",
  logLevel: String(process.env.LOG_LEVEL || "info").trim().toLowerCase(),
  browser: "Chrome",
  channel,
  imageUrl: String(
    process.env.BOT_IMAGE_URL ||
    "https://res.cloudinary.com/dqqyvozdw/image/upload/v1794738118/bh3igaehci6zh9aewsld.jpg"
  ).trim(),
  botUrl: String(process.env.BOT_URL || "https://fei-xmd.benfeilab.com").trim()
});
