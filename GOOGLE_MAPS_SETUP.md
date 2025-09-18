# Google Maps API Setup Instructions

## Getting Your Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Create a new project or select an existing one
   - Note the project name/ID

3. **Enable Required APIs**
   Navigate to "APIs & Services" > "Library" and enable:
   - **Maps JavaScript API** (required for interactive maps)
   - **Geocoding API** (required for address lookup)
   - **Places API** (optional, for enhanced location search)

4. **Create API Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Secure Your API Key** (IMPORTANT!)
   - Click on the API key you just created
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add your domain(s):
     - For development: `http://localhost:3000/*`
     - For production: `https://yourdomain.com/*`
   - Under "API restrictions", select "Restrict key"
   - Choose only the APIs you enabled above

6. **Add to Your Project**
   - Copy your API key
   - Open `.env.local` in your project root
   - Replace `demo_key_replace_with_actual_key` with your actual API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...your_actual_key_here
   ```

7. **Restart Your Development Server**
   ```bash
   npm run dev
   ```

## Cost Information

- Google Maps API has a generous free tier
- You get $200 free credits monthly
- Maps JavaScript API: $7 per 1000 requests after free tier
- Geocoding API: $5 per 1000 requests after free tier
- Set up billing alerts to monitor usage

## Testing Without API Key

If you don't want to set up Google Maps immediately, the app includes a fallback interface that allows users to enter coordinates manually. The app will work but won't show the interactive map.

## Troubleshooting

### Common Errors:

1. **RefererNotAllowedMapError**
   - Your domain is not authorized
   - Add your domain to the API key restrictions

2. **InvalidKeyMapError**
   - API key is invalid or missing
   - Check the key in your `.env.local` file

3. **ApiNotActivatedMapError**
   - The required APIs are not enabled
   - Enable Maps JavaScript API in Google Cloud Console

4. **QuotaExceededError**
   - You've exceeded your free tier
   - Check your usage in Google Cloud Console

### Environment File Template:
```bash
# Copy .env.local.example to .env.local and update with your key
cp .env.local.example .env.local
```

### Verify Setup:
1. Check browser console for errors
2. Ensure API key starts with "AIza"
3. Verify the key is properly set in environment variables
4. Restart the development server after changes