export function getSectionCommands(section, commands = []) {
  const visible = commands.filter(command => !command.hidden);
  if (Array.isArray(section.commandNames)) {
    const selected = new Set(section.commandNames.map(value => String(value).toLowerCase()));
    return visible.filter(command => selected.has(String(command.name).toLowerCase()));
  }
  const categories = Array.isArray(section.categories) && section.categories.length
    ? section.categories
    : [section.key];
  const excluded = new Set(section.excludeNames || []);
  return visible.filter(command =>
    categories.includes(command.category) && !excluded.has(command.name)
  );
}

export function buildMenu({ commands = [], config = {}, theme = {} } = {}) {
  const menu = theme.menu || {};
  const sections = Array.isArray(theme.sections) ? theme.sections : [];
  const prefix = String(config.prefix || ".");
  const safeName = String(config.name || "KINO MD").replace(/[\r\n]/g, " ").slice(0, 40);
  const lines = [
    String(menu.top || "┏━━〔 ") + safeName + String(menu.titleEnd || " 〕━━━━━━━━"),
    String(menu.infoLine || "┃ ✧ ") + "𝗩𝗲𝗿𝘀𝗶𝗼𝗻: " + String(config.version || "1.0.0"),
    String(menu.infoLine || "┃ ✧ ") + "𝗣𝗿𝗲𝗳𝗶𝘅: " + prefix,
    String(menu.infoLine || "┃ ✧ ") + "𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗹𝗼𝗮𝗱𝗲𝗱: " + commands.filter(command => !command.hidden).length,
    String(menu.blankLine || "┃")
  ];

  if (!commands.length) {
    lines.push(String(menu.infoLine || "┃ ✧ ") + "𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗺𝗼𝗱𝘂𝗹𝗲𝘀 𝗮𝗿𝗲 𝗯𝗲𝗶𝗻𝗴 𝗽𝗿𝗲𝗽𝗮𝗿𝗲𝗱.");
  } else {
    const assigned = new Set();
    for (const section of sections) {
      const members = getSectionCommands(section, commands)
        .filter(command => !assigned.has(command.name));
      lines.push(String(menu.top || "┏━━〔 ") + String(section.title || section.key) +
        String(menu.titleEnd || " 〕━━━━━━━━"));
      if (!members.length) {
        lines.push(String(menu.itemLine || "┃ ┣➤ ") + "(𝗡𝗼 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝘆𝗲𝘁)");
      } else {
        for (const command of members) {
          assigned.add(command.name);
          lines.push(
            String(menu.itemLine || "┃ ┣➤ ") + prefix + command.name +
            (command.description ? " ─ " + command.description : "")
          );
        }
      }
      lines.push(String(menu.bottom || "┗━━━━━━━━━━━━━━━━"), "");
    }

    const ungrouped = commands.filter(command => !command.hidden && !assigned.has(command.name));
    if (ungrouped.length) {
      lines.push("📂 𝗢𝗧𝗛𝗘𝗥");
      for (const command of ungrouped) {
        lines.push(String(menu.itemLine || "┃ ┣➤ ") + prefix + command.name);
      }
    }
  }

  lines.push("⚡ 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗞𝗜𝗡𝗢 𝗠𝗗");
  return lines.join("\n");
}
