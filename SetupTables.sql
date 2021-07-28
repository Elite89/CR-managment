-- Contract Table
Drop TABLE IF EXISTS Contracts;
CREATE TABLE Contracts (
    SowID VARCHAR(50) NOT NULL PRIMARY KEY,
    SowName VARCHAR(100) NOT NULL, 
    ProjectType VARCHAR(50) NOT NULL, 
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    CssCMS VARCHAR(50),
    ContractID VARCHAR(50),
    ContractValue DECIMAL,
    CrmStage VARCHAR(30),
    CrmID VARCHAR(30),
    TcsOwner VARCHAR(30),
    BscOwner VARCHAR(30),
    SowSS VARCHAR(30),
    PoNumber NUMBER,
    PoValue DECIMAL,
    Remarks VARCHAR(400),
    FOREIGN KEY(TcsOwner) REFERENCES Employee(FullName),
    FOREIGN KEY(BscOwner) REFERENCES Employee(FullName)
);

DROP TABLE IF EXISTS Employee;
CREATE TABLE Employee(
    EmployeeID NUMBER NOT NULL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    DeputeBranch VARCHAR(50),
    EmployeeDP VARCHAR(50),
    DeputeGEO VARCHAR(50),
    PersonType VARCHAR(50),
    ParentIOU VARCHAR(50),
    WorkGEO VARCHAR(50),
    WorkLocation VARCHAR(50),
    EmployeeBaseCountry VARCHAR(50),
    SeniorJunior VARCHAR(50),
    PayRate DECIMAL,
    EmployeeStatus VARCHAR(30),
    JoiningDate DATE,
    ReleaseDate DATE,
    IndiaNONindia INT DEFAULT 1,
    ManagementPerson INT DEFAULT 0
);

DROP TABLE IF EXISTS Resources;
CREATE TABLE Resources (
    ResourceID SERIAL PRIMARY KEY,
    EmployeeID VARCHAR(100) NOT NULL,
    FullName VARCHAR(100) NOT NULL,
    FOREIGN KEY(FullName) REFERENCES Employee(FullName),
    FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID)
);

DROP TABLE IF EXISTS DropDown;
CREATE TABLE DropDown(
    DropdownID SERIAL PRIMARY KEY,
    DropDownName VARCHAR(100) NOT NULL,
    Status INT DEFAULT 1
);

DROP TABLE IF EXISTS BSCowner;
CREATE TABLE BSCowner(
    ID SERIAL PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    FOREIGN KEY(FullName) REFERENCES Employee(FullName)
);

/*
-- FROM OLD DATA TABLE 
-- DROP TABLE IF EXISTS Members;
-- CREATE TABLE Members (MemberID SERIAL PRIMARY KEY,
--                       FirstName VARCHAR(255) NOT NULL,
-- 		              LastName VARCHAR(255) NOT NULL,
--                       Username VARCHAR(255) NOT NULL UNIQUE,
--                       Email VARCHAR(255) NOT NULL UNIQUE,
--                       Password VARCHAR(255) NOT NULL,
--                       SALT VARCHAR(255),
--                       Verification INT DEFAULT 0
-- );

-- DROP TABLE IF EXISTS Contacts;
-- CREATE TABLE Contacts(PrimaryKey SERIAL PRIMARY KEY,
--                       MemberID_A INT NOT NULL,
--                       MemberID_B INT NOT NULL,
--                       Verified INT DEFAULT 0,
--                       FOREIGN KEY(MemberID_A) REFERENCES Members(MemberID),
--                       FOREIGN KEY(MemberID_B) REFERENCES Members(MemberID)
-- );

-- DROP TABLE IF EXISTS Chats;
-- CREATE TABLE Chats (ChatID SERIAL PRIMARY KEY,
--                     Name VARCHAR(255)
-- );

-- DROP TABLE IF EXISTS ChatMembers;
-- CREATE TABLE ChatMembers (ChatID INT NOT NULL,
--                           MemberID INT NOT NULL,
--                           FOREIGN KEY(MemberID) REFERENCES Members(MemberID),
--                           FOREIGN KEY(ChatID) REFERENCES Chats(ChatID)
-- );

-- DROP TABLE IF EXISTS Messages;
-- CREATE TABLE Messages (PrimaryKey SERIAL PRIMARY KEY,
--                        ChatID INT,
--                        Message VARCHAR(255),
--                        MemberID INT,
--                        FOREIGN KEY(MemberID) REFERENCES Members(MemberID),
--                        FOREIGN KEY(ChatID) REFERENCES Chats(ChatID),
--                        TimeStamp TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp
-- );

-- DROP TABLE IF EXISTS Locations;
-- CREATE TABLE Locations (PrimaryKey SERIAL PRIMARY KEY,
--                         MemberID INT,
--                         Nickname VARCHAR(255),
--                         Lat DECIMAL,
--                         Long DECIMAL,
--                         ZIP INT,
--                         FOREIGN KEY(MemberID) REFERENCES Members(MemberID)
-- );

-- DROP TABLE IF EXISTS Demo;
-- CREATE TABLE Demo (DemoID SERIAL PRIMARY KEY,
--                         Name VARCHAR(255) NOT NULL UNIQUE,
--                         Message VARCHAR(255)
-- );


-- DROP TABLE IF EXISTS Push_Token;
-- CREATE TABLE Push_Token (KeyID SERIAL PRIMARY KEY,
--                         MemberID INT NOT NULL UNIQUE,
--                         Token VARCHAR(255),
--                         FOREIGN KEY(MemberID) REFERENCES Members(MemberID)
-- );*/