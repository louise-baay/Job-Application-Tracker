export class NullCalendarClient {
    async createInterviewEvent(_details) {
        return { eventId: null };
    }

    async updateInterviewEvent(eventId, _details) {
        return { eventId };
    }

    async deleteInterviewEvent(_eventId) {
        return { ok: true };
    }
}