DROP TABLE IF EXISTS Employee;
-- DROP TABLE Employee CASCADE;
CREATE TABLE Employee(
    EmployeeID INT UNIQUE PRIMARY KEY,
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
    TcsOwner INT,
    BscOwner INT,
    SowSS VARCHAR(30),
    PoNumber INT,
    PoValue DECIMAL,
    Remarks VARCHAR(400),
    FOREIGN KEY(TcsOwner) REFERENCES Employee(EmployeeID),
    FOREIGN KEY(BscOwner) REFERENCES Employee(EmployeeID)
);


DROP TABLE IF EXISTS Resources;
CREATE TABLE Resources (
    ResourceID SERIAL PRIMARY KEY,
    SowID VARCHAR(50) NOT NULL,
    EmployeeID INT NOT NULL,
    StartDate DATE, 
    EndDate DATE,
    Percentage DECIMAL,
    PayRate DECIMAL,
    FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID),
    FOREIGN KEY(SowID) REFERENCES Contracts(SowID)
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
    EmployeeID INT NOT NULL,
    FOREIGN KEY(EmployeeID) REFERENCES Employee(EmployeeID)
);
