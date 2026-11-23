
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import { API_URL } from "@/lib/api";

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [jwtClient()],
});
