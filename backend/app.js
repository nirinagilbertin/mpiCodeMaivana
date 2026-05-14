import express from 'express';
import cors from 'cors';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';

import models, { sequelize } from './models/index.js';
import userRoutes from './routes/user.route.js';
import reportRoute from './routes/report.route.js';
import categoryRoute from './routes/category.route.js';
import postRoute from './routes/post.routes.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.SERVER_PORT, 10) || 5000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'fianara-connect-secret';
const NODE_ENV = process.env.NODE_ENV || 'development';

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'fianarapuls',
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: 'session',
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get('/', (req, res) => {
  return res.json({
    success: true,
    message: 'Fianara Connect API backend is running',
  });
});

app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoute(models));
app.use('/api/categories', categoryRoute(models))
app.use('/api/posts', postRoute(models));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    error: NODE_ENV === 'production' ? undefined : err.stack,
  });
});

const initializeServer = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync();
    console.log('Connexion à la base de données réussie.');

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Impossible de démarrer le serveur :', error);
    process.exit(1);
  }
};

initializeServer();
