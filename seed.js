const db = require("./database");

const internships = [
    {
        title:"Frontend Intern",
        domain:"Full Stack Development",
        mode:"Remote",
        location:"India",
        skills:["HTML", "CSS", "JavaScript" ],
        openings:3
    },

    {
        title:"API Engineering Intern",
         domain:"Full Stack Development",
        mode:"Hybrid",
        location:"Pune",
        skills:["Node.js", "SQL", "Testing"],
        openings:2

    },

    {
        title:"UI/UX Intern",
         domain:"UI/UX",
        mode:"Remote",
        location:"India",
        skills:["Figma", "Research", "Accessibility"],
        openings:2

    },
    {
        title:"Data Analyst Intern",
         domain:"Data Analyst",
        mode:"On-site",
        location:"Bengaluru",
        skills:["Excel", "SQL", "Data Visualization"],
        openings:2

    },

    {
        title:" Security Operations Intern",
         domain:"Fcyber security",
        mode:"Remote",
        location:"India",
        skills:["Linux", "Logs", "Networking"],
        openings:1
        

    }
];

const insert = db.prepare(`
    INSERT INTO internships
    (title, domain, mode, location, skills, openings)
    VALUES (?, ?, ?, ?, ?, ?)
`);

for (const internship of internships) {
    insert.run(
        internship.title,
        internship.domain,
        internship.mode,
        internship.location,
        JSON.stringify(internship.skills),
        internship.openings
    );
}

console.log("Internship seed data inserted successfullu!");

db.close();