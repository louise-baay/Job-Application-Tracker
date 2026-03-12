import { pool } from "../db.js";

export class AuditLogRepository{
    async add({ entityType, entityId, action, metadata }){

        try {
            const { rows } = await pool.query(`
                INSERT INTO audit_log (entity_type, entity_id, action, metadata_json)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`, [entityType, entityId, action, metadata ? JSON.stringify(metadata) : null]);

            console.log("AUDIT_LOG RESULT: ", rows[0]);
            return rows[0];

        } catch (err) {
            console.error("AUDIT_LOG ERROR: ", err.message);
            throw err;
        }
    }
}