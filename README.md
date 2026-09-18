# VIT Bhopal Campus Twin 🏛️

An interactive digital campus guide for VIT Bhopal University. It helps students, freshers, faculty, and visitors find their way around campus, locate faculty cabins across floors, and keep up with verified club events and campus notices.

👉 **Live Demo:** [https://vitbhopalcampus.vercel.app](https://vitbhopalcampus.vercel.app)

---

## Why We Built This

If you've spent any time on campus, you know the struggle:
- **Finding faculty cabins**: Wandering around academic blocks trying to figure out which wing or floor a professor's cabin is on.
- **Navigating the campus**: Getting between academic blocks, hostels, food courts, and sports facilities without getting lost.
- **Event overload**: Missing hackathons, workshops, and club orientations because notices are scattered across different groups.

This app puts all of that in one clean, fast, mobile-friendly place.

---

## Key Features

### 🗺️ Interactive Campus Map & Directions
- Interactive map powered by Leaflet and OpenStreetMap.
- Points of interest categorized for quick access: Academic Blocks, Hostels, Canteens, Sports Complex, Health Center, and ATMs.
- Walking directions between key campus landmarks.

### 🏢 Faculty Cabin Directory
- Search faculty by name, department, or cabin number.
- Floor-by-floor indoor navigation guides (which staircase or lift to take, and which corridor to follow).
- Shows office timings and email contact info.

### 📅 Club Events & Campus Updates
- Real-time calendar of workshops, hackathons, guest lectures, and cultural events.
- One-click RSVP and event bookmarking for students.
- Verified club publisher tags so you always know an announcement is legitimate.

### 🤖 Campus AI Concierge
- Built-in Gemini AI assistant trained to answer everyday questions about campus life, building locations, and facilities.

### 👥 Multi-Role Dashboards
- **Students**: Bookmark places, RSVP to upcoming club events, and ask the AI guide.
- **Club Leads (Publishers)**: Create and manage event listings, publish official announcements, and track registrations.
- **Administrators**: Verify club publisher credentials, manage the faculty directory, and view audit history.

---

## Demo Accounts

You can explore role-specific features on the live demo using these test accounts:

| Role | Email | Password | What You Can Do |
|---|---|---|---|
| **Student** | `student@vitbhopal.ac.in` | `Campus@123` | Browse map, find cabins, RSVP to events, save bookmarks |
| **Club Lead** | `club@vitbhopal.ac.in` | `Campus@123` | Create event listings, post announcements, view RSVPs |
| **Admin** | `admin@vitbhopal.ac.in` | `Campus@123` | Verify club publishers, manage faculty cabins, audit logs |

*(You can also sign in with any email or use the role switcher in the top navigation bar).*

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Vite, React Router, Leaflet, Lucide Icons
- **Backend**: Node.js, Express, SQLite (`better-sqlite3`), Server-Sent Events (SSE) for live sync
- **AI**: Google Gemini API (`@google/genai`)
- **Hosting**: Vercel (Frontend with SPA routing via `vercel.json`)

---

## Local Development

### 1. Clone the repo
```bash
git clone https://github.com/goludheerajm31-arch/vitbhopalcampus.git
cd vitbhopalcampus
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
*(Optional: Add your `GEMINI_API_KEY` in `.env` if you want to use the AI campus assistant locally).*

### 4. Start the app
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The SQLite database seeds automatically on first launch with sample locations, faculty cabins, and events.

To create a production build:
```bash
npm run build
```

---

## Vercel Deployment

The repository includes a pre-configured `vercel.json` file with SPA rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures that direct URLs and page refreshes (like `/events`, `/faculty`, or `/dashboard`) load seamlessly without `404 Not Found` errors.

---

## Feedback & Contributions

Suggestions, bug reports, and pull requests are welcome! If you're a VIT Bhopal student or developer with ideas for new campus features or map coordinates, feel free to open an issue or PR.
