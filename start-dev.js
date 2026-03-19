#!/usr/bin/env node

/**
 * Helper script to start the StayFinder development environment
 *
 * Usage:
 *   npm run start:dev     (from both client and server directories)
 *   node start-dev.js     (from project root)
 */

const { spawn } = require("child_process");
const path = require("path");
const os = require("os");

const isWindows = os.platform() === "win32";
const projectRoot = path.resolve(__dirname);
const serverDir = path.join(projectRoot, "server");
const clientDir = path.join(projectRoot, "client");

console.log("\n🚀 Starting StayFinder Development Environment\n");
console.log("📁 Project Root:", projectRoot);
console.log("📁 Server Dir:", serverDir);
console.log("📁 Client Dir:", clientDir);

// Start Backend Server
console.log("\n📦 Starting backend server...\n");
const serverCmd = isWindows ? "npm.cmd" : "npm";
const serverProcess = spawn(serverCmd, ["run", "dev"], {
  cwd: serverDir,
  stdio: "inherit",
  shell: true,
});

serverProcess.on("error", (err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

// Give server a moment to start
setTimeout(() => {
  console.log("\n🎨 Starting frontend client...\n");
  const clientCmd = isWindows ? "npm.cmd" : "npm";
  const clientProcess = spawn(clientCmd, ["start"], {
    cwd: clientDir,
    stdio: "inherit",
    shell: true,
  });

  clientProcess.on("error", (err) => {
    console.error("❌ Failed to start client:", err);
    process.exit(1);
  });

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Shutting down...");
    serverProcess.kill();
    clientProcess.kill();
    process.exit(0);
  });
}, 2000);

console.log("\n✅ Development environment starting...");
console.log("   Backend: http://localhost:5000");
console.log("   Frontend: http://localhost:3000\n");
