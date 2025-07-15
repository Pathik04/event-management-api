Event Management API
A RESTful API for creating events and managing user registrations, built with Node.js, Express, TypeScript, and PostgreSQL.

Getting Started
bash
Copy
Edit
git clone https://github.com/Pathik04/event-management-api.git
cd event-management-api
cp .env.example .env
npm install
npm run dev
Run migrations:

bash
Copy
Edit
psql -U your_user -d event_api -f src/db/migrations/001_create_users.sql
psql -U your_user -d event_api -f src/db/migrations/002_create_events.sql

Endpoints
POST /events – Create event

GET /events/:id – Get event with users

POST /events/:id/register – Register user

DELETE /events/:id/register – Cancel registration

GET /events/upcoming – Upcoming events

GET /events/:id/stats – Event stats
