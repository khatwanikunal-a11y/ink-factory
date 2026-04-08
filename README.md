Student Name and Number:
Programme:
Lecturer Name: Paul Laird
Module/Subject Title: Programming for Information Systems (B9IS123)
Assignment Title: The Ink Factory - Tattoo Artist and Portfolio Management System

By submitting this assignment, I am confirming that:
- This assignment is all my own work
- Any sources used have been referenced
- I have followed the Generative AI instructions/scale set out in the Assignment Brief
- I have read the College rules regarding academic integrity in the QAH Part B Section 3, and the Generative AI Guidelines, and understand that penalties will be applied accordingly if work is found not to be my own
- I understand that all work submitted may be code-matched to show any similarities with other work


About

This is a management system built for The Ink Factory, a tattoo studio. It allows staff to manage tattoo artists and their design portfolios through a web interface. The system supports full CRUD operations, search, validation, and pricing estimates.


Live Deployment (AWS Elastic Beanstalk)

The application is deployed on AWS Elastic Beanstalk in the eu-north-1 (Stockholm) region.

- Live URL:      http://kunal-tattoo-env.eba-y2wthbqn.eu-north-1.elasticbeanstalk.com
- Home:          http://kunal-tattoo-env.eba-y2wthbqn.eu-north-1.elasticbeanstalk.com/index.html
- Manage Artists: http://kunal-tattoo-env.eba-y2wthbqn.eu-north-1.elasticbeanstalk.com/artists.html
- Manage Designs: http://kunal-tattoo-env.eba-y2wthbqn.eu-north-1.elasticbeanstalk.com/designs.html

Deployment Details:
- Platform:      Node.js 20 running on 64bit Amazon Linux 2023
- Environment:   kunal-tattoo-env
- Application:   kunal-tattoo
- Region:        eu-north-1 (Stockholm)
- Account ID:    081338829352
- IAM User:      AdminUser

To Redeploy:
1. Install EB CLI: pip install awsebcli
2. Configure AWS credentials: aws configure
3. Deploy: eb deploy kunal-tattoo-env --region eu-north-1


How to Run Locally

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
- Price estimator based on design size, style complexity, and artist experience
- Currency conversion using live exchange rates
- Color palette generator for tattoo designs
- Auto-generated avatar images for artists


API Endpoints

Artists:
- GET    /api/artists              - List all artists
- GET    /api/artists/:id          - Get single artist
- GET    /api/artists/search?q=    - Search artists
- POST   /api/artists              - Create artist
- PUT    /api/artists/:id          - Update artist
- DELETE /api/artists/:id          - Delete artist

Designs:
- GET    /api/designs              - List all designs
- GET    /api/designs/:id          - Get single design
- GET    /api/designs/search?q=    - Search designs
- GET    /api/artists/:id/designs  - Get designs by artist
- POST   /api/designs              - Create design
- PUT    /api/designs/:id          - Update design
- DELETE /api/designs/:id          - Delete design

Pricing:
- GET    /api/pricing/estimate?design_id=1&currency=EUR - Get price estimate


External APIs Used

1. DiceBear Avatars API (https://www.dicebear.com) - Generates avatar images from artist initials. MIT License.
2. The Color API (https://www.thecolorapi.com) - Returns complementary color palettes for tattoo design planning. Free, no key required.
3. Open Exchange Rates API (https://open.er-api.com) - Provides live EUR exchange rates for the pricing estimator. Free tier, no key required.


Testing Summary

artists.test.js (10 tests):
- Create artist with valid data
- Create artist with missing name
- Create artist with negative years_exp
- Get all artists
- Get single artist by ID
- Get artist by non-existent ID
- Update artist
- Update non-existent artist
- Delete artist
- Delete non-existent artist

designs.test.js (8 tests):
- Create design with valid artist
- Create design with non-existent artist
- Create design with invalid size
- Get all designs
- Get designs by artist ID
- Update design
- Delete design
- Search designs by title

integration.test.js (1 test):
- Full workflow: create artist, create design, read portfolio, update design, delete artist, verify cascade delete

frontend.integration.test.js (3 tests):
- Real HTTP server with native fetch: create and read artist
- Create design, load portfolio, update, delete, verify deletion
- Price estimate request and response validation


Attributions

- Express (https://expressjs.com) - MIT License - Web framework for Node.js
- Jest (https://jestjs.io) - MIT License - Testing framework
- Supertest (https://github.com/ladjs/supertest) - MIT License - HTTP assertion library
- CORS middleware (https://github.com/expressjs/cors) - MIT License - Cross-origin resource sharing
- DiceBear (https://www.dicebear.com) - MIT License - Avatar generation
- The Color API (https://www.thecolorapi.com) - Free public API - Color scheme generation
- Open Exchange Rates (https://open.er-api.com) - Free public API - Currency exchange rates
