import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido no arquivo .env");
}

if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_FROM) {
  throw new Error(
    "Credenciais do SendGrid (SENDGRID_API_KEY, EMAIL_FROM) não definidas."
  );
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Credenciais do Cloudinary (CLOUDINARY_...) não definidas.");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está definida no arquivo .env");
}

if (!process.env.SENTRY_DSN) {
  console.warn("SENTRY_DSN não definido no .env");
}

export const env = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET!,
  databaseUrl: process.env.DATABASE_URL!,

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY!,
  },
  emailFrom: process.env.EMAIL_FROM!,

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    apiSecret: process.env.CLOUDINARY_API_SECRET!,
  },

  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
};
