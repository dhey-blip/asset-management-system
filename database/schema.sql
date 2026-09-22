USE AssetManagementDB;
GO

IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
    DROP TABLE dbo.Users;
GO

CREATE TABLE dbo.Users (
    Id            INT IDENTITY(1,1)   NOT NULL PRIMARY KEY,
    Username      NVARCHAR(50)        NOT NULL,
    PasswordHash  NVARCHAR(255)       NOT NULL,
    Role          NVARCHAR(20)        NOT NULL DEFAULT 'user',
    CreatedAt     DATETIME2           NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT UQ_Users_Username UNIQUE (Username)
);
GO

IF OBJECT_ID('dbo.Assets', 'U') IS NOT NULL
    DROP TABLE dbo.Assets;
GO

CREATE TABLE dbo.Assets (
    Id             INT IDENTITY(1,1)  NOT NULL PRIMARY KEY,
    AssetCode      NVARCHAR(30)       NOT NULL,
    AssetName      NVARCHAR(100)      NOT NULL,
    Category       NVARCHAR(50)       NULL,
    Brand          NVARCHAR(50)       NULL,
    Status         NVARCHAR(20)       NOT NULL DEFAULT 'Available',
    AssignedTo     NVARCHAR(100)      NULL,
    PurchaseDate   DATE               NULL,
    CreatedAt      DATETIME2          NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt      DATETIME2          NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT UQ_Assets_AssetCode UNIQUE (AssetCode),
    CONSTRAINT CHK_Assets_Status CHECK (Status IN ('Available', 'Assigned', 'Maintenance'))
);
GO

PRINT 'Schema created successfully.';