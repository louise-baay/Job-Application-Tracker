import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use("/", express.static(path.join(__dirname, "../../public")));
 
// API routes
//app.use("/api/applications", applicationsRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Job Tracker running at http://localhost:${port}`);
});