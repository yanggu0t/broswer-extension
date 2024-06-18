import { createRoot } from "react-dom/client";
const div = document.createElement("div");
document.body.appendChild(div);

const root = createRoot(div);
root.render(<></>);

try {
  console.log("... loaded");
} catch (e) {
  console.error(e);
}
