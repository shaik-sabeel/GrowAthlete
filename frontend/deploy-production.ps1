# Production Deployment Script for GrowAthlete Frontend
# This script builds and prepares the frontend for production deployment

Write-Host "🚀 Starting Production Deployment Process..." -ForegroundColor Green

# Step 1: Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force dist
    Write-Host "✅ Previous build cleaned" -ForegroundColor Green
}

# Step 2: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci --production=false
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 3: Build for production
Write-Host "🔨 Building for production..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Production build completed" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Step 4: Create deployment files
Write-Host "📋 Creating deployment configuration files..." -ForegroundColor Yellow

# Create _redirects for Netlify
$redirectsContent = @"
# Netlify redirects for SPA
/*    /index.html   200

# API redirects
/api/*  https://growathlete-1.onrender.com/api/:splat  200

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
"@
$redirectsContent | Out-File -FilePath "dist/_redirects" -Encoding UTF8

# Create vercel.json
$vercelContent = @"
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://growathlete-1.onrender.com/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
"@
$vercelContent | Out-File -FilePath "dist/vercel.json" -Encoding UTF8

# Create nginx.conf
$nginxContent = @"
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass https://growathlete-1.onrender.com/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
"@
$nginxContent | Out-File -FilePath "dist/nginx.conf" -Encoding UTF8

Write-Host "✅ Deployment files created" -ForegroundColor Green

# Step 5: Analyze build
Write-Host "📊 Analyzing build..." -ForegroundColor Yellow
$buildSize = (Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum).Sum
$buildSizeMB = [math]::Round($buildSize/1MB, 2)
$fileCount = (Get-ChildItem dist -Recurse -File).Count

Write-Host "📈 Build Statistics:" -ForegroundColor Cyan
Write-Host "   Total Size: $buildSizeMB MB" -ForegroundColor White
Write-Host "   File Count: $fileCount files" -ForegroundColor White

# Step 6: Test production build
Write-Host "🧪 Testing production build..." -ForegroundColor Yellow
Write-Host "   Starting local server on port 3000..." -ForegroundColor White
Write-Host "   Open http://localhost:3000 in your browser to test" -ForegroundColor White
Write-Host "   Press Ctrl+C to stop the server" -ForegroundColor White

# Start local server for testing
try {
    serve dist -p 3000
} catch {
    Write-Host "❌ Failed to start local server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   You can manually test by opening dist/index.html in a browser" -ForegroundColor Yellow
}

Write-Host "🎉 Production deployment process completed!" -ForegroundColor Green
Write-Host "📁 Production files are ready in the 'dist' folder" -ForegroundColor Cyan
Write-Host "🚀 You can now deploy the 'dist' folder to any static hosting service" -ForegroundColor Cyan
