
About

This is a management system built for The Ink Factory, a tattoo studio. It allows staff to manage tattoo artists and their design portfolios through a web interface. The system supports full CRUD operations, search, validation, and pricing estimates.


How to Run

1. Install dependencies: npm install
2. Start the server: npm start
3. Open http://127.0.0.1:3000 in a browser


How to Test

Run: npm test

This runs 22 automated tests across 4 test suites using Jest.


Tech Stack

- Backend: Node.js, Express
- Frontend: HTML, CSS, vanilla JavaScript
- Storage: JSON file (tattoo.json)
- Testing: Jest, Supertest


Features

CRUD Operations:
- Create, read, update, delete artists
- Create, read, update, delete designs
- Cascade delete (removing an artist deletes their designs)

Search:
- Search artists by name or speciality
- Search designs by title or style

Validation:
- Required fields enforced on backend
- Length limits on text fields
- Integer and range checks on numeric fields
- Enum validation on design size (small, medium, large)
- Foreign key check (design must reference an existing artist)

Sorting:
- All lists returned sorted by ID

Additional Features:
