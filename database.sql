-- Copy and paste this into the Neon SQL Editor

CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    passwordHash VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userEmail VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    companyName TEXT NOT NULL,
    position VARCHAR(255) NOT NULL,
    jobUrl TEXT,
    status VARCHAR(50) DEFAULT 'Belum Apply',
    notes TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
