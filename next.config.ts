
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://equipment-rental-platform-server.onrender.com/api/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
