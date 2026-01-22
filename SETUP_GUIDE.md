# 🚌 Happy Trails - Complete Setup & Deployment Guide

## ✨ What is Happy Trails?

A **beautiful, poetic bus booking platform** that transforms travel into an emotional journey. Built with Flask, featuring:
- 🎭 Narrative-driven UI with animations
- 📱 Responsive booking flow
- 🗺️ Real-time bus tracking
- 🌤️ Weather integration
- 💖 Designed with love by Kavlin

---

## 🚀 Quick Start (5 minutes)

### 1. Clone & Setup

```bash
# Clone repository
git clone https://github.com/Kavlin-Kaur/Happy-Trails.git
cd Happy-Trails

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy template env file
cp a.env .env

# Edit .env with your keys:
# GOOGLE_MAPS_API_KEY=your-key-here
# WEATHER_API_KEY=your-key-here
```

### 3. Run Locally

```bash
# Start Flask development server
$env:FLASK_ENV='development'
python app.py

# Visit: http://localhost:5000
```

---

## 🌐 Deployed Features (All Working)

### Authentication ✅
- **Signup**: Multi-step registration with password strength meter
- **Login**: Secure login with remember-me functionality
- **Profile**: Edit profile, change password, view bookings

### Booking Flow ✅
1. **Search Buses**: Select origin, destination, date
2. **View Results**: Dynamic filtering, sorting by price/time
3. **Select Bus**: Choose pickup & dropoff points
4. **Seat Selection**: Interactive seat map with price calculation
5. **Payment**: Multi-method payment UI
6. **Confirmation**: Booking receipt with ticket ID

### Additional Features ✅
- **My Bookings**: View all bookings (past & upcoming)
- **Cancel Booking**: One-click cancellation for upcoming trips
- **Live Tracking**: Real-time bus location on Leaflet.js map
- **Weather Info**: Destination weather during tracking
- **Poetry Corner**: Travel poems, quotes, community contributions
- **Travel Gallery**: Photo gallery of destinations
- **Route Explorer**: Interactive map with route details
- **Travel Companions**: User profiles and travel preferences

### Beautiful UX ✅
- **Animations**: Smooth page transitions, hover effects, micro-interactions
- **Glass Morphism**: Modern card designs with backdrop blur
- **Gradients**: Sunrise/sunset color schemes
- **Responsive**: Mobile, tablet, desktop optimized
- **Dark Mode Ready**: CSS variables for easy theming
- **Easter Eggs**: Konami code for hidden messages

---

## 📊 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Flask | Latest |
| **Database** | SQLite (dev) / PostgreSQL (prod) | - |
| **Frontend** | Bootstrap 5, CSS3, JavaScript | - |
| **Maps** | Leaflet.js | 1.9.4 |
| **Auth** | Flask-Login | Latest |
| **ORM** | SQLAlchemy | Latest |

---

## 🔧 API Keys Setup

### Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Maps JavaScript API
4. Create API key
5. Add to `.env`: `GOOGLE_MAPS_API_KEY=your-key`

### Get OpenWeather API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up (free tier available)
3. Copy API key
4. Add to `.env`: `WEATHER_API_KEY=your-key`

---

## 🚢 Vercel Deployment

### Prerequisite
- GitHub account with repository
- Vercel account (sign up with GitHub)

### Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import GitHub repository
   - Select "Happy-Trails"

3. **Set Environment Variables**
   - Environment Variables section
   - Add:
     ```
     HAPPYTRAILS_SECRET_KEY=<random-32-char-string>
     GOOGLE_MAPS_API_KEY=<your-key>
     WEATHER_API_KEY=<your-key>
     FLASK_ENV=production
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait ~2-3 minutes
   - Visit live URL

### Auto-Deployment
Every `git push` automatically deploys to Vercel! 🚀

---

## 🗄️ Database Structure

### User Model
```python
- id (Primary Key)
- first_name, last_name
- email (Unique)
- phone
- password_hash
- profile_picture, bio, address
- date_of_birth, gender
- bookings (Relationship)
```

### Bus Model
```python
- id (Primary Key)
- bus_number
- from_location, to_location
- departure_time, arrival_time
- capacity, price
- bus_type (Standard/Deluxe/Premium)
- amenities
```

### Booking Model
```python
- id (Primary Key)
- user_id, bus_id (Foreign Keys)
- travel_date
- seats, total_price
- status (Confirmed/Cancelled)
- seat_numbers (CSV format)
- payment_method
```

---

## 🐛 Troubleshooting

### 500 Error on Deploy
✅ **FIXED** - `wsgi.py` entry point added

### Database Not Found
✅ **FIXED** - `instance/` folder auto-created

### API Keys Not Working
- Verify `.env` file exists in project root
- Check Vercel Environment Variables match `.env`
- Reload page after setting variables

### Routes 404
- Ensure all template files exist
- Check `app.py` route decorators are correct

---

## 📝 Project Structure

```
Happy-Trails/
├── app.py              # Flask app & routes
├── wsgi.py             # Vercel entry point
├── requirements.txt    # Python dependencies
├── .env                # Environment variables (git ignored)
├── vercel.json         # Vercel config
├── instance/           # Database folder
│   └── happytrails.db
├── static/
│   ├── css/            # Main styles + feature-specific
│   ├── js/             # JavaScript logic & interactions
│   └── images/         # Destination images
└── templates/
    ├── base.html       # Master template
    ├── index.html      # Homepage
    ├── auth/           # Login/Signup
    ├── booking/        # Booking flow
    └── features/       # Poetry, gallery, etc.
```

---

## ✨ Recent Improvements (v2.1)

- ✅ Fixed 500 errors on Vercel
- ✅ Added comprehensive animations
- ✅ Updated deployment documentation
- ✅ Fixed duplicate routes
- ✅ Improved HTML/CSS structure
- ✅ Enhanced error handling

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 💬 Support

- 📧 Email: hello@happytrails.com
- 🐛 Issues: [GitHub Issues](https://github.com/Kavlin-Kaur/Happy-Trails/issues)
- 💼 LinkedIn: [Kavlin Kaur](https://linkedin.com/in/kavlin-kaur)

---

<div align="center">
  <p><strong>Made with 💖 and Poetry by Kavlin</strong></p>
  <p>"Every journey begins with a smile and ends with beautiful memories" ✨</p>
</div>
