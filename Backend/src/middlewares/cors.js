const cors = require('cors');

// Allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://patient-communication-platform.vercel.app',
  "https://patient-communication-platform-git-main-shazamchs-projects.vercel.app/"
];

// Express CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Authorization'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
