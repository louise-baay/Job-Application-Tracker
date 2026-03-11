import { pool } from "../db,js";

export class StatusHistoryRepository {
    async add({ applicationId, fromStatus, toStatus, note}){
        const { rows } = await pool.query(`
            INSERT INTO status_history (applicaation_id, from_status, to_status, note)
            VALUES ($1, $2, $3, $5)
            RETURNING *;`, [applicationId, fromStatus ?? null, toStatus, note ?? null]);

        return rows[0];
    }

    async listForApplication(applicaation_id) {
        const { rows } = await pool.query(`
            SELECT * FROM status_history
            WHERE application_id = $1
            ORDER BY changed_at ASC`, [applicaation_id]);
        
        return rows;
    }
}