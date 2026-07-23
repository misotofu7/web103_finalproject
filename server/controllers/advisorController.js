import { pool } from '../config/database.js'

const getAdvisors = async (req, res) => {
    try {
        const results = await pool.query(`
            SELECT *
            FROM advisors
            ORDER BY advisor_id ASC
        `)

        res.status(200).json(results.rows)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const getAdvisorById = async (req, res) => {
    try {
        const advisorId = Number(req.params.advisorId)

        if (!Number.isInteger(advisorId)) {
            return res.status(400).json({ message: 'Invalid advisor ID' })
        }

        const results = await pool.query(
            `
                SELECT *
                FROM advisors
                WHERE advisor_id = $1
            `,
            [advisorId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Advisor not found' })
        }

        res.status(200).json(results.rows[0])
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const createAdvisor = async (req, res) => {

    try {
        const {
            university_id,
            first_name,
            last_name,
            email,
            department,
            office
        } = req.body

        const universityId = Number(university_id);

        if (
            !Number.isInteger(universityId) ||
            !first_name?.trim() ||
            !last_name?.trim() ||
            !email?.trim()
        ) {
            return res.status(400).json({
                message:
                    "university_id, first_name, last_name, and email are required",
            });
        }

        const results = await pool.query(
            `
                INSERT INTO advisors (university_id, first_name, last_name, email, office)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `,
            [
                universityId,
                first_name.trim(),
                last_name.trim(),
                email.trim().toLowerCase(),
                office?.trim() || null
            ]
        )

        res.status(201).json(results.rows[0])
    } catch (err) {
        // 23503 is foreign key violation, which means the university_id does not exist in the universities table
        if (err.code === "23503") {
            return res.status(400).json({
                message: "University does not exist",
            })
        }

        // 23505 is unique violation, which means the email already exists in the advisors table
        if (err.code === "23505") {
            return res.status(409).json({
                message: "An advisor with that email already exists",
            });
        }

        console.error(err);

        // 500 is internal server error, which means something went wrong on the server side
        return res.status(500).json({
            message: "Unable to create advisor",
        });
    }
}

const updateAdvisor = async (req, res) => {
    try {
        const advisorId = Number(req.params.advisorId)

        if (!Number.isInteger(advisorId)) {
            return res.status(400).json({
                message: "Invalid advisor ID",
            });
        }

        const {
            university_id,
            first_name,
            last_name,
            email,
            office
        } = req.body

        const universityId =
            university_id === undefined
                ? null
                : Number(university_id);

        if (
            university_id !== undefined &&
            !Number.isInteger(universityId)
        ) {
            return res.status(400).json({
                message: "Invalid university ID",
            });
        }

        const results = await pool.query(
            `
                UPDATE advisors
                SET university_id = COALESCE($1, university_id),
                    first_name = COALESCE($2, first_name),
                    last_name = COALESCE($3, last_name),
                    email = COALESCE($4, email),
                    office = COALESCE($5, office)
                WHERE advisor_id = $6
                RETURNING *
            `,
            [
                universityId,
                first_name?.trim() || null,
                last_name?.trim() || null,
                email?.trim().toLowerCase() || null,
                office?.trim() || null,
                advisorId,
            ],
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Advisor cannot be created' })
        }

        res.status(200).json(results.rows[0])
    } catch (err) {
        if (err.code === "23503") {
            return res.status(400).json({
                message: "University does not exist",
            });
        }

        if (err.code === "23505") {
            return res.status(409).json({
                message: "An advisor with that email already exists",
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Unable to update advisor",
        });
    }
}

const deleteAdvisor = async (req, res) => {
    try {
        const advisorId = Number(req.params.advisorId)

        if (!Number.isInteger(advisorId) || advisorId <= 0) {
            return res.status(400).json({
                message: "Invalid advisor ID",
            });
        }

        const results = await pool.query(
            `
                DELETE FROM advisors
                WHERE advisor_id = $1
                RETURNING *
            `,
            [advisorId]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ message: 'Advisor cannot be deleted' })
        }

        res.status(200).json({
            message: 'Advisor deleted successfully',
            deletedAdvisor: results.rows[0]
        })
    } catch (err) {
        // occurs when reviews still reference advisor
        if (err.code === "23503") {
            return res.status(409).json({
                message:
                "Advisor cannot be deleted because reviews are associated with them",
            });
        }

        console.error(err);

        return res.status(500).json({
            message: "Unable to delete advisor",
        });
    }
}

export default {
  getAdvisors,
  getAdvisorById,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor
}