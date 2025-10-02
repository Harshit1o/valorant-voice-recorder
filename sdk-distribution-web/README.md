# Valorant Voice Recorder - Distribution Web App

A modern React web application for distributing the Valorant Voice Recording SDK. Built with Vite, React 18, and Tailwind CSS.

## Features

- 🎮 **User-friendly Interface**: Clean, Valorant-themed UI with smooth animations
- 👤 **Simple Login**: Name-based user identification
- 📥 **SDK Download**: Automated download of setup instructions and SDK package
- 📋 **Step-by-step Guide**: Clear installation instructions for users
- ⚡ **Fast Performance**: Built with Vite for optimal loading times
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
sdk-distribution-web/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles with Tailwind
├── public/               # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## User Flow

1. **Login Page**: User enters their name
2. **Download Page**: Shows SDK features and download button
3. **Setup Complete**: Displays installation instructions

## Configuration

### Tailwind Colors
The app uses custom Valorant-themed colors:
- `valorant-red`: #FF4655
- `valorant-dark`: #0F1419  
- `valorant-blue`: #53F4FF
- `valorant-gold`: #F4A942

### Customization
- Modify colors in `tailwind.config.js`
- Update app content in `src/App.jsx`
- Add new components in `src/components/`

## Deployment Options

### Static Hosting (Recommended)
- **Netlify**: Drag and drop the `dist/` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use GitHub Actions for automated deployment

### Web Server
- **Apache/Nginx**: Serve the `dist/` folder as static files
- **Node.js**: Use express to serve static files

## Integration with SDK

The web app currently downloads installation instructions. To integrate with the actual SDK:

1. **Add SDK Binary**: Place the built Electron SDK in `public/downloads/`
2. **Update Download Logic**: Modify the download function in `App.jsx` to serve the actual SDK
3. **Add Version Management**: Implement version checking and updates

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run serve` - Serve production build

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_APP_VERSION=1.0.0
VITE_SDK_DOWNLOAD_URL=./downloads/
VITE_API_BASE_URL=http://localhost:3001
```

## Browser Support

- Chrome 87+
- Firefox 78+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support with the web application:
- Check the browser console for errors
- Ensure all dependencies are installed
- Verify Node.js version compatibility

For SDK-related issues, refer to the main project documentation.