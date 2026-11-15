import { buildMenu } from "../lib/menu.js";

function formatDuration(seconds) {
  let remaining = Math.max(0, Math.floor(Number(seconds) || 0));
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const parts = [];
  if (days) parts.push(days + "d");
  if (hours) parts.push(hours + "h");
  if (minutes) parts.push(minutes + "m");
  if (secs || !parts.length) parts.push(secs + "s");
  return parts.join(" ");
}

function messageTimestampMs(message) {
  const raw = message && message.messageTimestamp;
  const value = raw && typeof raw.toNumber === "function" ? raw.toNumber() : Number(raw);
  if (!Number.isFinite(value) || value <= 0) return null;
  return value > 1000000000000 ? value : value * 1000;
}

function ownerNumber(config) {
  const owners = Array.isArray(config.ownerNumbers) ? config.ownerNumbers : [];
  return String(owners[0] || "").replace(/\D/g, "");
}

const commands = [
  {
    name: "menu",
    aliases: ["helpme"],
    category: "General",
    description: "Show the branded KINO MD menu and available command sections.",
    run: async ctx => {
      const menu = buildMenu({ commands: ctx.commands, config: ctx.config, theme: ctx.theme });
      if (ctx.config.imageUrl) {
        try {
          await ctx.send({
            image: { url: ctx.config.imageUrl },
            caption: "⚡ *KINO MD — WhatsApp Bot*\n" +
              "Official pairing portal: " + ctx.config.botUrl + "\n" +
              "✧ Powered by KINO MD"
          });
        } catch (error) {
          console.warn("KINO MD menu artwork could not be sent; using the text menu:", error?.message || error);
        }
      }
      await ctx.reply(menu);
    }
  },
  {
    name: "help",
    category: "General",
    description: "List registered commands and their descriptions.",
    run: async ctx => {
      const rows = (ctx.commands || [])
        .filter(command => !command.hidden)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(command => ctx.config.prefix + command.name + (command.description ? " ─ " + command.description : ""));
      const header = "📚 𝗞𝗜𝗡𝗢 𝗠𝗗 𝗛𝗘𝗟𝗣\n" + rows.length + " 𝗿𝗲𝗴𝗶𝘀𝘁𝗲𝗿𝗲𝗱 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n";
      const chunks = [];
      let current = header;
      for (const row of rows) {
        if (current.length + row.length + 1 > 3300) {
          chunks.push(current.trimEnd());
          current = "📚 𝗞𝗜𝗡𝗢 𝗠𝗗 𝗛𝗘𝗟𝗣 (𝗰𝗼𝗻𝘁𝗶𝗻𝘂𝗲𝗱)\n\n";
        }
        current += "┣➤ " + row + "\n";
      }
      if (current.trim()) chunks.push(current.trimEnd());
      for (const chunk of chunks) await ctx.reply(chunk);
    }
  },
  {
    name: "ping",
    category: "General",
    description: "Check bot responsiveness and estimated message response time.",
    run: async ctx => {
      const timestamp = messageTimestampMs(ctx.msg);
      const responseMs = timestamp === null ? null : Math.max(0, Date.now() - timestamp);
      await ctx.reply([
        "┏━━〔 🏓 𝗞𝗜𝗡𝗢 𝗠𝗗 · 𝗣𝗢𝗡𝗚 〕━━━━━━━━",
        "┃ ✧ Status: " + (ctx.connectionOpen ? "Online 🟢" : "Connecting 🟡"),
        "┃ ✧ Response: " + (responseMs === null ? "Unavailable" : responseMs + " ms"),
        "┃ ✧ Uptime: " + formatDuration(process.uptime()),
        "┃ ✧ Version: " + ctx.config.version,
        "┗━━━━━━━━━━━━━━━━"
      ].join("\n"));
    }
  },
  {
    name: "alive",
    aliases: ["uptime"],
    category: "General",
    description: "Show bot status, mode and uptime.",
    run: async ctx => {
      await ctx.reply(
        "✅ *" + ctx.config.name + "* is " + (ctx.connectionOpen ? "online." : "connecting.") +
        "\n🔐 Mode: " + String(ctx.mode || "public").toUpperCase() +
        "\n⏱️ Uptime: " + formatDuration(process.uptime()) +
        "\n⚡ Powered by KINO MD"
      );
    }
  },
  {
    name: "owner",
    category: "General",
    description: "Show KINO MD owner details.",
    run: async ctx => {
      const number = ownerNumber(ctx.config);
      await ctx.reply(
        "👑 𝗢𝗪𝗡𝗘𝗥: " + ctx.config.ownerName +
        (number ? "\n📱 𝗢𝗪𝗡𝗘𝗥 𝗡𝗨𝗠𝗕𝗘𝗥: +" + number : "")
      );
    }
  },
  {
    name: "support",
    category: "General",
    description: "Show support guidance for KINO MD.",
    run: async ctx => {
      await ctx.reply(
        "🛟 *" + ctx.config.name + " Support*\n" +
        "For setup help or bug reports, contact " +
        ctx.config.ownerName + ".\n\n" +
        "┣➤ GitHub: https://github.com/Benfeitech/FEI-XMD"
      );
    }
  },
  {
    name: "time",
    category: "General",
    description: "Show the current server time in Nigeria.",
    run: async ctx => {
      const value = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }).format(new Date());
      await ctx.reply("🕒 𝗡𝗜𝗚𝗘𝗥𝗜𝗔 𝗧𝗜𝗠𝗘: " + value);
    }
  },
  {
    name: "date",
    category: "General",
    description: "Show the current date in Nigeria.",
    run: async ctx => {
      const value = new Intl.DateTimeFormat("en-NG", {
        timeZone: "Africa/Lagos",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      }).format(new Date());
      await ctx.reply("📅 𝗗𝗔𝗧𝗘 𝗜𝗡 𝗡𝗜𝗚𝗘𝗥𝗜𝗔: " + value);
    }
  },
  {
    name: "version",
    category: "General",
    description: "Show KINO MD version and connection status.",
    run: async ctx => {
      await ctx.reply(
        "🤖 *" + ctx.config.name + "* v" + ctx.config.version +
        "\n🟢 Status: " + (ctx.connectionOpen ? "Online" : "Connecting") +
        "\n🔐 Mode: " + String(ctx.mode || "public").toUpperCase() +
        "\n📦 Baileys: official WhiskeySockets npm package"
      );
    }
  },
  {
    name: "jid",
    aliases: ["id"],
    category: "General",
    description: "Show the current chat and message sender IDs.",
    run: async ctx => {
      await ctx.reply(
        "💬 𝗖𝗛𝗔𝗧 𝗜𝗗: " + ctx.jid +
        "\n👤 𝗦𝗘𝗡𝗗𝗘𝗥 𝗜𝗗: " + (ctx.senderJid || "Unavailable")
      );
    }
  },
  {
    name: "whoami",
    category: "General",
    description: "Show your WhatsApp sender information.",
    run: async ctx => {
      await ctx.reply(
        "👤 𝗡𝗔𝗠𝗘: " + (ctx.msg?.pushName || "Unknown") +
        "\n🆔 𝗬𝗢𝗨𝗥 𝗜𝗗: " + (ctx.senderJid || "Unavailable") +
        "\n👑 𝗢𝗪𝗡𝗘𝗥: " + (ctx.owner ? "Yes" : "No")
      );
    }
  }
];

export default commands;
