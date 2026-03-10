import { pool } from "../db.js";

export class ApplicationRepository {
    async create(app) {
        const query = `
            INSERT INTO applications
            (
                company_name, role_title, job_url, notes,
                salary_min, salary_max, current_status,
                date_applied, interview_start, interview_end, calendar_event_id
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
            RETURNING *;
        `;

        const values = [
            app.companyName,
            app.roleTitle,
            app.jobUrl,
            app.notes,
            app.salaryMin,
            app.salaryMax,
            app.currentStatus,
            app.dateApplied,
            app.interviewStart,
            app.interviewEnd,
            app.calendarEventId
        ];
        
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    async getById(id) {
        const { rows } = await pool.query(
            `SELECT * FROM applications WHERE id = $1`,
            [id]
        );
        return rows [0] ?? null;
    }

    async list ({ status, search, sortBy}){
        const clauses = [];
        const values = [];
        let i = 1;

        if(status){
            clauses.push(`current_status = $${i++}`);
            values.push(status);
        }

        if(search){
            clauses.push(`(company_name ILIKE $${i} OR role_title ILIKE $${i})`);
            values.push(`%${search}%`);
            i++;
        }

        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";

        let orderBy = "updated_at DESC";
        if(sortBy === "applied"){
            orderBy = "date_applied DESC NULLS LAST, updated_at DESC";
        } else if (sortBy === "created"){
            orderBy = "created_at DESC";
        }

        const { rows } = await pool.query(`
            SELECT * FROM applications
            ${WHERE}
            ORDER BY ${orderBy};`, values);

        return rows;
    }

    async update(id, patch){
        const query = `
        UPDATE applications
        SET company_name = COALESCE($2, company_name),
            role_title = COALESCE($3, role_title),
            job_url = COALESCE($4, job_url),
            notes = COALESCE($5, notes),
            salary_min = COALESCE($6, salary_min),
            salary_max = COALESCE($7, salary_max),
            date_applied = COALESCE($8, date_applied),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
        `;

        const values = [
            id,
            patch.companyName ?? null,
            patch.roleTitle ?? null,
            patch.jobUrl ?? null,
            patch.notes ?? null,
            patch.salaryMin ?? null,
            patch.salaryMax ?? null,
            patch.dateApplied ?? null
        ];

        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }

    async updateStatusAndInterviewFields(id, fields){
        const query = `
        UPDATE applications
        SET current_status = COALESCE($2, current_status),
            interview_start = COALESCE($3, interview_start),
            interview_end = COALESCE($4, interview_end),
            calendar_event_id = COALESCE($5, calendar_event_id),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *;
        `;

        const values = [
            id,
            fields.currentStatus ?? null,
            fields.interviewStart ?? null,
            fields.interviewEnd ?? null,
            fields.calendarEventId ?? null
        ];

        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }

    async delete(id) {
        const { rows } = await pool.query(
            `DELETE FROM applications WHERE id = $1 RETURNING *`,
            [id]
        );
        return rows[0] ?? null;
    }

    async pipelineReport(){
        const { rows } = await pool.query(
            `SELECT current_status, COUNT(*)::int AS count
            FROM applications
            GROUP BY current_status
            ORDER BY current_status;`
        );
        return rows;
    }
}