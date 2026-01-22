  <div align="center">
    <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="600">
  </div>

<div align="center"><img src="Logo.jpg" style="height: 220px; border-radius: 50%;" /></div>

# <div align="center">HAPPY TRAILS</div>

  <div align="center">
    <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="600">
  </div>

# Happy Trails

> “Every confirmed ticket is a cosmic promise that tomorrow holds a sunrise worth chasing across dimensions.” – Kavlin ✨

## 📑 Table of Contents
- 🚀 Overview
- 🌌 Vision: Human-Centered Travel Technology
- ✨ Features
- 🌟 Stand-Out Experience Features
  - 🎭 Narrative & Poetic Interface
  - 📡 Live Tracking & Weather Integration
  - 🪄 Interactive Frontend Magic
  - 🐣 Hidden Easter Eggs
- 📺 Video Explanation
- 🛠️ Technologies Used
- ⚙️ Installation and Setup
- 🪪 .env Requirements
- 🐞 Issue Creation
- 📑 Contribution Guidelines
- 👥 Contributors
- 📄 License
- 📞 Contact

## 🚌 A Cosmic Bus Booking Experience
Happy Trails is a poetic, modern bus booking platform where every journey is treated as a magical, cosmic adventure. It transforms the transactional process of booking a ticket into an immersive experience—blending robust functionality (user accounts, real-time search, interactive seat selection, and live tracking) with an emotional UX full of micro‑poetry, glowing gradients, glass morphism, and narrative-led design.

## 🌌 Vision: Human-Centered Travel Technology
Travel isn’t just about getting from one point to another—it’s about anticipation, the journey, and the memories. Traditional booking portals feel sterile and impersonal. Happy Trails reframes this interaction as the beautiful first step of an adventure.

### The Happy Trails Difference
| Pillar | What It Means | How Happy Trails Expresses It |
|--------|---------------|--------------------------------|
| **Joyful UX** | Interfaces should inspire delight. | Poetic micro-copy, celebratory animations, and a magical theme. |
| **Reliability** | Technology must be dependable. | A robust Flask backend, real-time data, and secure user sessions. |
| **Discovery** | The platform should feel exploratory. | "Cosmic" destination carousels and live maps make planning fun. |
| **Inspiration** | Travel is a story. | Quotes, thematic gradients, and narrative motifs like "Cosmic Chariot". |

## 🚀 Live Demo
Experience Happy Trails live: [Happy-Trails](https://happytrails.vercel.app/)

## ✨ Features
| Domain | Features | Status |
|--------|----------|--------|
| **Authentication** | Multi-step Signup, Secure Login, Password Strength Meter, Session Persistence. | ✅ |
| **Booking Flow** | Search (Origin/Destination/Date), Dynamic Results, Sorting (Price/Time). | ✅ |
| **Seat Selection** | Interactive Graphical Seat Map, Real-time Price Calculation, Hover Effects. | ✅ |
| **Payment** | Multi-method Payment UI, Secure Confirmation Step, Celebratory Animations. | ✅ |
| **User Dashboard** | "My Cosmic Journeys" page to view all bookings (past & upcoming). | ✅ |
| **Booking Mgmt.** | Dynamic Filtering (Status/Month/Search), One-click Cancellation for upcoming trips. | ✅ |
| **Live Tracking** | Real-time (mocked) Bus Tracking on an interactive Leaflet.js Map. | ✅ |
| **API Integration** | OpenWeatherMap API for destination weather display. | ✅ |
| **UI/UX System** | Glass morphism, gradients, micro-animations, poetic meta-text, custom toasts. | ✅ |
| **Convenience** | "Recent Searches" via browser localStorage. | ✅ |
| **Easter Eggs** | Hidden Konami Code and other interactive secrets. | ✅ |

## 🌟 Stand-Out Experience Features
1) **Narrative & Poetic Interface** — Terms like "Cosmic Chariot", "Quantum Scheduling", and "Interdimensional Journey" keep the booking process memorable.
2) **Live Tracking & Weather Integration** — Leaflet.js map plus OpenWeatherMap destination weather to help travelers prepare.
3) **Interactive Frontend Magic** — Confetti on confirmation, instant seat/price updates, tactile animated buttons, floating background orbs.
4) **Hidden Easter Eggs** — Konami code and other secrets surface playful surprises from creator Kavlin.

## 📺 Video Explanation
Placeholder: drop your YouTube link here once ready. Suggested chapters: 00:00 Intro & Vision • 02:00 Search & Results • 05:00 Seat Selection • 08:00 Payment & Confirmation • 10:00 Live Tracking & Weather • 12:00 Easter Eggs • 14:00 Deployment/Env Setup.

## 🛠️ Technologies Used
- Backend: Flask, SQLAlchemy, Flask-Login
- Frontend: HTML, CSS, JavaScript, Bootstrap, Jinja, Leaflet.js
- Data: SQLite (local), PostgreSQL-ready; OpenWeatherMap API
- Deployment: Vercel (WSGI via wsgi.py)
- Tooling: Git, GitHub

## ⚙️ Installation and Setup
1) Clone and enter project
```
git clone https://github.com/Kavlin-Kaur/Happy-Trails.git
cd Happy-Trails
```
2) Create & activate venv (PowerShell)
```
python -m venv .venv
.venv\Scripts\Activate.ps1
```
3) Install dependencies
```
pip install -r requirements.txt
```
4) Configure environment (see .env Requirements)
5) Run locally
```
$env:FLASK_ENV="development"
python app.py
```
App runs at http://127.0.0.1:5000

## 🪪 .env Requirements
```
HAPPYTRAILS_SECRET_KEY=replace_me
DATABASE_URL=sqlite:///instance/happytrails.db
GOOGLE_MAPS_API_KEY=your_key
WEATHER_API_KEY=your_key
FLASK_ENV=development
```

## 🐞 Issue Creation
Open an issue here: https://github.com/Kavlin-Kaur/Happy-Trails/issues

## 📑 Contribution Guidelines
1) Fork the repo and create a feature branch.  
2) Commit with clear messages; add tests where possible.  
3) Open a PR describing changes and testing steps.

## 👥 Contributors
Thanks to everyone who has contributed: https://github.com/Kavlin-Kaur/Happy-Trails/graphs/contributors

## 📄 License
MIT License. See LICENSE for details.

## 📞 Contact
For support or collaboration, open an issue or reach out via GitHub: https://github.com/Kavlin-Kaur
- Suggested chapters:  
  00:00 Intro & Vision • 02:00 Search & Results • 05:00 Seat Selection • 08:00 Payment & Confirmation • 10:00 Live Tracking & Weather • 12:00 Easter Eggs • 14:00 Deployment/Env setup

---

## 🛠️ Technologies Used

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Jinja](https://img.shields.io/badge/Jinja-B41717?style=for-the-badge&logo=jinja&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Gunicorn](https://img.shields.io/badge/Gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white)

---
## 📁 PROJECT STRUCTURE

```txt
Happy-Trails/
├── .gitignore
├── App.png
├── app.py
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── Logo.jpg
├── package-lock.json
├── package.json
├── README.md
├── requirements.txt
├── vercel.json
│
├── .github/
│   ├── pull_request_template.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── config.yml
│   │   ├── documentation.md
│   │   ├── feature_request.yml
│   │   └── performance.md
│   └── workflows/
│       ├── issue-create-automate-message.yml
│       └── pr-create-automate-message.yml
│
├── instance/
│   └── happytrails.db
│
├── static/
│   ├── css/
│   │   ├── main.css
│   │   ├── poetry_corner.css
│   │   ├── route_explorer.css
│   │   ├── travel_companions.css
│   │   └── travel_gallery.css
│   │
│   ├── images/
│   │   ├── Barog.avif
│   │   ├── bus-marker.png
│   │   ├── bus-stop.png
│   │   ├── Dagshai.jpg
│   │   ├── Dharampur.webp
│   │   ├── Kavlin Bitmoji.png
│   │   ├── logo.png
│   │   └── Solan.jpg
│   │
│   └── js/
│       ├── main.js
│       ├── poetry_corner.js
│       ├── route_explorer.js
│       ├── travel_companions.js
│       └── travel_gallery.js
│
├── templates/
│   ├── base.html
│   ├── booking_confirmation.html
│   ├── book_bus.html
│   ├── bus_results.html
│   ├── index.html
│   ├── login.html
│   ├── my_bookings.html
│   ├── payment.html
|   ├── profile.html
│   ├── select_bus.html
│   ├── select_seats.html
│   ├── signup.html
│   ├── track_bus.html
│   │
│   ├── features/
│   │   ├── poetry_corner.html
│   │   ├── route_explorer.html
│   │   ├── travel_companions.html
│   │   └── travel_gallery.html
│   │
│   └── footer/
│       ├── cookie_policy.html
│       ├── copyright.html
│       ├── disclaimer.html
│       ├── newsletter.html
│       ├── privacy.html
│       └── terms.html
│
└── __pycache__/
    └── app.cpython-312.pyc
```

---

## ⚙️ Installation and Setup

### Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/Kavlin-Kaur/Happy-Trails.git
cd Happy-Trails

# 2. Create and activate a virtual environment
# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate

# On Windows (PowerShell):
python -m venv venv
.\venv\Scripts\Activate.ps1

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create a .env file in project root
cp a.env .env
# Edit .env and add your API keys

# 5. Run the development server
python app.py

# 6. Visit the application
http://127.0.0.1:5000
```

### Vercel Deployment

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy Happy Trails"
git push origin master

# 2. Connect GitHub to Vercel
# - Go to https://vercel.com/dashboard
# - Import Happy-Trails repository
# - Add Environment Variables:
#   HAPPYTRAILS_SECRET_KEY=<your-secret-key>
#   GOOGLE_MAPS_API_KEY=<your-api-key>
#   WEATHER_API_KEY=<your-openweather-key>
#   FLASK_ENV=production

# 3. Vercel automatically deploys on push
# Visit: https://happy-trails.vercel.app
```

### Required `.env` File

```bash
# Security & Database
HAPPYTRAILS_SECRET_KEY='your-random-secret-key-min-32-chars'
DATABASE_URL='sqlite:///instance/happytrails.db'
FLASK_ENV='development'  # or 'production'

# API Keys (Get from respective platforms)
GOOGLE_MAPS_API_KEY='get-from-google-cloud-console'
WEATHER_API_KEY='get-from-openweathermap.org'
```

### How to get API Keys:

1. **Google Maps API**: https://cloud.google.com/maps-platform
2. **OpenWeather API**: https://openweathermap.org/api

⚠️ **Security**: Never commit `.env` file to Git. Add to `.gitignore`.

---

## Issue Creation ✴
Report bugs and  issues or propose improvements through our GitHub repository.

## Contribution Guidelines 📑

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284145-bf2c01a8-c448-4f1a-b911-996024c84606.gif" width="400">
</div>

- Firstly Star(⭐) the Repository
- Fork the Repository and create a new branch for any updates/changes/issue you are working on.
- Start Coding and do changes.
- Commit your changes
- Create a Pull Request which will be reviewed and suggestions would be added to improve it.
- Add Screenshots and updated website links to help us understand what changes is all about.

- Check the [CONTRIBUTING.md](CONTRIBUTING.md) for detailed steps...
    
## Contributing is fun🧡

We welcome all contributions and suggestions!
Whether it's a new feature, design improvement, or a bug fix — your voice matters 💜

Your insights are invaluable to us. Reach out to us team for any inquiries, feedback, or concerns.

## 👥 Contributors

Thanks to these wonderful people for contributing 💖

[![Contributors](https://contrib.rocks/image?repo=Kavlin-Kaur/Happy-Trails)](https://github.com/Kavlin-Kaur/Happy-Trails/graphs/contributors)

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

## �️ Recent Fixes & Improvements (v2.1 - Jan 2026)

- ✅ **Fixed 500 errors on Vercel deployment**
- ✅ **Added `wsgi.py`** for serverless WSGI compatibility
- ✅ **Standardized SQLite path** to `instance/happytrails.db`
- ✅ **Environment variables** properly loaded from `.env`
- ✅ **Fixed duplicate `/profile` route** causing conflicts
- ✅ **Enhanced HTML structure** - removed nav/footer duplication
- ✅ **Added comprehensive CSS animations** - smooth transitions throughout
- ✅ **Interactive JS effects** - better UX with micro-interactions
- ✅ **Improved error handling** - graceful failures with user feedback

## 📞 Contact & Support

**Developed by:** [Kavlin](https://kavlin-kaur.github.io/kavres/)

**Questions or Feedback?** 
- 🐛 [Open an Issue](https://github.com/Kavlin-Kaur/Happy-Trails/issues)
- 📧 Email: hello@happytrails.com
- 💼 LinkedIn: [Kavlin Kaur](https://linkedin.com/in/kavlin-kaur)
- 🐙 GitHub: [Kavlin-Kaur](https://github.com/Kavlin-Kaur)

---

<div align="center">
  <h3>Made with 💖 and Poetry by Kavlin</h3>
  <p><strong>"Code is poetry, and poetry is life" ✨</strong></p>
  <p><strong>Let's make the world a more beautiful place, one line of code at a time!</strong></p>
  
  ![Thank You](https://github.com/XevenTech/xeventech/blob/main/cat.gif?raw=true)
</div>
