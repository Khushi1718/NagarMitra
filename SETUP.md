# Nagar Mitra - Smart City Companion

A civic utility app that allows citizens to report issues, connect with their community, and track the progress of their reports.

## Features

### 📱 Mobile Navigation
- **Home**: Overview of civic issues and quick actions
- **Community**: Social feed showing community activity and resolved issues
- **Raise Issue**: Comprehensive form to report civic problems
- **History**: Track your reported issues and their status
- **Settings/Profile**: User profile and app preferences

### 🚨 Issue Reporting System
The Raise Issue feature includes:
- **Issue Categories**: Potholes, Street Lights, Waste Management, Water Supply, Drainage, Traffic Signals, Public Transport, Parks, Noise Pollution, and more
- **Priority Levels**: Low, Medium, High
- **Photo Capture**: Take photos directly with camera or upload from gallery
- **GPS Location**: Automatic location detection or manual selection on Google Maps
- **Step-by-step Form**: Guided 3-step process for easy reporting

### 📸 Camera Integration
- Access device camera to capture issue photos
- Upload multiple images from gallery
- Image preview and management
- Automatic compression for efficient upload

### 🗺️ Google Maps Integration
- Interactive map for precise location selection
- Automatic address resolution
- GPS coordinate capture
- Current location detection

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Google Cloud Platform account for Maps API

### Installation

1. **Clone and install dependencies**
   ```bash
   cd nagar-mitra
   npm install
   ```

2. **Set up Google Maps API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Geocoding API
     - Places API (optional)
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Google Maps API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the app**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Reporting an Issue

1. **Navigate to "Raise Issue"** using the bottom navigation
2. **Step 1 - Issue Details**:
   - Enter a descriptive title
   - Select the appropriate category
   - Choose priority level
   - Provide detailed description
3. **Step 2 - Location**:
   - Use "Current Location" for automatic GPS detection
   - Or "Choose on Map" to select location manually
   - Location will be displayed with coordinates
4. **Step 3 - Photos**:
   - Take photos using "Take Photo" (camera access required)
   - Or upload existing photos using "Upload Photo"
   - Review and remove photos if needed
5. **Submit** the report

### Tracking Issues

- Visit the **History** page to see all your reported issues
- Filter by status: All, Resolved, In Progress, Rejected
- View detailed information including photos and timeline
- Track progress from report to resolution

### Community Engagement

- Check the **Community** page for neighborhood activity
- See resolved issues and community impact statistics
- Like and comment on community posts
- Stay updated with municipal announcements

## Technical Details

### Tech Stack
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API
- **Language**: TypeScript

### Browser Compatibility
- Modern browsers with JavaScript enabled
- Camera API support for photo capture
- Geolocation API support for GPS functionality

### Permissions Required
- **Camera**: For capturing issue photos
- **Location**: For automatic location detection
- **Storage**: For caching and offline functionality

## Security & Privacy

- All location data is used only for issue reporting
- Photos are processed locally before upload
- Google Maps API key is properly configured with domain restrictions
- No personal data is stored without consent

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## Support

For technical issues or feature requests, please create an issue in the repository.

---

**Note**: This app is designed primarily for mobile use and optimized for civic engagement and community improvement.