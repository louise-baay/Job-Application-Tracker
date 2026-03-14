import { NullCalendarClient } from "./NullCalendarClient.js";
import { GoogleCalendarClient } from "./GoogleCalendarClient.js";

export function buildCalendarClient() {
    const mode = ("primary" ?? "none").toLowerCase();

    if (mode === "google") {
        return new GoogleCalendarClient();
    }

    return new NullCalendarClient();
}