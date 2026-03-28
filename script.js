// Global variables
let currentWeatherData = null;
let forecastData = null;
let locationData = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    getLocation();
});

// Get user's location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherData(lat, lon);
            },
            error => {
                console.error('Location error:', error);
                // Use default location (Huntsville, AL)
                getWeatherData(34.7304, -86.5861);
            }
        );
    } else {
        // Geolocation not supported, use default location
        getWeatherData(34.7304, -86.5861);
    }
}

// Toggle location input visibility
function toggleLocationInput() {
    const input = document.getElementById('location-input');
    input.classList.toggle('hidden');
}

// Use current location
function useCurrentLocation() {
    document.getElementById('location-input').classList.add('hidden');
    getLocation();
}

// Search location by city and state
async function searchLocation() {
    const city = document.getElementById('city-input').value.trim();
    const state = document.getElementById('state-input').value.trim().toUpperCase();
    
    if (!city || !state) {
        alert('Please enter both city and state');
        return;
    }
    
    try {
        showLoading();
        document.getElementById('location-input').classList.add('hidden');
        
        // Use geocoding API to get coordinates
        // For simplicity, using a basic state capital lookup
        const stateCoords = {
            'AL': [32.3792, -86.3077], 'AK': [61.2181, -149.9003], 'AZ': [33.4484, -112.0740],
            'AR': [34.7465, -92.2896], 'CA': [38.5816, -121.4944], 'CO': [39.7392, -104.9903],
            'CT': [41.7658, -72.6734], 'DE': [39.1582, -75.5244], 'FL': [30.4383, -84.2807],
            'GA': [33.7490, -84.3880], 'HI': [21.3099, -157.8581], 'ID': [43.6150, -116.2023],
            'IL': [39.7817, -89.6501], 'IN': [39.7684, -86.1581], 'IA': [41.5868, -93.6250],
            'KS': [39.0473, -95.6752], 'KY': [38.2009, -84.8733], 'LA': [30.4515, -91.1871],
            'ME': [44.3106, -69.7795], 'MD': [38.9784, -76.4922], 'MA': [42.3601, -71.0589],
            'MI': [42.7325, -84.5555], 'MN': [44.9537, -93.0900], 'MS': [32.2988, -90.1848],
            'MO': [38.5767, -92.1735], 'MT': [46.5891, -112.0391], 'NE': [40.8136, -96.7026],
            'NV': [39.1638, -119.7674], 'NH': [43.2081, -71.5376], 'NJ': [40.2206, -74.7597],
            'NM': [35.6870, -105.9378], 'NY': [42.6526, -73.7562], 'NC': [35.7796, -78.6382],
            'ND': [46.8083, -100.7837], 'OH': [39.9612, -82.9988], 'OK': [35.4676, -97.5164],
            'OR': [44.9429, -123.0351], 'PA': [40.2732, -76.8867], 'RI': [41.8240, -71.4128],
            'SC': [34.0007, -81.0348], 'SD': [44.3683, -100.3364], 'TN': [36.1627, -86.7816],
            'TX': [30.2672, -97.7431], 'UT': [40.7608, -111.8910], 'VT': [44.2601, -72.5754],
            'VA': [37.5407, -77.4360], 'WA': [47.0379, -122.9007], 'WV': [38.3498, -81.6326],
            'WI': [43.0731, -89.4012], 'WY': [41.1400, -104.8202]
        };
        
        if (stateCoords[state]) {
            const [lat, lon] = stateCoords[state];
            document.getElementById('location').textContent = `📍 ${city}, ${state}`;
            await getWeatherData(lat, lon);
        } else {
            throw new Error('Invalid state code');
        }
    } catch (error) {
        console.error('Location search error:', error);
        alert('Unable to find location. Please check city and state.');
        hideLoading();
        document.getElementById('location-input').classList.remove('hidden');
    }
}

// Fetch weather data from NWS API
async function getWeatherData(lat, lon) {
    try {
        showLoading();
        
        // Step 1: Get grid coordinates and location info
        const pointsResponse = await fetch(
            `https://api.weather.gov/points/${lat.toFixed(4)},${lon.toFixed(4)}`,
            {
                headers: {
                    'User-Agent': 'HuntCast Weather App (contact@huntcast.app)'
                }
            }
        );
        
        if (!pointsResponse.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const pointsData = await pointsResponse.json();
        locationData = pointsData.properties;
        
        // Update location display
        const city = locationData.relativeLocation.properties.city;
        const state = locationData.relativeLocation.properties.state;
        document.getElementById('location').textContent = `📍 ${city}, ${state}`;
        
        // Step 2: Get forecast
        const forecastUrl = locationData.forecast;
        const forecastResponse = await fetch(forecastUrl, {
            headers: {
                'User-Agent': 'HuntCast Weather App (contact@huntcast.app)'
            }
        });
        
        if (!forecastResponse.ok) {
            throw new Error('Failed to fetch forecast data');
        }
        
        forecastData = await forecastResponse.json();
        
        // Step 3: Get current observations
        const stationsUrl = pointsData.properties.observationStations;
        const stationsResponse = await fetch(stationsUrl, {
            headers: {
                'User-Agent': 'HuntCast Weather App (contact@huntcast.app)'
            }
        });
        
        if (!stationsResponse.ok) {
            throw new Error('Failed to fetch stations data');
        }
        
        const stationsData = await stationsResponse.json();
        const stationId = stationsData.features[0].properties.stationIdentifier;
        
        const obsResponse = await fetch(
            `https://api.weather.gov/stations/${stationId}/observations/latest`,
            {
                headers: {
                    'User-Agent': 'HuntCast Weather App (contact@huntcast.app)'
                }
            }
        );
        
        if (!obsResponse.ok) {
            throw new Error('Failed to fetch observation data');
        }
        
        currentWeatherData = await obsResponse.json();
        
        // Process and display data
        displayCurrentWeather(currentWeatherData);
        calculateAndDisplayScores(currentWeatherData);
        displayForecast(forecastData);
        detectBestDays(forecastData);
        
        // Update last updated time
        const now = new Date();
        document.getElementById('last-updated').textContent = 
            `Updated: ${now.toLocaleTimeString()}`;
        
        hideLoading();
        
    } catch (error) {
        console.error('Weather data error:', error);
        
        // Check if it's a CORS error (common when opening file:// directly)
        if (error.message.includes('fetch') || error.message.includes('CORS')) {
            document.getElementById('error-message').innerHTML =
                '⚠️ Cannot load weather data from file://';
            document.getElementById('error').querySelector('.error-hint').innerHTML =
                'Please use one of these methods:<br>' +
                '1. Use Live Server in VS Code<br>' +
                '2. Deploy to GitHub Pages<br>' +
                '3. Run a local web server';
        } else {
            document.getElementById('error-message').textContent =
                '⚠️ ' + error.message;
        }
        
        showError();
    }
}

// Display current weather
function displayCurrentWeather(data) {
    const props = data.properties;
    
    // Temperature
    const tempC = props.temperature.value;
    const tempF = tempC !== null ? Math.round(tempC * 9/5 + 32) : '--';
    document.getElementById('current-temp').textContent = `${tempF}°F`;
    
    // Feels like
    const feelsLikeC = props.heatIndex.value || props.windChill.value;
    if (feelsLikeC !== null) {
        const feelsLikeF = Math.round(feelsLikeC * 9/5 + 32);
        document.getElementById('feels-like').textContent = `Feels like ${feelsLikeF}°F`;
    }
    
    // Conditions
    const conditions = props.textDescription || 'Current conditions';
    document.getElementById('current-conditions').textContent = conditions;
    
    // Pressure
    const pressurePa = props.barometricPressure.value;
    const pressureIn = pressurePa !== null ? (pressurePa / 3386.39).toFixed(2) : '--';
    document.getElementById('pressure-display').textContent = `🔽 ${pressureIn}"`;
    
    // Wind
    const windKmh = props.windSpeed.value;
    const windMph = windKmh !== null ? Math.round(windKmh * 0.621371) : '--';
    const windDir = props.windDirection.value || '';
    const windDirText = getWindDirection(windDir);
    document.getElementById('wind-display').textContent = `💨 ${windMph} mph ${windDirText}`;
    
    // Humidity
    const humidity = props.relativeHumidity.value;
    const humidityText = humidity !== null ? Math.round(humidity) : '--';
    document.getElementById('humidity-display').textContent = `💧 ${humidityText}%`;
}

// Calculate and display all species scores
function calculateAndDisplayScores(data) {
    // Turkey
    const turkeyResult = calculateTurkeyScore(data);
    displayScore('turkey', turkeyResult);
    
    // Deer
    const deerResult = calculateDeerScore(data);
    displayScore('deer', deerResult);
    
    // Duck
    const duckResult = calculateDuckScore(data);
    displayScore('duck', duckResult);
}

// Calculate Turkey Hunting Score
function calculateTurkeyScore(weatherData) {
    let score = 100;
    const factors = [];
    const props = weatherData.properties;
    
    // Extract weather values
    const tempC = props.temperature.value;
    const tempF = tempC !== null ? tempC * 9/5 + 32 : null;
    const pressurePa = props.barometricPressure.value;
    const pressureIn = pressurePa !== null ? pressurePa / 3386.39 : null;
    const windKmh = props.windSpeed.value;
    const windMph = windKmh !== null ? windKmh * 0.621371 : null;
    const humidity = props.relativeHumidity.value;
    
    // Barometric Pressure (29.9-30.2" ideal)
    if (pressureIn !== null) {
        if (pressureIn < 29.7 || pressureIn > 30.4) {
            score -= 40;
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'negative', text: 'Outside ideal range' });
        } else if (pressureIn < 29.9 || pressureIn > 30.2) {
            score -= 20;
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'neutral', text: 'Acceptable range' });
        } else {
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'positive', text: 'Ideal range' });
        }
    }
    
    // Temperature (50-70°F ideal)
    if (tempF !== null) {
        if (tempF < 45 || tempF > 75) {
            score -= 30;
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'negative', text: 'Too cold/hot' });
        } else if (tempF < 50 || tempF > 70) {
            score -= 15;
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'neutral', text: 'Acceptable' });
        } else {
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'positive', text: 'Optimal range' });
        }
    }
    
    // Wind Speed (low wind preferred)
    if (windMph !== null) {
        if (windMph > 15) {
            score -= 50;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'negative', text: 'Too windy' });
        } else if (windMph > 10) {
            score -= 30;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'negative', text: 'Moderate wind' });
        } else if (windMph > 5) {
            score -= 15;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'neutral', text: 'Light wind' });
        } else {
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'positive', text: 'Calm conditions' });
        }
    }
    
    // Humidity (30-50% ideal - promotes gobbling)
    if (humidity !== null) {
        if (humidity > 70) {
            score -= 30;
            factors.push({ name: 'Humidity', value: `${Math.round(humidity)}%`, impact: 'negative', text: 'High - suppresses gobbling' });
        } else if (humidity < 20 || (humidity >= 60 && humidity <= 70)) {
            score -= 20;
            factors.push({ name: 'Humidity', value: `${Math.round(humidity)}%`, impact: 'negative', text: 'Less than ideal' });
        } else if ((humidity >= 20 && humidity < 30) || (humidity > 50 && humidity < 60)) {
            score -= 10;
            factors.push({ name: 'Humidity', value: `${Math.round(humidity)}%`, impact: 'neutral', text: 'Acceptable' });
        } else {
            factors.push({ name: 'Humidity', value: `${Math.round(humidity)}%`, impact: 'positive', text: 'Ideal for gobbling' });
        }
    }
    
    score = Math.max(0, Math.min(100, score));
    const rating = getRating(score);
    
    return {
        score,
        rating,
        factors,
        explanation: getExplanation('turkey', score, factors)
    };
}

// Calculate Deer Hunting Score
function calculateDeerScore(weatherData) {
    let score = 100;
    const factors = [];
    const props = weatherData.properties;
    
    const tempC = props.temperature.value;
    const tempF = tempC !== null ? tempC * 9/5 + 32 : null;
    const pressurePa = props.barometricPressure.value;
    const pressureIn = pressurePa !== null ? pressurePa / 3386.39 : null;
    const windKmh = props.windSpeed.value;
    const windMph = windKmh !== null ? windKmh * 0.621371 : null;
    
    // Barometric Pressure (29.80-30.29" ideal)
    if (pressureIn !== null) {
        if (pressureIn < 29.60 || pressureIn > 30.50) {
            score -= 30;
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'negative', text: 'Outside ideal range' });
        } else if (pressureIn < 29.80 || pressureIn > 30.29) {
            score -= 15;
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'neutral', text: 'Acceptable' });
        } else {
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'positive', text: 'Ideal range' });
        }
    }
    
    // Temperature (30-50°F ideal)
    if (tempF !== null) {
        if (tempF < 20 || tempF > 60) {
            score -= 20;
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'negative', text: 'Outside ideal range' });
        } else if (tempF < 30 || tempF > 50) {
            score -= 10;
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'neutral', text: 'Acceptable' });
        } else {
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'positive', text: 'Optimal for movement' });
        }
    }
    
    // Wind Speed (5-15 mph ideal for deer)
    if (windMph !== null) {
        if (windMph < 5 || windMph > 20) {
            score -= 10;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'neutral', text: 'Outside ideal range' });
        } else if (windMph > 15) {
            score -= 10;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'neutral', text: 'Moderate' });
        } else {
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'positive', text: 'Ideal for deer movement' });
        }
    }
    
    // Rut phase bonus (November)
    const month = new Date().getMonth();
    if (month === 10) { // November (0-indexed)
        const day = new Date().getDate();
        if (day >= 5 && day <= 15) {
            score += 20;
            factors.push({ name: 'Rut Phase', value: 'Peak Rut', impact: 'positive', text: 'Excellent timing!' });
        } else if (day < 5) {
            score += 10;
            factors.push({ name: 'Rut Phase', value: 'Pre-Rut', impact: 'positive', text: 'Good activity' });
        } else {
            score += 5;
            factors.push({ name: 'Rut Phase', value: 'Post-Rut', impact: 'neutral', text: 'Some activity' });
        }
    }
    
    score = Math.max(0, Math.min(120, score));
    const rating = getRating(score);
    
    return {
        score,
        rating,
        factors,
        explanation: getExplanation('deer', score, factors)
    };
}

// Calculate Duck Hunting Score
function calculateDuckScore(weatherData) {
    let score = 100;
    const factors = [];
    const props = weatherData.properties;
    
    const tempC = props.temperature.value;
    const tempF = tempC !== null ? tempC * 9/5 + 32 : null;
    const pressurePa = props.barometricPressure.value;
    const pressureIn = pressurePa !== null ? pressurePa / 3386.39 : null;
    const windKmh = props.windSpeed.value;
    const windMph = windKmh !== null ? windKmh * 0.621371 : null;
    
    // Low pressure preferred
    if (pressureIn !== null) {
        if (pressureIn < 29.80) {
            score += 20;
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'positive', text: 'Low pressure - excellent' });
        } else if (pressureIn > 30.20) {
            score -= 20;
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'negative', text: 'High pressure' });
        } else {
            factors.push({ name: 'Pressure', value: `${pressureIn.toFixed(2)}"`, impact: 'neutral', text: 'Moderate' });
        }
    }
    
    // Temperature (20-45°F ideal)
    if (tempF !== null) {
        if (tempF > 55 || tempF < 20) {
            score -= 20;
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'negative', text: 'Outside ideal range' });
        } else if (tempF > 45) {
            score -= 10;
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'neutral', text: 'Acceptable' });
        } else {
            factors.push({ name: 'Temperature', value: `${Math.round(tempF)}°F`, impact: 'positive', text: 'Ideal for ducks' });
        }
    }
    
    // Wind (10-20 mph ideal)
    if (windMph !== null) {
        if (windMph < 5 || windMph > 25) {
            score -= 20;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'negative', text: 'Outside ideal range' });
        } else if (windMph < 10 || windMph > 20) {
            score -= 10;
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'neutral', text: 'Acceptable' });
        } else {
            factors.push({ name: 'Wind', value: `${Math.round(windMph)} mph`, impact: 'positive', text: 'Ideal - ducks will bunch up' });
        }
    }
    
    score = Math.max(0, Math.min(120, score));
    const rating = getRating(score);
    
    return {
        score,
        rating,
        factors,
        explanation: getExplanation('duck', score, factors)
    };
}

// Get rating from score
function getRating(score) {
    if (score >= 80) return { text: 'Excellent', class: 'excellent', stars: '⭐⭐⭐⭐⭐' };
    if (score >= 60) return { text: 'Good', class: 'good', stars: '⭐⭐⭐⭐' };
    if (score >= 40) return { text: 'Fair', class: 'fair', stars: '⭐⭐⭐' };
    return { text: 'Poor', class: 'poor', stars: '⭐⭐' };
}

// Get explanation text
function getExplanation(species, score, factors) {
    const positiveFactors = factors.filter(f => f.impact === 'positive').length;
    const negativeFactors = factors.filter(f => f.impact === 'negative').length;
    
    if (score >= 80) {
        return `Excellent conditions! ${positiveFactors} factors are ideal.`;
    } else if (score >= 60) {
        return `Good conditions overall. ${positiveFactors} factors favorable.`;
    } else if (score >= 40) {
        return `Fair conditions. ${negativeFactors} factors less than ideal.`;
    } else {
        return `Poor conditions. ${negativeFactors} factors unfavorable.`;
    }
}

// Display score for a species
function displayScore(species, result) {
    const card = document.getElementById(`${species}-card`);
    card.className = `score-card ${species} ${result.rating.class}`;
    
    document.getElementById(`${species}-rating`).textContent = result.rating.stars;
    document.getElementById(`${species}-rating-text`).textContent = result.rating.text;
    document.getElementById(`${species}-rating-text`).className = `rating-text ${result.rating.class}`;
    document.getElementById(`${species}-score`).textContent = `${result.score}/100`;
    document.getElementById(`${species}-explanation`).textContent = result.explanation;
    
    // Store factors for detail view
    card.dataset.factors = JSON.stringify(result.factors);
}

// Display 7-day forecast
function displayForecast(data) {
    const container = document.getElementById('forecast-container');
    const periods = data.properties.periods;
    
    container.innerHTML = '';
    
    // Process day/night pairs
    for (let i = 0; i < Math.min(periods.length, 14); i += 2) {
        const day = periods[i];
        const night = periods[i + 1];
        
        const dayCard = createForecastCard(day, night);
        container.appendChild(dayCard);
    }
}

// Create forecast card
function createForecastCard(day, night) {
    const card = document.createElement('div');
    card.className = 'forecast-day';
    
    const avgTemp = Math.round((day.temperature + (night ? night.temperature : day.temperature)) / 2);
    
    card.innerHTML = `
        <div class="forecast-header">
            <div class="forecast-date">${day.name}</div>
        </div>
        <div class="forecast-weather">
            <span>🌡️ ${day.temperature}°F</span>
            <span>💨 ${day.windSpeed}</span>
            <span>${day.shortForecast}</span>
        </div>
        <div class="forecast-scores">
            <div class="forecast-score-item">
                <span>🦃 Turkey</span>
                <div class="score-value">--</div>
            </div>
            <div class="forecast-score-item">
                <span>🦌 Deer</span>
                <div class="score-value">--</div>
            </div>
            <div class="forecast-score-item">
                <span>🦆 Duck</span>
                <div class="score-value">--</div>
            </div>
        </div>
    `;
    
    return card;
}

// Detect best hunting days
function detectBestDays(data) {
    // This is a simplified version - in a full implementation,
    // you would calculate scores for each forecast day
    const bestDaysContainer = document.getElementById('best-days');
    const bestDaysList = document.getElementById('best-days-list');
    
    bestDaysList.innerHTML = `
        <div class="best-day-item">
            <strong>Check forecast below</strong> - Scores calculated for current conditions only
        </div>
    `;
    
    bestDaysContainer.classList.remove('hidden');
}

// Show species details
function showDetails(species) {
    const card = document.getElementById(`${species}-card`);
    const factors = JSON.parse(card.dataset.factors || '[]');
    
    const modal = document.getElementById('detail-modal');
    const content = document.getElementById('detail-content');
    
    const speciesNames = {
        turkey: '🦃 Turkey Hunting',
        deer: '🦌 Deer Hunting',
        duck: '🦆 Duck Hunting'
    };
    
    let factorsHTML = factors.map(f => `
        <div class="factor-item">
            <div>
                <div class="factor-name">${f.name}</div>
                <div class="factor-value">${f.value}</div>
            </div>
            <div class="factor-impact ${f.impact}">${f.text}</div>
        </div>
    `).join('');
    
    content.innerHTML = `
        <div class="detail-header">
            <h2>${speciesNames[species]}</h2>
            <p class="rating-text ${card.querySelector('.rating-text').className.split(' ')[1]}">
                ${card.querySelector('.rating-text').textContent}
            </p>
            <p class="score">${card.querySelector('.score').textContent}</p>
        </div>
        <div class="detail-section">
            <h3>Weather Factors</h3>
            ${factorsHTML}
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Close details modal
function closeDetails() {
    document.getElementById('detail-modal').classList.add('hidden');
}

// Toggle forecast expansion
function toggleForecast() {
    const container = document.getElementById('forecast-container');
    const btn = document.querySelector('.expand-btn');
    
    container.classList.toggle('expanded');
    btn.classList.toggle('expanded');
}

// Refresh data
function refreshData() {
    getLocation();
}

// Get wind direction text
function getWindDirection(degrees) {
    if (degrees === null) return '';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Show loading state
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
}

// Show error state
function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('content').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
}

// Close modal when clicking outside
document.getElementById('detail-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') {
        closeDetails();
    }
});

// Made with Bob
