import { defineConfig } from "wxt";

export default defineConfig({
  extensionApi: "chrome",
  manifest: {
    name: "DS Pulse",
    description: "Design system linter — scan pages for Apex UI drift.",
    permissions: ["activeTab", "scripting", "sidePanel"],
    host_permissions: ["<all_urls>"],
    action: {},
    web_accessible_resources: [
      {
        resources: ["tokens.json"],
        matches: ["<all_urls>"],
      },
    ],
  },
});