# Therapist Search Frontend 🔍

A beautiful, modern web interface for searching therapists using natural language queries. This frontend connects to the production Therapist Search API to provide an intuitive search experience.

## 🚀 Live Demo

**Production Frontend**: Will be deployed to Railway
**Backend API**: https://therapistsearch-production.up.railway.app

## ✨ Features

- **🎨 Modern Design**: Beautiful gradient interface with smooth animations
- **🔍 Smart Search**: Natural language search with quick suggestions
- **🎛️ Advanced Filters**: Filter by fee, location, language, and telehealth options
- **📱 Responsive**: Mobile-first design that works on all devices
- **⚡ Fast**: Optimized performance with efficient API calls
- **🎯 User-Friendly**: Intuitive interface with clear therapist profiles

## 🛠️ Technology Stack

- **Backend**: FastAPI (static file serving)
- **Frontend**: Pure HTML, CSS, JavaScript
- **Styling**: Modern CSS with gradients and animations
- **Icons**: Font Awesome 6.0
- **API**: RESTful integration with production backend
- **Deployment**: Railway

## 📁 Project Structure

```
frontend_deploy/
├── venv/                    # Python virtual environment (gitignored)
├── main.py                  # FastAPI server for static files
├── requirements.txt         # Python dependencies
├── runtime.txt             # Python version specification
├── railway.json            # Railway deployment configuration
├── .env                    # Environment variables (gitignored)
├── .gitignore             # Git ignore rules
├── static/
│   ├── index.html         # Main search interface
│   ├── style.css          # Modern styling and animations
│   └── script.js          # Search functionality and API integration
├── start.sh               # Local development script
└── README.md              # This documentation
```

## 🏃‍♂️ Quick Start

### Local Development

1. **Setup Virtual Environment**
   ```bash
   cd frontend_deploy
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Server**
   ```bash
   # Using the provided script
   ./start.sh
   
   # Or manually
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Open in Browser**
   ```
   http://localhost:8000
   ```

### Production Deployment (Railway)

1. **Connect to Railway**
   - Create a new Railway project
   - Connect your GitHub repository
   - Select the `frontend_deploy` directory as the root

2. **Environment Variables** (Optional)
   - No environment variables required
   - Backend API URL is configured in JavaScript

3. **Deploy**
   - Railway will automatically detect and deploy using `railway.json`
   - The app will be available at your Railway-provided URL

## 🔧 Configuration

### API Configuration

The frontend is configured to connect to the production backend:
```javascript
// In static/script.js
this.apiBaseUrl = 'https://therapistsearch-production.up.railway.app';
```

### Search Payload Format

The frontend sends requests in this format to match your backend API:
```json
{
  "query": "spanish speaking therapist for anxiety",
  "max_results": 10,
  "max_fee": 150,
  "state": "CA",
  "languages": ["Spanish"]
}
```

## 🎨 Design Features

### Visual Design
- **Gradient Background**: Purple to blue gradient for professional healthcare feel
- **Modern Cards**: Clean therapist profiles with hover effects
- **Smooth Animations**: Subtle transitions and loading states
- **Responsive Layout**: Works perfectly on mobile, tablet, and desktop

### User Experience
- **Smart Search**: Pre-filled example queries and rotating placeholders
- **Quick Filters**: Easy-to-use dropdowns and checkboxes
- **Loading States**: Clear feedback during API calls
- **Error Handling**: Helpful error messages with retry options

## 📊 API Integration

### Endpoints Used
- `POST /search` - Advanced search with filters
- `GET /health` - Backend health check (for monitoring)

### Response Handling
- Displays therapist cards with similarity scores
- Shows specialties, languages, fees, and contact information
- Handles various data formats gracefully
- Provides fallback values for missing data

## 🚀 Performance

- **Fast Loading**: Minimal dependencies, pure JavaScript
- **Efficient API Calls**: Optimized requests with proper error handling
- **Responsive Design**: Mobile-first approach for all screen sizes
- **Cached Resources**: CDN-hosted icons and optimized assets

## 🛡️ Security

- **CORS Enabled**: Configured for cross-origin API calls
- **No Secrets**: No API keys or sensitive data in frontend
- **HTTPS**: Secure communication with production backend

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Development

### File Organization
- `main.py`: Simple FastAPI server for serving static files
- `static/index.html`: Main HTML structure and layout
- `static/style.css`: All styling, animations, and responsive design
- `static/script.js`: Search functionality and API communication

### Local Testing
```bash
# Test the frontend locally
./start.sh

# Check API connectivity
curl https://therapistsearch-production.up.railway.app/health
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check that the backend is running at the configured URL
   - Verify CORS is properly configured on the backend

2. **Local Development Issues**
   - Ensure virtual environment is activated
   - Check that all dependencies are installed
   - Verify Python version compatibility

3. **Railway Deployment Issues**
   - Check `railway.json` configuration
   - Verify `requirements.txt` includes all dependencies
   - Check Railway deployment logs

## 📈 Future Enhancements

- [ ] Search history and favorites
- [ ] Advanced filtering options
- [ ] Therapist comparison features
- [ ] Integration with booking systems
- [ ] User authentication and profiles

## 📝 License

This project is part of the Therapist Search application suite.

---

**Built with ❤️ for better mental health accessibility**