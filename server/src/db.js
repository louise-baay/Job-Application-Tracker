import pg from "pg";
import dotenv from "dotenv";//just makes it look cleaner, prob will remove later and just use the database string here.
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: "postgres://postgres:password@localhost:5432/jobtracker"
});

async function test(){
  const res = await pool.query(`
    INSERT INTO applications
    (company_name, role_title, current_status)
    VALUES ('Google', 'SWE Intern', 'Interested')
    RETURNING *;`);

    console.log("Inserted row: ", res.rows[0]);

    const check = await pool.query(`SELECT * FROM applications;`);
    console.log("All rows:", check.rows);

    await pool.end();
}

test().catch(console.error);