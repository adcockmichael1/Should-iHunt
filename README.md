# HuntCast - Hunting Weather App 🎯

A free, mobile-friendly web app that provides weather condition scores for turkey, deer, and duck hunting based on real-time data from the National Weather Service.

## Features

- **Real-time Weather Data** - Pulls current conditions from NWS API
- **Species-Specific Scoring** - Calculates hunting scores for:
  - 🦃 Turkey (with humidity tracking)
  - 🦌 Deer (with rut phase tracking)
  - 🦆 Duck
- **7-Day Forecast** - View upcoming hunting conditions
- **Responsive Design** - Works on iPhone, Android, and desktop
- **Progressive Web App** - Add to home screen for app-like experience
- **100% Free** - No subscriptions, no ads, no tracking

## How to Use

### Option 1: Open Locally

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Allow location access when prompted
4. View your hunting conditions!

### Option 2: Deploy to GitHub Pages (Recommended)

1. Create a GitHub account (free)
2. Create a new repository called `huntcast`
3. Upload all files to the repository
4. Go to Settings → Pages
5. Select "main" branch and save
6. Your app will be live at: `https://yourusername.github.io/huntcast`

### Option 3: Use Live Server (For Development)

1. Install VS Code
2. Install "Live Server" extension
3. Right-click `index.html` and select "Open with Live Server"
4. App opens in your browser with auto-reload

## Files Included

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `script.js` - Weather API integration and scoring algorithms
- `manifest.json` - PWA configuration
- `README.md` - This file

## Scoring Algorithms

### Turkey Hunting Score (0-100)
- **Barometric Pressure**: 29.9-30.2" ideal
- **Temperature**: 50-70°F optimal
- **Wind Speed**: Low wind preferred (0-5 mph)
- **Humidity**: 30-50% ideal (promotes gobbling)
- **Sky Conditions**: Clear/sunny preferred

### Deer Hunting Score (0-120)
- **Barometric Pressure**: 29.80-30.29" ideal
- **Temperature**: 30-50°F optimal
- **Wind Speed**: 5-15 mph ideal
- **Rut Phase**: Bonus points in November
- **Cold Fronts**: Detected from temperature drops

### Duck Hunting Score (0-120)
- **Barometric Pressure**: Low pressure preferred (<29.80")
- **Temperature**: 20-45°F ideal
- **Wind Speed**: 10-20 mph optimal
- **Storm Fronts**: Approaching storms are good
- **Sky Conditions**: Overcast preferred

## How It Works

1. **Location Detection**: Uses browser geolocation or defaults to Huntsville, AL
2. **API Calls**: Fetches data from National Weather Service API
3. **Score Calculation**: Applies species-specific algorithms
4. **Display**: Shows current conditions and 7-day forecast

## Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet
- ⚠️ Requires JavaScript enabled
- ⚠️ Requires location access for best results

## Add to Home Screen

### iPhone (Safari):
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on your home screen!

### Android (Chrome):
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Add to Home Screen"
4. Tap "Add"
5. App icon appears on your home screen!

## Customization

### Change Default Location
Edit `script.js` line 24:
```javascript
getWeatherData(34.7304, -86.5861); // Change these coordinates
```

### Adjust Scoring Ranges
Edit the scoring functions in `script.js`:
- `calculateTurkeyScore()` - Line 180
- `calculateDeerScore()` - Line 250
- `calculateDuckScore()` - Line 320

### Change Colors
Edit `style.css`:
- Background gradient: Line 8
- Card colors: Lines 200-220
- Rating colors: Lines 240-250

## Troubleshooting

### "Unable to load weather data"
- Check your internet connection
- Verify location permissions are enabled
- Try refreshing the page
- NWS API may be temporarily down

### Location not accurate
- Enable location services in browser settings
- Allow location access when prompted
- Try refreshing the page

### Scores seem wrong
- Verify weather data is displaying correctly
- Check that all factors are being calculated
- Compare with actual weather conditions
- Adjust scoring ranges if needed

## Data Source

All weather data comes from the **National Weather Service API**:
- Free to use, no API key required
- Updates every 1-6 hours
- Covers all US locations
- Highly accurate and reliable

API Documentation: https://www.weather.gov/documentation/services-web-api

## Privacy

- ✅ No data collection
- ✅ No tracking or analytics
- ✅ No cookies
- ✅ Location used only for weather data
- ✅ All processing happens in your browser

## Future Enhancements

Potential features for future versions:
- [ ] Hourly forecast breakdown
- [ ] Push notifications for optimal conditions
- [ ] Historical data comparison
- [ ] Additional species (elk, bear, waterfowl)
- [ ] Moon phase tracking
- [ ] Sunrise/sunset times
- [ ] Hunting journal/log
- [ ] Share conditions with friends
- [ ] Offline mode with cached data

## Contributing

Want to improve the app? Here's how:
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is free and open source. Use it, modify it, share it!

## Credits

- Weather data: National Weather Service
- Icons: Unicode emoji
- Design: Custom CSS
- Scoring algorithms: Based on hunting experience and research

## Support

Having issues? Want to suggest a feature?
- Open an issue on GitHub
- Email: contact@huntcast.app (if you set one up)
- Share feedback with other hunters

## Version History

### v1.0.0 (Current)
- Initial release
- Turkey, deer, and duck scoring
- Real-time weather data
- 7-day forecast view
- Responsive design
- PWA support
- Humidity tracking for turkeys

---

**Happy Hunting! 🎯🦃🦌🦆**

Built with ❤️ for hunters who want to maximize their time in the field.