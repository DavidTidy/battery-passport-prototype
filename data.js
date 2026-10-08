/*
  Dummy battery passport data for the prototype.
  ALL VALUES ARE ILLUSTRATIVE. Verify field list against Regulation (EU) 2023/1542,
  Annex XIII, and the EN 182xx standards before using this structure for real.

  Field shapes:
    ["Label", "Value"]                       simple row
    ["Label", "Value", "Hint text"]          row with a small note
    { label, value, meter: 0-100 }           row with a bar (e.g. state of health)
    { label, value, link: "url" }            row with a link
*/
window.PASSPORT = {
  meta: {
    product: "Brompton Electric battery",
    variant: "300 Wh · 36 V",
    passportId: "BP-EU-24-000187-DEMO",
    identifier: "https://id.example.com/01/05099999000017/21/BE24000187",
    serial: "BE24000187",
    status: "In use",
    version: "1.0",
    lastUpdated: "30 Sep 2026",
  },

  /* -------- PUBLIC TIER (anyone who scans the QR) -------- */
  public: [
    {
      id: "identity",
      title: "Identification",
      summary: "Who made it, what it is and when",
      fields: [
        ["Manufacturer", "Brompton Bicycle Ltd (dummy address), London, UK"],
        ["Battery category", "Light means of transport (LMT) battery"],
        ["Model", "Brompton Electric 300 Wh"],
        ["Serial number", "BE24000187"],
        ["Place of manufacture", "Example Factory, EU (dummy)"],
        ["Date of manufacture", "March 2024"],
        ["Weight", "2.9 kg"],
        ["Unique identifier", "GS1 Digital Link (dummy)", "ISO/IEC 15459 or GS1 Digital Link"],
      ],
    },
    {
      id: "materials",
      title: "Materials and chemistry",
      summary: "What's inside and what's hazardous",
      fields: [
        ["Chemistry", "Lithium-ion (NMC)"],
        ["Critical raw materials", "Cobalt, lithium, natural graphite, nickel"],
        ["Hazardous substances", "Electrolyte salts (LiPF₆) — do not open or puncture"],
      ],
    },
    {
      id: "sustainability",
      title: "Carbon footprint and recycled content",
      summary: "Environmental impact of making this battery",
      fields: [
        ["Carbon footprint", "68 kg CO₂e per kWh", "Lifecycle, excluding use phase"],
        ["Carbon footprint class", "Class B", "Illustrative — class scheme to be confirmed"],
        { label: "Recycled cobalt", value: "16%", meter: 16 },
        { label: "Recycled lithium", value: "6%", meter: 6 },
        { label: "Recycled nickel", value: "6%", meter: 6 },
        ["Renewable content", "Not declared"],
      ],
    },
    {
      id: "performance",
      title: "Performance and durability",
      summary: "How long it should last",
      fields: [
        ["Rated capacity", "8.4 Ah (300 Wh)"],
        ["Nominal voltage", "36 V (min. 30 V)"],
        ["Expected lifetime", "800 full charge cycles"],
        ["End of first life threshold", "70% of rated capacity"],
        ["Operating temperature", "0 °C to 40 °C"],
        ["Commercial warranty", "2 years"],
      ],
    },
    {
      id: "eol",
      title: "End of life and recycling",
      summary: "How to return it when you're done",
      fields: [
        ["Do not bin", "Never put this battery in household waste. It must be collected separately."],
        ["Take-back", "Return free of charge to any Brompton store or authorised dealer"],
        ["Repair and second life", "Ask an authorised dealer whether repair or reuse is possible first"],
        { label: "Find a collection point", value: "Store finder (dummy link)", link: "#" },
      ],
    },
    {
      id: "compliance",
      title: "Compliance documents",
      summary: "Declarations and reports",
      fields: [
        { label: "EU declaration of conformity", value: "Download PDF (dummy)", link: "#" },
        { label: "Due diligence report", value: "View report (dummy)", link: "#" },
        ["Economic operator", "To be confirmed (Brompton, EU importer or authorised representative)"],
      ],
    },
  ],

  /* -------- RESTRICTED TIERS (sign-in required) -------- */
  roles: {
    repairer: { label: "Repairer", tier: "Legitimate interest" },
    secondlife: { label: "Second-life operator", tier: "Legitimate interest" },
    recycler: { label: "Recycler", tier: "Legitimate interest" },
    authority: { label: "Market surveillance authority", tier: "Authority" },
  },

  restricted: [
    {
      id: "health",
      title: "State of health",
      summary: "Live data from this battery",
      roles: ["repairer", "secondlife", "recycler", "authority"],
      fields: [
        { label: "State of health", value: "91%", meter: 91 },
        ["Remaining capacity", "7.6 Ah (273 Wh)"],
        ["Full charge cycles", "212"],
        ["Negative events", "1 — deep discharge (12 Jan 2026)"],
        ["Time at extreme temperature", "3 h above 40 °C"],
        ["Status", "In use — suitable for continued use"],
        ["Data last received", "29 Sep 2026"],
      ],
    },
    {
      id: "composition",
      title: "Detailed composition",
      summary: "Cell and material breakdown",
      roles: ["repairer", "secondlife", "recycler", "authority"],
      fields: [
        ["Cell type", "21700 cylindrical, 10S3P"],
        ["Cathode", "NMC 811"],
        ["Anode", "Graphite with silicon oxide"],
        ["Electrolyte", "LiPF₆ in organic carbonates"],
        ["Casing", "Aluminium alloy, PC/ABS end caps"],
      ],
    },
    {
      id: "dismantling",
      title: "Dismantling and spare parts",
      summary: "How to take it apart safely",
      roles: ["repairer", "secondlife", "recycler", "authority"],
      fields: [
        { label: "Exploded diagram", value: "Open diagram (dummy)", link: "#" },
        ["Disassembly sequence", "1. Discharge to < 10% · 2. Remove end cap (T20) · 3. Disconnect BMS · 4. Slide out cell pack"],
        ["Tools required", "Torx T20, insulated pliers, plastic spudger"],
        ["Spare parts", "BMS board, end cap, connector — order via dealer portal (dummy)"],
        ["Safety measures", "Insulated tools and gloves. Isolate damaged packs in a sand-filled container."],
      ],
    },
    {
      id: "tests",
      title: "Test reports",
      summary: "Evidence of compliance",
      roles: ["authority"],
      fields: [
        { label: "Carbon footprint study", value: "Report CF-2024-031 (dummy)", link: "#" },
        { label: "Safety test report (EN 50604-1)", value: "Report ST-2024-118 (dummy)", link: "#" },
        { label: "Performance test report", value: "Report PT-2024-077 (dummy)", link: "#" },
      ],
    },
  ],
};
