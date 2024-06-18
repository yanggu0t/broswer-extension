import type { Manifest } from "webextension-polyfill";
import pkg from "../package.json";

const manifest: Manifest.WebExtensionManifest = {
  manifest_version: 3,
  name: pkg.displayName,
  version: pkg.version,
  description: pkg.description,
  options_ui: {
    page: "src/pages/options/index.html",
  },
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-32.png",
  },
  // rewrite newtab content to custom page
  // chrome_url_overrides: {
  //   newtab: "src/pages/newtab/index.html",
  // },
  devtools_page: "src/pages/devtools/index.html",
  // @ts-ignore
  side_panel: {
    default_path: "src/pages/panel/index.html",
  },
  icons: {
    "16": "icon-16.png",
    "32": "icon-32.png",
    "128": "icon-128.png",
  },
  permissions: ["activeTab", "sidePanel", "declarativeNetRequest"],
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],
      css: ["contentStyle.css"],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "contentStyle.css",
        "icon-128.png",
        "icon-32.png",
        "icon-16.png",
      ],
      matches: [],
    },
  ],
  declarative_net_request: {
    rule_resources: [
      {
        id: "ruleset_1",
        enabled: true,
        path: "rules.json", // Assuming rules.json will be in the same directory as manifest.json
      },
    ],
  },
};

export default manifest;
