import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const httpsConfig =
  process.env.DISABLE_HTTPS === "true"
    ? undefined
    : { key: "./certs/key.pem", cert: "./certs/cert.pem" };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsConfig,
    port: 3000,
    host: true,
    strictPort: true,
    allowedHosts: ["localhost", "freelance-marketplace.pp.ua"],
  },
});
