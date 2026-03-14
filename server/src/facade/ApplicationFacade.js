import { ApplicationRepository } from "../repositories/ApplicationRepository.js";
import { StatusHistoryRepository } from "../repositories/StatusHistoryRepository.js";
import { AuditLogRepository } from "../repositories/AuditLogRepository.js";
import { ApplicationFactory } from "../factory/ApplicationFactory.js";
import { stateFromStatus } from "../state/state.js";
import { EmailService } from "../services/EmailService.js";
import { calendar } from "googleapis/build/src/apis/calendar/index.js";


/**
 * FACADE pattern
 * Controllers calls this class and coordinates
 * - Application repo
 * - Status history
 * - audit logs
 */

export class ApplicationFacade {
    constructor() {
        this.apps = new ApplicationRepository();
        this.history = new StatusHistoryRepository();
        this.audit = new AuditLogRepository();
        this.factory = new ApplicationFactory();
        this.email = new EmailService();
    }
    
    /**
     * Create Appliation
     * list application
     * get the application details
     * update application
     * delete application
     * change status
     * schedule interview
     * clear interview
     * report pipeline
     */

    async createApplication(dto){
        console.log("step 1: ", dto);
        const app = this.factory.create(dto);
        console.log("step 2: ", dto);
        const created = await this.apps.create(app);

        console.log("step 3: ", dto);

        try{
            await this.history.add({
                applicationId: created.id,
                fromStatus: null,
                toStatus: created.current_status,
                note: "Initial status"
            });
            console.log("step 4: ", dto);
        } catch (err) {
            console.error("step 4 error: ", err.message);
            throw err;
        }

        try {
            await this.audit.add({
            entityType: "application",
            entityId: created.id,
            action: "CREATE",
            metadata: {
                company: created.company_name,
                role: created.role_title
            }
        });
            console.log("step 5: ", dto);
        } catch (err) {
            console.error("step 5 error: ", err.message);
            throw err;
        }
        
        return created;
    }

    async listApplication(query){
        return this.apps.list(query);
    }

    async updateApplication(id, patch){
        const updated = await this.apps.update(id, patch);
        if(!updated) return null;

        await this.audit.add({
            entityType: "application",
            entityId: updated.id,
            action: "UPDATE",
            metadata: { fields: Object.keys(patch) }
        });

        return updated;
    }

    async deleteApplication(id) {
        const deleted = await this.apps.delete(id);
        if(!deleted) return null;

        await this.audit.add({
            entityType: "application",
            entityId: id,
            action: "DELETE",
            metadata: { company: deleted.company_name, role: deleted.role_title }
        });

        return deleted;
    }

    async changeStatus(id, { nextStatus, note }){
        const app = await this.apps.getById(id);
        if(!app) return null;

        const currentState = stateFromStatus(app.current_status);

        if(!currentState.canTransitionTo(nextStatus)){
            throw new Error(`Invalid transition: ${app.current_status} -> ${nextStatus}`);
        }

        const updated = await this.apps.updateStatusAndInterviewFields(id, {currentStatus: nextStatus });

        await this.history.add({
            applicationId: id,
            fromStatus: app.current_status,
            toStatus: nextStatus,
            note
        });

        await this.audit.add({
            entityType: "application",
            entityId: id,
            action: "STATUS_CHANGE",
            metadata: {
                from: app.current_status,
                to: nextStatus
            }
        });

        return updated;
    }

    async pipelineReport(){
        return this.apps.pipelineReport();
    }

    async getApplicationDetails(id) {
        const app = await this.apps.getById(id);
        if (!app) return null;

        const history = await this.history.listForApplication(id);
        return { app, history };
    }

    async scheduleInterview(id, {start, end, note}) {
        const app = await this.apps.getById(id);
        if(!app) return null;

        const updated = await this.apps.updateStatusAndInterviewFields(id, {
            interviewStart: start,
            interviewEnd, end,
            calendarEventId: null
        });

        await this.audit.add({
            entityType: "application",
            entityId: id,
            action: "SCHEDULE_INTERVIEW",
            metadata: { start, end }
        });

        await this.email.sendInterviewScheduledEmail({
            company_name: app.company_name,
            role_title: app.role_title,
            notes: note ?? app.notes ?? "",
            start,
            end
        });
        
        return updated;
    }

    async clearInterview(id) {
        const app = await this.apps.getById(id);
        if(!app) return null;

        const updated = await this.apps.updateStatusAndInterviewFields(id, {
            interviewStart: null,
            interviewEnd,
            calendarEventId: null
        });

        await this.audit.add({
            entityType: "application",
            entityId: id,
            action: "CLEAR_INTERVIEW",
            metadata: {}
        });

        return updated;
    }
}

