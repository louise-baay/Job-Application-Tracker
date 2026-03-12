import { pool } from "../db.js";

export class StatusHistoryRepository {
    async add({ applicationId, fromStatus, toStatus, note}){
        try{
            const { rows } = await pool.query(`
                INSERT INTO status_history (application_id, from_status, to_status, note)
                VALUES ($1, $2, $3, $4)
                RETURNING *;`, [applicationId, fromStatus ?? null, toStatus, note ?? null]);

            console.log("STATUS_HISTORY RESULT: ", rows[0]);
            return rows[0];
        } catch (err) {
            console.error("STATUS_HISTORY ERROR: ", err.message);
            throw err;
        }
    }

    async listForApplication(applicaation_id) {
        const { rows } = await pool.query(`
            SELECT * FROM status_history
            WHERE application_id = $1
            ORDER BY changed_at ASC`, [applicaation_id]);
        
        return rows;
    }
}