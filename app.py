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
    # Sample poetry data - later can be from database
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
    
    return render_template('features/poetry_corner.html', travel_poems=travel_poems)

# Initialize the database and add sample data
# Replace the @app.before_first_request decorator with this code
# This is because newer Flask versions don't support before_first_request with application factories

# Run the application
if __name__ == '__main__':
    # Use SQLite for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///happytrails.db'
    app.run(debug=True)

# Make sure it points to the correct location
# If you want the database in a specific folder, use absolute paths:
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////absolute/path/to/happytrails.db'
