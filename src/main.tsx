import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found!");
  }
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
  document.getElementById("root")!.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error Loading App</h1>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <p>Check the console for more details.</p>
    </div>
  `;
}
