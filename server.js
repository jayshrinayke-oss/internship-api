const express = require("express");
const db = require("./database");

const app = express();

app.use(express.json());

const PORT = 3000;

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Internship API is running"
    });
});

// Get all internships with pagination
app.get("/api/internships", (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page < 1 || limit < 1) {
        return res.status(400).json({
            success: false,
            message: "Page and limit must be positive numbers"
        });
    }

    const offset = (page - 1) * limit;

    const total = db
        .prepare("SELECT COUNT(*) AS count FROM internships")
        .get().count;

    const internships = db
        .prepare(`
            SELECT * FROM internships
            LIMIT ? OFFSET ?
        `)
        .all(limit, offset);

    const data = internships.map((internship) => ({
        ...internship,
        skills: JSON.parse(internship.skills)
    }));

    res.json({
        success: true,
        data: data,
        pagination: {
            page: page,
            limit: limit,
            total: total,
            totalPages: Math.ceil(total / limit)
        }
    });
});

app.get("/api/internships/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid internship ID"
        });
    }

    const internship = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(id);

    if (!internship) {
        return res.status(404).json({
            success: false,
            message: "Internship not found"
        });
    }

    internship.skills = JSON.parse(internship.skills);

    res.json({
        success: true,
        data: internship
    });
});

app.post("/api/internships", (req, res) => {
    const { title, domain, mode, location, skills, openings } = req.body;

    if (
        !title ||
        !domain ||
        !mode ||
        !location ||
        !Array.isArray(skills) ||
        skills.length === 0 ||
        !Number.isInteger(openings) ||
        openings < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid internship data"
        });
    }

    const result = db
        .prepare(`
            INSERT INTO internships
            (title, domain, mode, location, skills, openings)
            VALUES (?, ?, ?, ?, ?, ?)
        `)
        .run(
            title,
            domain,
            mode,
            location,
            JSON.stringify(skills),
            openings
        );

    const newInternship = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(result.lastInsertRowid);

    newInternship.skills = JSON.parse(newInternship.skills);

    res.status(201).json({
        success: true,
        message: "Internship created successfully",
        data: newInternship
    });
});

app.put("/api/internships/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, domain, mode, location, skills, openings } = req.body;

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid internship ID"
        });
    }

    if (
        !title ||
        !domain ||
        !mode ||
        !location ||
        !Array.isArray(skills) ||
        skills.length === 0 ||
        !Number.isInteger(openings) ||
        openings < 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid internship data"
        });
    }

    const existingInternship = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(id);

    if (!existingInternship) {
        return res.status(404).json({
            success: false,
            message: "Internship not found"
        });
    }

    db.prepare(`
        UPDATE internships
        SET title = ?,
            domain = ?,
            mode = ?,
            location = ?,
            skills = ?,
            openings = ?
        WHERE id = ?
    `).run(
        title,
        domain,
        mode,
        location,
        JSON.stringify(skills),
        openings,
        id
    );

    const updatedInternship = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(id);

    updatedInternship.skills = JSON.parse(updatedInternship.skills);

    res.json({
        success: true,
        message: "Internship updated successfully",
        data: updatedInternship
    });
});

app.delete("/api/internships/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid internship ID"
        });
    }

    const internship = db
        .prepare("SELECT * FROM internships WHERE id = ?")
        .get(id);

    if (!internship) {
        return res.status(404).json({
            success: false,
            message: "Internship not found"
        });
    }

    db.prepare("DELETE FROM internships WHERE id = ?").run(id);

    res.json({
        success: true,
        message: "Internship deleted successfully"
    });
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});