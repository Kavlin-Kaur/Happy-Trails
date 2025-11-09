import os
import re
import os
import re
import random
from datetime import datetime, date
from flask import (
    Flask, render_template, request, redirect,
    url_for, flash, jsonify, session
)
# Add these two lines to load the .env file
from dotenv import load_dotenv
load_dotenv()

from flask_sqlalchemy import SQLAlchemy
from flask_login import (
    LoginManager, UserMixin, login_user, login_required,
    logout_user, current_user
)
from werkzeug.security import generate_password_hash, check_password_hash
import requests

# -------------------------------------------------------------------
# Configuration
# -------------------------------------------------------------------
app = Flask(__name__)

# Now the os.getenv calls below will find the variables from your .env file
app.config['SECRET_KEY'] = os.getenv('HAPPYTRAILS_SECRET_KEY', 'happytrailssecretkey')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///happytrails.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Google Maps API Key - Replace with your actual API key
GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"
# OpenWeatherMap API Key - Replace with your actual API key
WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    bookings = db.relationship('Booking', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Bus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    bus_number = db.Column(db.String(20), nullable=False)
    from_location = db.Column(db.String(100), nullable=False)
    to_location = db.Column(db.String(100), nullable=False)
    departure_time = db.Column(db.String(20), nullable=False)
    arrival_time = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='On Time')
    capacity = db.Column(db.Integer, default=40)
    price = db.Column(db.Float, nullable=False)
    bus_type = db.Column(db.String(50), default='Standard')  # Standard, Deluxe, Premium
    amenities = db.Column(db.String(200), default='Air Conditioning, Comfortable Seats')
    bookings = db.relationship('Booking', backref='bus', lazy=True)
    
    def available_seats(self):
        booked_seats = sum(booking.seats for booking in self.bookings if booking.status == 'Confirmed')
        return self.capacity - booked_seats

class BusStop(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    is_pickup = db.Column(db.Boolean, default=True)
    is_dropoff = db.Column(db.Boolean, default=True)
    city = db.Column(db.String(100), nullable=False)

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    bus_id = db.Column(db.Integer, db.ForeignKey('bus.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    travel_date = db.Column(db.Date, nullable=False)
    seats = db.Column(db.Integer, default=1)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='Confirmed')
    pickup_point = db.Column(db.String(100), nullable=True)
    dropoff_point = db.Column(db.String(100), nullable=True)
    seat_numbers = db.Column(db.String(100), nullable=True)  # Comma-separated seat numbers
    payment_method = db.Column(db.String(50), nullable=True)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Helper function to get weather data
def get_weather_data(city):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={WEATHER_API_KEY}"
        response = requests.get(url)
        data = response.json()
        if data["cod"] == 200:
            return {
                "temperature": data["main"]["temp"],
                "description": data["weather"][0]["description"],
                "icon": data["weather"][0]["icon"],
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"]["speed"]
            }
    except Exception as e:
        print(f"Error fetching weather data: {e}")
    return None

# Add this code after your app configuration but before your routes
with app.app_context():
    db.create_all()
    
    # Check if we need to add sample data
    if not Bus.query.first():
        # Your sample data code here (buses, bus stops, etc.)
        sample_buses = [
            Bus(bus_number="HT-101", from_location="Dharampur", to_location="Solan", 
                departure_time="08:00 AM", arrival_time="09:15 AM", status="On Time", price=150.00,
                bus_type="Standard", amenities="Air Conditioning, Comfortable Seats, Water Bottle"),
            Bus(bus_number="HT-102", from_location="Solan", to_location="Barog", 
                departure_time="09:30 AM", arrival_time="10:15 AM", status="Delayed", price=100.00,
                bus_type="Deluxe", amenities="Air Conditioning, Reclining Seats, WiFi, Snacks"),
            Bus(bus_number="HT-103", from_location="Barog", to_location="Dagshai", 
                departure_time="11:00 AM", arrival_time="12:00 PM", status="On Time", price=120.00,
                bus_type="Premium", amenities="Air Conditioning, Luxury Seats, WiFi, Entertainment, Meals"),
            Bus(bus_number="HT-104", from_location="Dagshai", to_location="Dharampur", 
                departure_time="01:30 PM", arrival_time="02:45 PM", status="On Time", price=150.00,
                bus_type="Standard", amenities="Air Conditioning, Comfortable Seats, Water Bottle"),
            # Add duplicate buses with different times for the same routes
            Bus(bus_number="HT-105", from_location="Dharampur", to_location="Solan", 
                departure_time="10:00 AM", arrival_time="11:15 AM", status="On Time", price=160.00,
                bus_type="Deluxe", amenities="Air Conditioning, Reclining Seats, WiFi, Snacks"),
            Bus(bus_number="HT-106", from_location="Dharampur", to_location="Solan", 
                departure_time="12:00 PM", arrival_time="01:15 PM", status="On Time", price=170.00,
                bus_type="Premium", amenities="Air Conditioning, Luxury Seats, WiFi, Entertainment, Meals"),
            Bus(bus_number="HT-107", from_location="Solan", to_location="Barog", 
                departure_time="11:30 AM", arrival_time="12:15 PM", status="On Time", price=110.00,
                bus_type="Standard", amenities="Air Conditioning, Comfortable Seats, Water Bottle"),
            Bus(bus_number="HT-108", from_location="Barog", to_location="Dagshai", 
                departure_time="02:00 PM", arrival_time="03:00 PM", status="Delayed", price=130.00,
                bus_type="Deluxe", amenities="Air Conditioning, Reclining Seats, WiFi, Snacks"),
        ]
        
        for bus in sample_buses:
            db.session.add(bus)
        
        # Add bus stops
        bus_stops = [
            # Dharampur
            BusStop(name="Dharampur Main Bus Stand", location="Central Dharampur", city="Dharampur", is_pickup=True, is_dropoff=True),
            BusStop(name="Dharampur Railway Station", location="Near Railway Station", city="Dharampur", is_pickup=True, is_dropoff=True),
            BusStop(name="Dharampur Market", location="Market Area", city="Dharampur", is_pickup=True, is_dropoff=True),
            
            # Solan
            BusStop(name="Solan Bus Terminal", location="Central Solan", city="Solan", is_pickup=True, is_dropoff=True),
            BusStop(name="Solan Mall Road", location="Mall Road", city="Solan", is_pickup=True, is_dropoff=True),
            BusStop(name="Solan University", location="Near University", city="Solan", is_pickup=True, is_dropoff=True),
            
            # Barog
            BusStop(name="Barog Station", location="Near Railway Station", city="Barog", is_pickup=True, is_dropoff=True),
            BusStop(name="Barog Market", location="Market Area", city="Barog", is_pickup=True, is_dropoff=True),
            
            # Dagshai
            BusStop(name="Dagshai Main Stand", location="Central Dagshai", city="Dagshai", is_pickup=True, is_dropoff=True),
            BusStop(name="Dagshai Cantonment", location="Cantonment Area", city="Dagshai", is_pickup=True, is_dropoff=True),
        ]
        
        for stop in bus_stops:
            db.session.add(stop)
        
        # Don't forget to commit
        db.session.commit()
        print("Database initialized with sample data!")
    else:
        print("Database already contains data.")

# Routes
@app.route('/')
def index():
    buses = Bus.query.all()
    today = date.today().strftime('%Y-%m-%d')
    
    # Get weather data for a default location
    weather = get_weather_data("Solan")
    
    return render_template('index.html', buses=buses, now_date=today, weather=weather, google_maps_api_key=GOOGLE_MAPS_API_KEY)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = 'remember' in request.form
        
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            login_user(user, remember=remember)
            flash('Login successful!', 'success')
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        else:
            flash('Invalid email or password', 'danger')
    
    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        first_name = request.form.get('firstName')
        last_name = request.form.get('lastName')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')
        confirm_password = request.form.get('confirmPassword')
        
        user_exists = User.query.filter_by(email=email).first()
        
        if user_exists:
            flash('Email already registered', 'danger')
        elif password != confirm_password:
            flash('Passwords do not match', 'danger')
        else:
            new_user = User(
                first_name=first_name,
                last_name=last_name,
                email=email,
                phone=phone
            )
            new_user.set_password(password)
            
            db.session.add(new_user)
            db.session.commit()
            
            flash('Account created successfully! Please login.', 'success')
            return redirect(url_for('login'))
    
    return render_template('signup.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out', 'info')
    return redirect(url_for('index'))

@app.route('/search_buses', methods=['POST'])
def search_buses():
    from_location = request.form.get('from')
    to_location = request.form.get('to')
    travel_date = request.form.get('date')
    passengers = request.form.get('passengers', 1)
    
    # Store search parameters in session
    session['search'] = {
        'from': from_location,
        'to': to_location,
        'date': travel_date,
        'passengers': passengers
    }
    
    return redirect(url_for('bus_results'))

@app.route('/bus_results')
def bus_results():
    search = session.get('search', {})
    from_location = search.get('from')
    to_location = search.get('to')
    travel_date = search.get('date')
    
    if not all([from_location, to_location, travel_date]):
        flash('Please provide all search details', 'warning')
        return redirect(url_for('index'))
    
    buses = Bus.query.filter_by(
        from_location=from_location,
        to_location=to_location
    ).all()
    
    return render_template('bus_results.html', 
                          buses=buses, 
                          travel_date=travel_date,
                          from_location=from_location,
                          to_location=to_location)

@app.route('/select_bus/<int:bus_id>')
def select_bus(bus_id):
    bus = Bus.query.get_or_404(bus_id)
    travel_date = session.get('search', {}).get('date')
    
    if not travel_date:
        flash('Please search for buses first', 'warning')
        return redirect(url_for('index'))
    
    # Get pickup and dropoff points for this route
    pickup_points = BusStop.query.filter_by(city=bus.from_location, is_pickup=True).all()
    dropoff_points = BusStop.query.filter_by(city=bus.to_location, is_dropoff=True).all()
    
    return render_template('select_bus.html', 
                          bus=bus, 
                          travel_date=travel_date,
                          pickup_points=pickup_points,
                          dropoff_points=dropoff_points)

@app.route('/select_seats/<int:bus_id>', methods=['POST'])
@login_required
def select_seats(bus_id):
    bus = Bus.query.get_or_404(bus_id)
    travel_date = session.get('search', {}).get('date')
    
    if not travel_date:
        flash('Please search for buses first', 'warning')
        return redirect(url_for('index'))
    
    pickup_point = request.form.get('pickup_point')
    dropoff_point = request.form.get('dropoff_point')
    
    # Store in session for later use
    session['booking'] = {
        'bus_id': bus_id,
        'travel_date': travel_date,
        'pickup_point': pickup_point,
        'dropoff_point': dropoff_point
    }
    
    # Get already booked seats
    booked_seats = []
    travel_date_obj = datetime.strptime(travel_date, '%Y-%m-%d').date()
    bookings = Booking.query.filter_by(bus_id=bus_id, travel_date=travel_date_obj, status='Confirmed').all()
    
    for booking in bookings:
        if booking.seat_numbers:
            booked_seats.extend(booking.seat_numbers.split(','))
    
    return render_template('select_seats.html', 
                          bus=bus, 
                          travel_date=travel_date,
                          booked_seats=booked_seats,
                          pickup_point=pickup_point,
                          dropoff_point=dropoff_point)

@app.route('/payment/<int:bus_id>', methods=['POST'])
@login_required
def payment(bus_id):
    bus = Bus.query.get_or_404(bus_id)
    
    # Get booking details from form
    selected_seats = request.form.getlist('selected_seats')
    
    if not selected_seats:
        flash('Please select at least one seat', 'warning')
        return redirect(url_for('select_seats', bus_id=bus_id))
    
    # Get booking details from session
    booking_details = session.get('booking', {})
    
    # Calculate total price
    total_price = len(selected_seats) * bus.price
    
    # Store seat selection in session
    booking_details['selected_seats'] = ','.join(selected_seats)
    booking_details['total_price'] = total_price
    session['booking'] = booking_details
    
    return render_template('payment.html', 
                          bus=bus,
                          selected_seats=selected_seats,
                          total_price=total_price,
                          booking_details=booking_details)

@app.route('/confirm_booking', methods=['POST'])
@login_required
def confirm_booking():
    # Get booking details from session
    booking_details = session.get('booking', {})
    
    if not booking_details:
        flash('Booking information not found', 'danger')
        return redirect(url_for('index'))
    
    bus_id = booking_details.get('bus_id')
    travel_date = booking_details.get('travel_date')
    pickup_point = booking_details.get('pickup_point')
    dropoff_point = booking_details.get('dropoff_point')
    selected_seats = booking_details.get('selected_seats')
    total_price = booking_details.get('total_price')
    
    # Get payment method from form
    payment_method = request.form.get('payment_method')
    
    if not all([bus_id, travel_date, selected_seats, total_price, payment_method]):
        flash('Missing booking information', 'danger')
        return redirect(url_for('index'))
    
    # Create new booking
    bus = Bus.query.get_or_404(bus_id)
    travel_date_obj = datetime.strptime(travel_date, '%Y-%m-%d').date()
    
    booking = Booking(
        user_id=current_user.id,
        bus_id=bus_id,
        travel_date=travel_date_obj,
        seats=len(selected_seats.split(',')),
        total_price=total_price,
        pickup_point=pickup_point,
        dropoff_point=dropoff_point,
        seat_numbers=selected_seats,
        payment_method=payment_method
    )
    
    db.session.add(booking)
    db.session.commit()
    
    # Clear booking session data
    session.pop('booking', None)
    
    flash('Booking confirmed! Your booking ID is #{}'.format(booking.id), 'success')
    return redirect(url_for('booking_confirmation', booking_id=booking.id))

@app.route('/booking_confirmation/<int:booking_id>')
@login_required
def booking_confirmation(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    
    # Ensure user can only see their own bookings
    if booking.user_id != current_user.id:
        flash('Unauthorized access', 'danger')
        return redirect(url_for('index'))
    
    return render_template('booking_confirmation.html', booking=booking)

@app.route('/my_bookings')
@login_required
def my_bookings():
    bookings = Booking.query.filter_by(user_id=current_user.id).order_by(Booking.booking_date.desc()).all()
    return render_template('my_bookings.html', bookings=bookings)

@app.route('/cancel_booking/<int:booking_id>', methods=['POST'])
@login_required
def cancel_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    
    if booking.user_id != current_user.id:
        flash('Unauthorized action', 'danger')
        return redirect(url_for('my_bookings'))
    
    booking.status = 'Cancelled'
    db.session.commit()
    
    flash('Booking cancelled successfully', 'success')
    return redirect(url_for('my_bookings'))

@app.route('/track_bus/<int:bus_id>')
def track_bus(bus_id):
    bus = Bus.query.get_or_404(bus_id)
    
    # Get weather data for the destination
    weather = get_weather_data(bus.to_location)
    
    return render_template('track_bus.html', bus=bus, weather=weather, google_maps_api_key=GOOGLE_MAPS_API_KEY)

@app.route('/api/bus_location/<int:bus_id>')
def bus_location(bus_id):
    # In a real application, this would fetch real-time location data
    # For demo purposes, we'll return mock data with slight variations each time
    base_locations = {
        1: {"lat": 30.7333, "lng": 76.7794, "status": "On Time"},  # Chandigarh
        2: {"lat": 31.1048, "lng": 77.1734, "status": "Delayed"},  # Shimla
        3: {"lat": 32.2396, "lng": 77.1887, "status": "On Time"},  # Manali
        4: {"lat": 30.3398, "lng": 77.9601, "status": "On Time"},  # Dehradun
    }
    
    # Get base location
    location = base_locations.get(bus_id, {"lat": 30.7333, "lng": 76.7794, "status": "Unknown"})
    
    # Add small random variation to simulate movement
    location["lat"] += random.uniform(-0.01, 0.01)
    location["lng"] += random.uniform(-0.01, 0.01)
    
    return jsonify(location)

@app.route('/api/traffic_update/<int:bus_id>')
def traffic_update(bus_id):
    # Mock traffic data
    traffic_conditions = ["Light", "Moderate", "Heavy"]
    traffic_status = random.choice(traffic_conditions)
    
    delay_minutes = 0
    if traffic_status == "Moderate":
        delay_minutes = random.randint(5, 15)
    elif traffic_status == "Heavy":
        delay_minutes = random.randint(15, 30)
    
    return jsonify({
        "traffic_status": traffic_status,
        "delay_minutes": delay_minutes
    })

@app.route('/poetry-corner')
def poetry_corner():
    from datetime import date
    
    # Phase 1: Travel Poetry
    travel_poems = [
        {
            'title': 'The Road Not Taken',
            'author': 'Robert Frost',
            'lines': [
                'Two roads diverged in a yellow wood,',
                'And sorry I could not travel both',
                'And be one traveler, long I stood',
                'And looked down one as far as I could',
                'To where it bent in the undergrowth;'
            ],
            'theme': 'choices',
            'image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800'
        },
        {
            'title': 'Where the Road Meets the Sky',
            'author': 'Kavlin',
            'lines': [
                'In every journey, a story unfolds,',
                'Where asphalt meets dreams, and hearts grow bold.',
                'The bus hums a tune of places unknown,',
                'And every mile whispers, "You\'re not alone."'
            ],
            'theme': 'journey',
            'image': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            'is_kavlin': True
        },
        {
            'title': 'Windows to Wanderlust',
            'author': 'Kavlin',
            'lines': [
                'Through windows wide, the world parades,',
                'Mountains bow and valleys fade.',
                'Each turn a verse, each stop a line,',
                'Poetry in motion, beautifully divine.'
            ],
            'theme': 'wanderlust',
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'is_kavlin': True
        },
        {
            'title': 'Song of the Open Road',
            'author': 'Walt Whitman',
            'lines': [
                'Afoot and light-hearted I take to the open road,',
                'Healthy, free, the world before me,',
                'The long brown path before me leading wherever I choose.',
            ],
            'theme': 'freedom',
            'image': 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800'
        },
        {
            'title': 'Ticket to Tomorrow',
            'author': 'Kavlin',
            'lines': [
                'A ticket is more than paper and ink,',
                'It\'s a promise, a dream, a hopeful link.',
                'To sunrise views and evening gold,',
                'To stories yet to be told.'
            ],
            'theme': 'hope',
            'image': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800',
            'is_kavlin': True
        },
        {
            'title': 'The Bus Stop Philosopher',
            'author': 'Kavlin',
            'lines': [
                'At the crossroads where strangers meet,',
                'Time slows down, hearts skip a beat.',
                'Stories shared in whispered tone,',
                'In that moment, we\'re never alone.'
            ],
            'theme': 'connection',
            'image': 'https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800',
            'is_kavlin': True
        }
    ]
    
    # Phase 2: Quote of the Day
    quotes_collection = [
        {
            'quote': 'The journey of a thousand miles begins with a single step.',
            'author': 'Lao Tzu',
            'category': 'Journey',
            'bg_image': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
            'color_scheme': 'sunset'
        },
        {
            'quote': 'Not all those who wander are lost.',
            'author': 'J.R.R. Tolkien',
            'category': 'Wanderlust',
            'bg_image': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
            'color_scheme': 'forest'
        },
        {
            'quote': 'Travel is the only thing you buy that makes you richer.',
            'author': 'Unknown',
            'category': 'Wisdom',
            'bg_image': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200',
            'color_scheme': 'ocean'
        },
        {
            'quote': 'Every ticket holds a sunrise, every departure a promise, every arrival a celebration.',
            'author': 'Kavlin',
            'category': 'Hope',
            'bg_image': 'https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=1200',
            'color_scheme': 'sunrise',
            'is_kavlin': True
        },
        {
            'quote': 'Adventures fill your soul with colors no palette can capture.',
            'author': 'Kavlin',
            'category': 'Adventure',
            'bg_image': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200',
            'color_scheme': 'vibrant',
            'is_kavlin': True
        }
    ]
    
    day_of_year = date.today().timetuple().tm_yday
    today_quote = quotes_collection[day_of_year % len(quotes_collection)]
    recent_quotes = quotes_collection[:4]
    
    # Phase 3: Community Poems
    community_poems = [
        {
            'id': 1,
            'title': 'Mountain Whispers',
            'author': 'Sarah Chen',
            'author_avatar': 'https://i.pravatar.cc/150?img=1',
            'poem_text': 'Through winding roads, the mountains call,\nWhispers of adventure, standing tall.\nEach curve reveals a story new,\nIn every vista, dreams come true.',
            'theme': 'Mountains',
            'location': 'Himachal Pradesh',
            'submitted_date': '2025-10-28',
            'likes': 127,
            'views': 543,
            'is_featured': True
        },
        {
            'id': 2,
            'title': 'Bus Window Dreams',
            'author': 'Raj Patel',
            'author_avatar': 'https://i.pravatar.cc/150?img=12',
            'poem_text': 'Frame by frame, the world goes by,\nClouds dancing in an endless sky.\nA traveler\'s heart beats with the road,\nCarrying memories as its load.',
            'theme': 'Journey',
            'location': 'Rajasthan',
            'submitted_date': '2025-10-27',
            'likes': 89,
            'views': 421
        },
        {
            'id': 3,
            'title': 'Sunset Serendipity',
            'author': 'Maya Krishnan',
            'author_avatar': 'https://i.pravatar.cc/150?img=5',
            'poem_text': 'Golden hours paint the sky,\nAs we watch the day say goodbye.\nStrangers become friends so fast,\nIn moments beautiful and vast.',
            'theme': 'Friendship',
            'location': 'Kerala',
            'submitted_date': '2025-10-26',
            'likes': 156,
            'views': 678,
            'is_featured': True
        },
        {
            'id': 4,
            'title': 'Station Soliloquy',
            'author': 'Arjun Mehta',
            'author_avatar': 'https://i.pravatar.cc/150?img=8',
            'poem_text': 'In the chaos of arrivals and goodbyes,\nI found peace beneath open skies.\nEvery station holds a tale untold,\nOf brave hearts and spirits bold.',
            'theme': 'Reflection',
            'location': 'Delhi',
            'submitted_date': '2025-10-25',
            'likes': 92,
            'views': 389
        },
        {
            'id': 5,
            'title': 'Monsoon Magic',
            'author': 'Priya Sharma',
            'author_avatar': 'https://i.pravatar.cc/150?img=9',
            'poem_text': 'Raindrops race on window panes,\nWashing away life\'s mundane chains.\nThe bus sways through misty green,\nThe most beautiful ride I\'ve seen.',
            'theme': 'Nature',
            'location': 'Maharashtra',
            'submitted_date': '2025-10-24',
            'likes': 134,
            'views': 567
        },
        {
            'id': 6,
            'title': 'Night Journey',
            'author': 'Aditya Kumar',
            'author_avatar': 'https://i.pravatar.cc/150?img=13',
            'poem_text': 'Stars guide us through the night,\nHeadlights pierce the dark so bright.\nIn silence, thoughts begin to roam,\nEvery journey leads us home.',
            'theme': 'Night',
            'location': 'Punjab',
            'submitted_date': '2025-10-23',
            'likes': 78,
            'views': 312
        }
    ]
    
    submission_themes = [
        'Journey & Adventure',
        'Mountains & Hills',
        'Coastal & Beaches',
        'Friendship & Connection',
        'Solitude & Reflection',
        'Nature & Seasons',
        'City & Urban',
        'Night Travel',
        'First Journey',
        'Coming Home'
    ]
    
    # Phase 4: Route Poems
    route_poems = [
        {
            'route_number': 'HT-101',
            'route_name': 'Dharampur → Solan',
            'from_location': 'Dharampur',
            'to_location': 'Solan',
            'poem_title': 'Where Pine Forests Whisper',
            'poem_excerpt': 'Through pine-scented paths we glide,\nWhere mountains and memories collide.\nEach kilometer a verse unspoken,\nEach moment a promise unbroken.',
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'best_season': 'Spring',
            'season_icon': 'fas fa-seedling',
            'route_type': 'mountain',
            'is_kavlin_favorite': True
        },
        {
            'route_number': 'HT-102',
            'route_name': 'Solan → Barog',
            'from_location': 'Solan',
            'to_location': 'Barog',
            'poem_title': 'Through the Tunnel of Time',
            'poem_excerpt': 'Darkness embraces, then light returns,\nThrough tunnels where history yearns.\nBarog calls with stories old,\nIn every arch, legends told.',
            'image': 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
            'best_season': 'Monsoon',
            'season_icon': 'fas fa-cloud-rain',
            'route_type': 'heritage',
            'is_kavlin_favorite': True
        },
        {
            'route_number': 'HT-103',
            'route_name': 'Barog → Dagshai',
            'from_location': 'Barog',
            'to_location': 'Dagshai',
            'poem_title': 'Cantonment Dreams',
            'poem_excerpt': 'Colonial echoes in mountain air,\nDagshai stands with timeless care.\nBarracks whisper tales of yore,\nOn this route, history we explore.',
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'best_season': 'Winter',
            'season_icon': 'fas fa-snowflake',
            'route_type': 'historical',
            'is_kavlin_favorite': False
        },
        {
            'route_number': 'HT-104',
            'route_name': 'Dagshai → Dharampur',
            'from_location': 'Dagshai',
            'to_location': 'Dharampur',
            'poem_title': 'Coming Full Circle',
            'poem_excerpt': 'The journey ends where it began,\nFull circle, as life\'s perfect plan.\nFrom Dagshai back to Dharampur\'s grace,\nEvery return, a warm embrace.',
            'image': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800',
            'best_season': 'Autumn',
            'season_icon': 'fas fa-leaf',
            'route_type': 'scenic',
            'is_kavlin_favorite': True
        },
        {
            'route_number': 'HT-105',
            'route_name': 'Dharampur → Barog (Express)',
            'from_location': 'Dharampur',
            'to_location': 'Barog',
            'poem_title': 'The Swift Sojourn',
            'poem_excerpt': 'Express lanes through emerald hills,\nRapid hearts and adventure thrills.\nFrom Dharampur to Barog we fly,\nBeneath the ever-changing sky.',
            'image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            'best_season': 'Summer',
            'season_icon': 'fas fa-sun',
            'route_type': 'express',
            'is_kavlin_favorite': False
        },
        {
            'route_number': 'HT-106',
            'route_name': 'Solan → Dagshai (Scenic)',
            'from_location': 'Solan',
            'to_location': 'Dagshai',
            'poem_title': 'Valley of Verses',
            'poem_excerpt': 'Scenic detours through valleys deep,\nWhere nature\'s secrets softly sleep.\nFrom Solan\'s charm to Dagshai\'s pride,\nPoetry flows with every ride.',
            'image': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            'best_season': 'All Seasons',
            'season_icon': 'fas fa-infinity',
            'route_type': 'scenic',
            'is_kavlin_favorite': True
        }
    ]
    
    # Phase 5: Blog Posts
    blog_posts = [
        {
            'id': 1,
            'title': 'How Mountains Taught Me Poetry',
            'author': 'Kavlin',
            'author_avatar': './static/images/Kavlin Bitmoji.png',
            'date': '2025-10-28',
            'read_time': 8,
            'category': 'poetry-process',
            'category_label': 'Poetry Process',
            'excerpt': 'The first time I saw the Himalayas, I didn\'t write a single word. I just stood there, humbled by their magnitude, realizing that sometimes silence is the loudest poetry. This is the story of how mountains taught me to listen before I learned to write.',
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'tags': ['Mountains', 'Writing', 'Inspiration', 'Himalayas'],
            'likes': 234,
            'comments': 45
        },
        {
            'id': 2,
            'title': 'The Bus Window Philosophy',
            'author': 'Kavlin',
            'author_avatar': './static/images/Kavlin Bitmoji.png',
            'date': '2025-10-25',
            'read_time': 6,
            'category': 'travel-tales',
            'category_label': 'Travel Tales',
            'excerpt': 'Every bus window is a movie screen showing life\'s greatest film. Frame by frame, the world passes by, and in those fleeting moments, we find stories worth telling. Here\'s what I\'ve learned from thousands of hours gazing out windows.',
            'image': 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
            'tags': ['Travel', 'Philosophy', 'Observations'],
            'likes': 189,
            'comments': 32
        },
        {
            'id': 3,
            'title': 'Writing Between Stops: A Poet\'s Journey',
            'author': 'Kavlin',
            'author_avatar': './static/images/Kavlin Bitmoji.png',
            'date': '2025-10-22',
            'read_time': 10,
            'category': 'poetry-process',
            'category_label': 'Poetry Process',
            'excerpt': 'They say the best poetry comes in quiet moments, but I\'ve found mine in the chaos of bus stations, the hum of engines, and the chatter of fellow travelers. This is my creative process, unconventional and beautiful.',
            'image': 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=800',
            'tags': ['Writing Process', 'Creativity', 'Bus Travel'],
            'likes': 267,
            'comments': 58
        },
        {
            'id': 4,
            'title': 'A Traveler\'s Ode to Himachal',
            'author': 'Priya Sharma',
            'author_avatar': 'https://i.pravatar.cc/150?img=9',
            'date': '2025-10-20',
            'read_time': 7,
            'category': 'guest-posts',
            'category_label': 'Guest Post',
            'excerpt': 'As a guest writer on Kavlin\'s blog, I wanted to share my love letter to Himachal Pradesh - the land that changed how I see travel, poetry, and life itself. Through Happy Trails, I found more than transportation; I found inspiration.',
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'tags': ['Himachal', 'Guest Post', 'Travel'],
            'likes': 178,
            'comments': 41
        },
        {
            'id': 5,
            'title': 'Why Every Route Needs a Poem',
            'author': 'Kavlin',
            'author_avatar': './static/images/Kavlin Bitmoji.png',
            'date': '2025-10-18',
            'read_time': 5,
            'category': 'route-inspiration',
            'category_label': 'Route Inspiration',
            'excerpt': 'When I started Happy Trails, people thought pairing bus routes with poetry was quirky. Now they understand - every path has a story, every journey deserves to be honored with words that match its beauty.',
            'image': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            'tags': ['Routes', 'Poetry', 'Happy Trails'],
            'likes': 312,
            'comments': 67
        },
        {
            'id': 6,
            'title': 'From Engineer to Poet: My Journey',
            'author': 'Kavlin',
            'author_avatar': './static/images/Kavlin Bitmoji.png',
            'date': '2025-10-15',
            'read_time': 12,
            'category': 'travel-tales',
            'category_label': 'Travel Tales',
            'excerpt': 'Everyone asks how an engineer ends up running a bus service that prioritizes poetry. The answer is simple: I followed my heart on a journey that started with a single bus ride and ended with a dream called Happy Trails.',
            'image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            'tags': ['Personal', 'Story', 'Career Change'],
            'likes': 445,
            'comments': 89
        }
    ]
    
    return render_template('features/poetry_corner.html', 
                          travel_poems=travel_poems,
                          today_quote=today_quote,
                          recent_quotes=recent_quotes,
                          current_date=date.today(),
                          community_poems=community_poems,
                          submission_themes=submission_themes,
                          route_poems=route_poems,
                          blog_posts=blog_posts,  # Added Phase 5
                          user_is_logged_in=current_user.is_authenticated)

@app.route('/travel-gallery')
def travel_gallery():
    """✨ Kavlin's Enchanted 3D Memory Gallery - Phase 1 & 2"""
    
    # Sample photo data with enhanced details
    photos = [
        {
            'id': 1,
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'location': 'Dharampur Valley View',
            'destination': 'Dharampur',
            'type': 'landscape',
            'season': 'spring',
            'photographer': 'Kavlin',
            'date': '2024-03-15',
            'likes': 234,
            'views': 1456
        },
        {
            'id': 2,
            'image': 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
            'location': 'Solan Market Street',
            'destination': 'Solan',
            'type': 'people',
            'season': 'summer',
            'photographer': 'Priya Sharma',
            'date': '2024-06-20',
            'likes': 189,
            'views': 1123
        },
        {
            'id': 3,
            'image': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
            'location': 'Happy Trails Bus at Sunrise',
            'destination': 'Dharampur',
            'type': 'bus',
            'season': 'winter',
            'photographer': 'Raj Kumar',
            'date': '2024-01-10',
            'likes': 312,
            'views': 1890
        },
        {
            'id': 4,
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'location': 'Barog Tunnel Heritage',
            'destination': 'Barog',
            'type': 'heritage',
            'season': 'monsoon',
            'photographer': 'Sarah Chen',
            'date': '2024-07-25',
            'likes': 267,
            'views': 1678
        },
        {
            'id': 5,
            'image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            'location': 'Dagshai Cantonment',
            'destination': 'Dagshai',
            'type': 'heritage',
            'season': 'autumn',
            'photographer': 'Arjun Mehta',
            'date': '2024-10-05',
            'likes': 198,
            'views': 1234
        },
        {
            'id': 6,
            'image': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            'location': 'Mountain Trails - Solan',
            'destination': 'Solan',
            'type': 'landscape',
            'season': 'spring',
            'photographer': 'Maya Krishnan',
            'date': '2024-04-12',
            'likes': 345,
            'views': 2134
        },
        {
            'id': 7,
            'image': 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800',
            'location': 'Travelers at Barog Station',
            'destination': 'Barog',
            'type': 'people',
            'season': 'summer',
            'photographer': 'Kavlin',
            'date': '2024-05-18',
            'likes': 276,
            'views': 1567
        },
        {
            'id': 8,
            'image': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
            'location': 'Monsoon Magic - Dharampur',
            'destination': 'Dharampur',
            'type': 'landscape',
            'season': 'monsoon',
            'photographer': 'Aditya Kumar',
            'date': '2024-08-22',
            'likes': 412,
            'views': 2456
        },
        {
            'id': 9,
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'location': 'Winter Wonderland - Dagshai',
            'destination': 'Dagshai',
            'type': 'landscape',
            'season': 'winter',
            'photographer': 'Neha Singh',
            'date': '2024-12-05',
            'likes': 389,
            'views': 2234
        },
        {
            'id': 10,
            'image': 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800',
            'location': 'Happy Trails Fleet - Solan',
            'destination': 'Solan',
            'type': 'bus',
            'season': 'autumn',
            'photographer': 'Vikram Patel',
            'date': '2024-09-15',
            'likes': 298,
            'views': 1789
        },
        {
            'id': 11,
            'image': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
            'location': 'Colonial Architecture - Barog',
            'destination': 'Barog',
            'type': 'heritage',
            'season': 'spring',
            'photographer': 'Kavlin',
            'date': '2024-03-28',
            'likes': 223,
            'views': 1456
        },
        {
            'id': 12,
            'image': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
            'location': 'Sunset at Dharampur Hills',
            'destination': 'Dharampur',
            'type': 'landscape',
            'season': 'summer',
            'photographer': 'Priya Sharma',
            'date': '2024-06-30',
            'likes': 456,
            'views': 2890
        }
    ]
    
    # Unique destinations
    destinations = ['Dharampur', 'Solan', 'Barog', 'Dagshai']
    
    # Calculate totals
    total_views = sum(photo['views'] for photo in photos)
    total_likes = sum(photo['likes'] for photo in photos)
    
    return render_template('features/travel_gallery.html',
                          photos=photos,
                          destinations=destinations,
                          total_views=total_views,
                          total_likes=total_likes)

# PHASE 2: Upload endpoint (for future backend integration)
@app.route('/travel-gallery/upload', methods=['POST'])
@login_required
def upload_gallery_photo():
    """Handle photo upload submission"""
    try:
        # Get form data
        photo = request.files.get('photo')
        destination = request.form.get('destination')
        photo_type = request.form.get('photoType')
        season = request.form.get('season')
        caption = request.form.get('caption')
        location = request.form.get('location')
        
        # Validate
        if not photo or not destination or not photo_type or not season or not caption:
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        
        # In production:
        # 1. Save photo to cloud storage (AWS S3, Cloudinary, etc.)
        # 2. Create database record with status='pending'
        # 3. Send notification to moderators
        # 4. Return success response
        
        # For now, simulate success
        return jsonify({
            'success': True,
            'message': 'Photo uploaded successfully!',
            'photo_id': 999  # Would be actual DB ID
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/route-explorer')
def route_explorer():
    """🗺️ Interactive Route Explorer - Phases 1, 2 & 3
    
    Phase 1: Interactive map with Leaflet.js and route filtering
    Phase 2: Route comparison tool and detailed route information
    Phase 3: Live weather integration with OpenWeatherMap API
    
    Displays all bus routes on an interactive map with comprehensive
    comparison, analysis tools, and real-time weather conditions.
    """
    
    # Sample route data (same as Phase 2)
    routes = [
        {
            'id': 1,
            'name': 'Dharampur → Solan Express',
            'busNumber': 'HT-101',
            'from': 'Dharampur',
            'to': 'Solan',
            'type': 'Standard',
            'distance': '25 km',
            'duration': '1h 15m',
            'stops': 8,
            'color': '#FFD700',
            'price': 150,
            'departure_time': '08:00 AM',
            'arrival_time': '09:15 AM',
            'coordinates': [
                [30.8750, 77.0500],  # Dharampur
                [30.8800, 77.0700],
                [30.8850, 77.0900],
                [30.8900, 77.1100],
                [30.8950, 77.1300],
                [30.9000, 77.1500],
                [30.9050, 77.1650],
                [30.9100, 77.1734]   # Solan
            ],
            'stops_data': [
                {'name': 'Dharampur Main Stand', 'location': 'Central Dharampur', 'coordinates': [30.8750, 77.0500]},
                {'name': 'Dharampur Railway Station', 'location': 'Near Railway', 'coordinates': [30.8800, 77.0700]},
                {'name': 'Dharampur Market', 'location': 'Market Area', 'coordinates': [30.8850, 77.0900]},
                {'name': 'Highway Junction', 'location': 'NH-5', 'coordinates': [30.8900, 77.1100]},
                {'name': 'Green Valley', 'location': 'Valley Point', 'coordinates': [30.8950, 77.1300]},
                {'name': 'Pine Forest Stop', 'location': 'Forest Area', 'coordinates': [30.9000, 77.1500]},
                {'name': 'Solan Outskirts', 'location': 'City Entry', 'coordinates': [30.9050, 77.1650]},
                {'name': 'Solan Bus Terminal', 'location': 'Central Solan', 'coordinates': [30.9100, 77.1734]}
            ]
        },
        {
            'id': 2,
            'name': 'Solan → Barog Scenic Route',
            'busNumber': 'HT-102',
            'from': 'Solan',
            'to': 'Barog',
            'type': 'Deluxe',
            'distance': '18 km',
            'duration': '45m',
            'stops': 6,
            'color': '#32CD32',
            'price': 100,
            'departure_time': '09:30 AM',
            'arrival_time': '10:15 AM',
            'coordinates': [
                [30.9100, 77.1734],  # Solan
                [30.9200, 77.1500],
                [30.9300, 77.1300],
                [30.9400, 77.1100],
                [30.9500, 77.0900],
                [30.9600, 77.0700]   # Barog
            ],
            'stops_data': [
                {'name': 'Solan Bus Terminal', 'location': 'Central Solan', 'coordinates': [30.9100, 77.1734]},
                {'name': 'Solan Mall Road', 'location': 'Mall Road', 'coordinates': [30.9200, 77.1500]},
                {'name': 'University Junction', 'location': 'Near University', 'coordinates': [30.9300, 77.1300]},
                {'name': 'Mountain View Point', 'location': 'Scenic Spot', 'coordinates': [30.9400, 77.1100]},
                {'name': 'Tunnel Approach', 'location': 'Heritage Area', 'coordinates': [30.9500, 77.0900]},
                {'name': 'Barog Station', 'location': 'Railway Station', 'coordinates': [30.9600, 77.0700]}
            ]
        },
        {
            'id': 3,
            'name': 'Barog → Dagshai Heritage Trail',
            'busNumber': 'HT-103',
            'from': 'Barog',
            'to': 'Dagshai',
            'type': 'Premium',
            'distance': '22 km',
            'duration': '1h',
            'stops': 7,
            'color': '#FF6347',
            'price': 120,
            'departure_time': '11:00 AM',
            'arrival_time': '12:00 PM',
            'coordinates': [
                [30.9600, 77.0700],  # Barog
                [30.9650, 77.0550],
                [30.9700, 77.0400],
                [30.9750, 77.0250],
                [30.9800, 77.0100],
                [30.9850, 76.9950],
                [30.9900, 76.9800]   # Dagshai
            ],
            'stops_data': [
                {'name': 'Barog Station', 'location': 'Railway Station', 'coordinates': [30.9600, 77.0700]},
                {'name': 'Barog Market', 'location': 'Market Area', 'coordinates': [30.9650, 77.0550]},
                {'name': 'Heritage Point', 'location': 'Tourist Spot', 'coordinates': [30.9700, 77.0400]},
                {'name': 'Pine Grove', 'location': 'Forest Area', 'coordinates': [30.9750, 77.0250]},
                {'name': 'Military Road', 'location': 'Historical Route', 'coordinates': [30.9800, 77.0100]},
                {'name': 'Dagshai Entry', 'location': 'Town Entry', 'coordinates': [30.9850, 76.9950]},
                {'name': 'Dagshai Cantonment', 'location': 'Cantonment Area', 'coordinates': [30.9900, 76.9800]}
            ]
        },
        {
            'id': 4,
            'name': 'Dagshai → Dharampur Circle Route',
            'busNumber': 'HT-104',
            'from': 'Dagshai',
            'to': 'Dharampur',
            'type': 'Standard',
            'distance': '30 km',
            'duration': '1h 30m',
            'stops': 9,
            'color': '#1E90FF',
            'price': 150,
            'departure_time': '01:30 PM',
            'arrival_time': '03:00 PM',
            'coordinates': [
                [30.9900, 76.9800],  # Dagshai
                [30.9800, 76.9900],
                [30.9700, 77.0000],
                [30.9600, 77.0100],
                [30.9500, 77.0200],
                [30.9400, 77.0300],
                [30.9200, 77.0350],
                [30.9000, 77.0400],
                [30.8750, 77.0500]   # Dharampur
            ],
            'stops_data': [
                {'name': 'Dagshai Cantonment', 'location': 'Cantonment', 'coordinates': [30.9900, 76.9800]},
                {'name': 'Colonial Church', 'location': 'Heritage Site', 'coordinates': [30.9800, 76.9900]},
                {'name': 'Valley Viewpoint', 'location': 'Scenic Point', 'coordinates': [30.9700, 77.0000]},
                {'name': 'Tea Garden Stop', 'location': 'Plantation Area', 'coordinates': [30.9600, 77.0100]},
                {'name': 'Village Junction', 'location': 'Rural Area', 'coordinates': [30.9500, 77.0200]},
                {'name': 'Riverside Point', 'location': 'River Crossing', 'coordinates': [30.9400, 77.0300]},
                {'name': 'Highway Junction', 'location': 'Main Road', 'coordinates': [30.9200, 77.0350]},
                {'name': 'Dharampur Outskirts', 'location': 'Town Entry', 'coordinates': [30.9000, 77.0400]},
                {'name': 'Dharampur Main Stand', 'location': 'Central', 'coordinates': [30.8750, 77.0500]}
            ]
        },
        {
            'id': 5,
            'name': 'Dharampur → Solan Deluxe',
            'busNumber': 'HT-105',
            'from': 'Dharampur',
            'to': 'Solan',
            'type': 'Deluxe',
            'distance': '25 km',
            'duration': '1h 15m',
            'stops': 7,
            'color': '#9370DB',
            'price': 160,
            'departure_time': '10:00 AM',
            'arrival_time': '11:15 AM',
            'coordinates': [
                [30.8750, 77.0500],
                [30.8850, 77.0750],
                [30.8950, 77.1000],
                [30.9050, 77.1250],
                [30.9100, 77.1450],
                [30.9120, 77.1600],
                [30.9100, 77.1734]
            ],
            'stops_data': [
                {'name': 'Dharampur Main Stand', 'location': 'Central', 'coordinates': [30.8750, 77.0500]},
                {'name': 'Garden Point', 'location': 'Park Area', 'coordinates': [30.8850, 77.0750]},
                {'name': 'Shopping Complex', 'location': 'Commercial', 'coordinates': [30.8950, 77.1000]},
                {'name': 'Hilltop View', 'location': 'Scenic', 'coordinates': [30.9050, 77.1250]},
                {'name': 'Resort Area', 'location': 'Tourist Zone', 'coordinates': [30.9100, 77.1450]},
                {'name': 'Solan University', 'location': 'Education Hub', 'coordinates': [30.9120, 77.1600]},
                {'name': 'Solan Bus Terminal', 'location': 'Central', 'coordinates': [30.9100, 77.1734]}
            ]
        },
        {
            'id': 6,
            'name': 'Dharampur → Solan Premium',
            'busNumber': 'HT-106',
            'from': 'Dharampur',
            'to': 'Solan',
            'type': 'Premium',
            'distance': '25 km',
            'duration': '1h',
            'stops': 5,
            'color': '#FF1493',
            'price': 170,
            'departure_time': '12:00 PM',
            'arrival_time': '01:00 PM',
            'coordinates': [
                [30.8750, 77.0500],
                [30.8900, 77.0850],
                [30.9000, 77.1200],
                [30.9080, 77.1500],
                [30.9100, 77.1734]
            ],
            'stops_data': [
                {'name': 'Dharampur Main Stand', 'location': 'Central', 'coordinates': [30.8750, 77.0500]},
                {'name': 'Express Highway', 'location': 'Fast Route', 'coordinates': [30.8900, 77.0850]},
                {'name': 'Premium Rest Stop', 'location': 'Facilities', 'coordinates': [30.9000, 77.1200]},
                {'name': 'City Bypass', 'location': 'Direct Route', 'coordinates': [30.9080, 77.1500]},
                {'name': 'Solan Bus Terminal', 'location': 'Central', 'coordinates': [30.9100, 77.1734]}
            ]
        },
        {
            'id': 7,
            'name': 'Solan → Barog Standard',
            'busNumber': 'HT-107',
            'from': 'Solan',
            'to': 'Barog',
            'type': 'Standard',
            'distance': '20 km',
            'duration': '50m',
            'stops': 7,
            'color': '#20B2AA',
            'price': 110,
            'departure_time': '11:30 AM',
            'arrival_time': '12:20 PM',
            'coordinates': [
                [30.9100, 77.1734],
                [30.9180, 77.1550],
                [30.9260, 77.1350],
                [30.9340, 77.1150],
                [30.9420, 77.0950],
                [30.9500, 77.0800],
                [30.9600, 77.0700]
            ],
            'stops_data': [
                {'name': 'Solan Bus Terminal', 'location': 'Central', 'coordinates': [30.9100, 77.1734]},
                {'name': 'Temple Road', 'location': 'Religious Site', 'coordinates': [30.9180, 77.1550]},
                {'name': 'Market Square', 'location': 'Shopping', 'coordinates': [30.9260, 77.1350]},
                {'name': 'School Junction', 'location': 'Education Zone', 'coordinates': [30.9340, 77.1150]},
                {'name': 'Forest Entry', 'location': 'Nature Area', 'coordinates': [30.9420, 77.0950]},
                {'name': 'Barog Approach', 'location': 'Town Entry', 'coordinates': [30.9500, 77.0800]},
                {'name': 'Barog Station', 'location': 'Railway', 'coordinates': [30.9600, 77.0700]}
            ]
        },
        {
            'id': 8,
            'name': 'Barog → Dagshai Deluxe',
            'busNumber': 'HT-108',
            'from': 'Barog',
            'to': 'Dagshai',
            'type': 'Deluxe',
            'distance': '22 km',
            'duration': '55m',
            'stops': 6,
            'color': '#FF8C00',
            'price': 130,
            'departure_time': '02:00 PM',
            'arrival_time': '02:55 PM',
            'coordinates': [
                [30.9600, 77.0700],
                [30.9680, 77.0520],
                [30.9760, 77.0340],
                [30.9840, 77.0160],
                [30.9870, 76.9980],
                [30.9900, 76.9800]
            ],
            'stops_data': [
                {'name': 'Barog Station', 'location': 'Railway', 'coordinates': [30.9600, 77.0700]},
                {'name': 'Tunnel Vista', 'location': 'Heritage View', 'coordinates': [30.9680, 77.0520]},
                {'name': 'Mountain Pass', 'location': 'High Point', 'coordinates': [30.9760, 77.0340]},
                {'name': 'Valley Bridge', 'location': 'Bridge Crossing', 'coordinates': [30.9840, 77.0160]},
                {'name': 'Cantonment Gate', 'location': 'Entry Point', 'coordinates': [30.9870, 76.9980]},
                {'name': 'Dagshai Cantonment', 'location': 'Central', 'coordinates': [30.9900, 76.9800]}
            ]
        }
    ]
    
    # Destinations for filters
    destinations = ['Dharampur', 'Solan', 'Barog', 'Dagshai']
    
    # Convert routes to JSON for JavaScript
    import json
    routes_json = json.dumps(routes)
    
    # Get Weather API key from environment
    weather_api_key = os.getenv('WEATHER_API_KEY', '')
    
    return render_template('features/route_explorer.html',
                          routes=routes,
                          routes_json=routes_json,
                          destinations=destinations,
                          weather_api_key=weather_api_key)

@app.route('/travel-companions')
def travel_companions():
    """🤝 Travel Companions - Phase 1
    
    Phase 1: User Profiles & Travel Preferences
    
    Comprehensive user profile system with travel preferences, interests,
    badges, goals, and personality quiz for matching travelers.
    """
    
    return render_template('features/travel_companions.html')

@app.route('/copyright')
def copyright_notice():
    """Copyright notice page"""
    return render_template('footer/copyright.html')

@app.route('/cookie-policy')
def cookie_policy():
    """Cookie policy page"""
    return render_template('footer/cookie_policy.html')

@app.route('/disclaimer')
def disclaimer():
    """Disclaimer page"""
    return render_template('footer/disclaimer.html')

@app.route('/terms')
def terms_of_service():
    """Terms of service page"""
    return render_template('footer/terms.html')

# Run the application
if __name__ == '__main__':
    # Use SQLite for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///happytrails.db'
    app.run(debug=True)

# Make sure it points to the correct location
# If you want the database in a specific folder, use absolute paths:
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////absolute/path/to/happytrails.db'
