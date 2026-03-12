import { pool } from "../db.js";

export class AuditLogRepository{
    async add({ entityType, entityId, action, metadata }){
        const { rows } = await pool.query(`
            INSERT INTO audit_log (entity_type, entity_id, action, metadata_json)
            VALUES ($1, $2, $3, $4)
            RETURNING *;`, [entityType, entityId, action, metadata ? JSON.stringify(metadata) : null]);

        return rows[0];
    }
}