USE AssetManagementDB;
GO

INSERT INTO dbo.Users (Username, PasswordHash, Role)
VALUES ('admin', '$2b$10$F3b/VC8wPrfIrSvHvz2sZOy5A/fMjxXG0t9odLUHqtBRmDBB/FTMC', 'admin');
GO

INSERT INTO dbo.Assets (AssetCode, AssetName, Category, Brand, Status, AssignedTo, PurchaseDate)
VALUES
    ('AST-0001', 'Dell Latitude 5440',   'Laptop',    'Dell',      'Assigned',    'Juan Dela Cruz', '2024-01-15'),
    ('AST-0002', 'HP LaserJet Pro M404', 'Printer',   'HP',        'Available',   NULL,             '2023-11-03'),
    ('AST-0003', 'Logitech MX Master 3', 'Peripheral','Logitech',  'Available',   NULL,             '2024-03-20'),
    ('AST-0004', 'Dell Latitude 5440',   'Laptop',    'Dell',      'Maintenance', NULL,             '2023-06-10'),
    ('AST-0005', 'Samsung 27" Monitor',  'Monitor',   'Samsung',   'Assigned',    'Maria Santos',   '2024-02-01');
GO

PRINT 'Seed data inserted successfully.';