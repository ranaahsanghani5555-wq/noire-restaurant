// Load test-only env before any module import so DB-importing code initialises.
process.env.DATABASE_URL ||= "postgresql://test:test@localhost:5432/noire_test";
process.env.AUTH_SECRET ||= "test-only-secret-0123456789abcdefghijklmnop";