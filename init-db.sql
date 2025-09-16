-- GymArt Database Initialization Script
-- This script creates basic tables for health checks and future features

-- Create health_checks table for API monitoring
CREATE TABLE IF NOT EXISTS health_checks (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'ok',
    response_time_ms INTEGER,
    endpoint VARCHAR(255),
    details JSONB
);

-- Insert initial health check record
INSERT INTO health_checks (status, endpoint, details) 
VALUES ('ok', '/api/health', '{"message": "Database initialized successfully"}');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_health_checks_timestamp ON health_checks(timestamp);
CREATE INDEX IF NOT EXISTS idx_health_checks_status ON health_checks(status);

-- Display initialization success
SELECT 'GymArt database initialized successfully!' as message;
