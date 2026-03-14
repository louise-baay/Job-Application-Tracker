import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { applicationsRouter } from "./routes/application.js";
import { EmailService } from "./services/EmailService.js";

dotenv.config();
const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use("/", express.static(path.join(__dirname, "../../public")));
 
// API routes
app.use("/api/applications", applicationsRouter);


const emailService = new EmailService();

app.get("/test-email", async (_req, res) => {
    try {
        await emailService.sendInterviewScheduledEmail({
            companyName: "Test Company",
            roleTitle: "Test Role",
            start: "2026-03-20T15:00:00Z",
            end: "2026-03-20T16:00:00Z",
            notes: "This is a test"
        });

        res.send("Email sent"); 
    } catch (e) {
        console.error("Test email failed:", e);
        res.status(500).send(e.message);
    }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Job Tracker running at http://localhost:${port}`);
});