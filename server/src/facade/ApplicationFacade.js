import { ApplicationRepository } from "../repositories/ApplicationRepository.js";
import { StatusHistoryRepository } from "../repositories/StatusHistoryRepository.js";
import { AuditLogRepository } from "../repositories/AuditLogRepository.js";
import { ApplicationFactory } from "../factory/ApplicationFactory.js";
import { stateFromStatus } from "../state/state.js";


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
        const app = this.factory.create(dto);
        const created = await this.apps.create(app);

        await this.history.add({
            applicationId: created.id,
            fromStatus: null,
            toStatus: created.current_status,
            note: "Initial status"
        });

        await this.audit.add({
            entityType: "application",
            entityId: created.id,
            action: "CREATE",
            metadata: {
                company: created.company_name,
                role: created.role_title
            }
        });

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
}