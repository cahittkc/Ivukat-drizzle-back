import 'dotenv/config';
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes"
import judgmentTypeRoutes from "./routes/judgmentTypeRoutes"
import customRoutes from "./routes/customRoutes"
import judgmentUnitRoutes from "./routes/judgmentUnitRoutes" 
import caseRoutes from "./routes/caseRoutes"
import partiesRoutes from "./routes/partiesRoutes"


import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schemas from "./db/schema"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db = drizzle(pool, { schema: { ...schemas } });

const app = express();
const PORT = process.env.PORT || 3000;


const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:8080',
  'chrome-extension://amebehcpcgkbgmbmbkidcmfgnkkakjhh',
  'https://avukatbeta.uyap.gov.tr'
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }, // Frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(logger);

app.get("/", (req, res) => {
  res.send("API çalışıyor!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/judgment-types", judgmentTypeRoutes)
app.use("/api/customs", customRoutes)
app.use("/api/judgment-unit", judgmentUnitRoutes)
app.use("/api/cases",caseRoutes)
app.use("/api/parties",partiesRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(errorHandler);
