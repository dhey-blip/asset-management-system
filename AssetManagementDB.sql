CREATE LOGIN asset_app WITH PASSWORD = 'Dh3YO725';
GO

USE AssetManagementDB;
GO

CREATE USER asset_app FOR LOGIN asset_app;
ALTER ROLE db_owner ADD MEMBER asset_app;
GO