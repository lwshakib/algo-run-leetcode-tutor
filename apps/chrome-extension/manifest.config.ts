import { defineManifest } from "@crxjs/vite-plugin"
import pkg from "./package.json" with { type: "json" }

export default defineManifest({
  manifest_version: 3,
  name: pkg.extension_name,
  description: pkg.extension_description,
  version: pkg.version,
  icons: {
    "16": "public/icons/icon16.png",
    "32": "public/icons/icon32.png",
    "48": "public/icons/icon48.png",
    "128": "public/icons/icon128.png",
  },
  side_panel: {
    default_path: "src/sidepanel/index.html",
  },
  web_accessible_resources: [
    { resources: ["logos/logo.svg"], matches: ["<all_urls>"] },
  ],
  permissions: ["storage", "sidePanel"],
  action: {
    default_popup: "src/popup/index.html",
  },
  content_scripts: [
    {
      js: ["src/content/main.tsx"],
      matches: ["https://leetcode.com/problems/*"],
    },
  ],
})
