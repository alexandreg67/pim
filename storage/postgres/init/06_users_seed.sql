INSERT INTO users (
    first_name,
    last_name,
    email,
    password, -- À remplacer plus tard par un hash
    is_admin,
    start_date
) VALUES (
    'Admin',
    'Test',
    'admin@test.com',
    'temporary_password',
    true,
    CURRENT_TIMESTAMP
);