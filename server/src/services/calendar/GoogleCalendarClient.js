import { google } from "googleapis";

//GOOGLE_REFRESH_TOKEN=1//01ulTh5WUIxozCgYIARAAGAESNwF-L9IrM2qYCagS4x1Ikz6u3MWDm4hEs-NusWpM5unPdzjXba44Gji0W9kegE9bf18FFvSdQhE
//GOOGLE_CLIENT_ID=409445016980-hu62r4o1lhctnfgdkb5fpal5kqn90g1k.apps.googleusercontent.com
//GOOGLE_SECRET=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
//GOOGLE_CALENDAR_ID=primary

export class GoogleCalendarClient {
    constructor(){
        const oauth2Client = new google.auth.OAuth2(
            "409445016980-hu62r4o1lhctnfgdkb5fpal5kqn90g1k.apps.googleusercontent.com",
            "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",
            "http://localhost"
        );

        oauth2Client.setCredentials({
            refresh_token: "1//01ulTh5WUIxozCgYIARAAGAESNwF-L9IrM2qYCagS4x1Ikz6u3MWDm4hEs-NusWpM5unPdzjXba44Gji0W9kegE9bf18FFvSdQhE"
        });

        this.calendar = google.calendar({
            version: "v3",
            auth: oauth2Client
        });
    }

    async createInterviewEvent(details){
        const response = await this.calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary: `Interview - ${details.company_name}`,
                description: `${details.role_title}\n${details.notes ?? ""}`,
                start: {
                    dateTime: details.interview_start
                },
                end: {
                    dateTime: details.interview_end
                }
            }
        });

        return {
            eventId: response.data.id
        };
    }

    async updateInterviewEvent(eventId, details) {
        const response = await this.calendar.events.patch({
            calendarId: "primary",
            eventId,
            requestBody: {
                summary: `Interview - ${details.company_name}`,
                description: `${details.role_title}\n${details.notes ?? ""}`,
                start: {
                    dateTime: details.interview_start
                },
                end: {
                    dateTime: details.interview_end
                }
            }
        });

        return {
            eventId: response.data.id
        };
    }

    async deleteInterviewEvent(eventId) {
        await this.calendar.events.delete({
            calendarId: "primary",
            eventId
        });

        return { ok: true };
    }
}