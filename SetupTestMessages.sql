--for tesing purpose add few rows
--already been added

--insert into employee table
INSERT INTO 
    EMPLOYEE (EMPLOYEEID, FULLNAME, DEPUTEBRANCH, EMPLOYEEDP,PAYRATE,JOININGDATE)
VALUES
    (123, 'MR.X', 'INDIA', 'INDIA', 12.3, '12/2/2010');

--insert into contracts table
INSERT INTO 
    CONTRACTS (SOWID, SOWNAME, ProjectType, StartDate, EndDate, TcsOwner, BSCowner, PoValue)
VALUES
    ('P001', 'MISSION MARS', 'FIXED PRICE', '1/2/2020', '3/9/2022', 123, 123, 20000);
