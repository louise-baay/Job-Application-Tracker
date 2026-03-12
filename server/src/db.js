import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

/*export const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_Mn19NiXcHUdt@ep-aged-shape-aip1p8be-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {rejectUnauthorized: false}
});

async function test(){

  //inserting a row
  const insertRes = await pool.query(
    `INSERT INTO applications
    (company_name, role_title, job_url, notes, salary_min, salary_max, current_status, date_applied)
    VALUES ('Cool Company', 'Cool title', 'coolJob.com/job', 'Demonstrating how db works in cloud', '100', '200', 'Applied', '2026-03-01')
    RETURNING *;`
  );

  console.log("Inserted row: ", insertRes.rows[0]);

  const check = await pool.query(`SELECT * FROM applications;`);
  console.log("All rows:", check.rows);

  await pool.end();
}

test().catch(console.error);*/

export const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_Mn19NiXcHUdt@ep-aged-shape-aip1p8be-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});