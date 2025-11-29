CREATE TABLE LIBRARY_BRANCH
(
	Name VARCHAR(15)				NOT NULL,
	Address VARCHAR(45)				NOT NULL,
	City VARCHAR(15)				NOT NULL,
	Phone_Number INT,
	Email_Address VARCHAR(20),
	Num_Member INT					NOT NULL,

	LIBRARY_BRANCHId INT			NOT NULL,
	PRIMARY KEY(LIBRARY_BRANCHId)
);

CREATE TABLE LIBRARY_EMPLOYEE
(
	Name VARCHAR(50)				NOT NULL,
	Department VARCHAR(30)			NOT NULL,
	Job_Title VARCHAR(30)			NOT NULL,
	Hire_Date DATE					NOT NULL,
	Year_Pay INT,				

	LIBRARY_EMPLOYEEId INT			NOT NULL,
	PRIMARY KEY(LIBRARY_EMPLOYEEId),

	Employee_Library INT,
	FOREIGN KEY(Employee_Library) REFERENCES LIBRARY_BRANCH(LIBRARY_BRANCHId)
);

CREATE TABLE LIBRARY_MEMBER
(
	Name VARCHAR(50)				NOT NULL,
	Account_Id INT					NOT NULL,
	Balance_Due INT,
	Books_Checked INT,
	Age INT,
	Notes VARCHAR(50),

	PRIMARY KEY(Account_Id),

	Member_Local_Branch INT,
	FOREIGN KEY(Member_Local_Branch) REFERENCES LIBRARY_BRANCH(LIBRARY_BRANCHId)
);

CREATE TABLE BOOK
(
    ISBN INT                               NOT NULL,
    Title VARCHAR(100)                     NOT NULL,
    Author_Lastname VARCHAR(50)            NOT NULL,
    Author_Firstname VARCHAR(50)           NOT NULL,
    Date_Published DATE,
    Publisher VARCHAR(50),
    IsPaperBack TINYINT(1)                 NOT NULL,
    Page_Count INT,
    Copies_Owned INT                       NOT NULL,

    BORROWER INT,
    Book_Library INT, 

    PRIMARY KEY(ISBN),

    FOREIGN KEY(BORROWER) REFERENCES LIBRARY_MEMBER(Account_Id),
    FOREIGN KEY(Book_Library) REFERENCES LIBRARY_BRANCH(LIBRARY_BRANCHId)
);

CREATE TABLE WAITLIST
(
	WAITLISTId INT					NOT NULL,
	Num_Waitlisted INT,
	Estimated_Time	DATE,

	PRIMARY KEY(WAITLISTId),

	Book INT,
	Current_Library INT,
	Current_Ownership INT,

	FOREIGN KEY(Book) REFERENCES BOOK(ISBN),
	FOREIGN KEY(Current_Library) REFERENCES LIBRARY_BRANCH(LIBRARY_BRANCHId),
	FOREIGN KEY(Current_Ownership) REFERENCES LIBRARY_MEMBER(Account_Id)
);

CREATE TABLE REVIEW
(
	REVIEWId INT					NOT NULL,
	Review_Rating INT				NOT NULL,
	Review_Text VARCHAR(200)		NOT NULL,

	PRIMARY KEY(REVIEWId),

	Reviewer INT,
	Reviewed_Book INT,

	FOREIGN KEY(Reviewer) REFERENCES LIBRARY_MEMBER(Account_Id),
	FOREIGN KEY(Reviewed_Book) REFERENCES BOOK(ISBN)
);

CREATE TABLE LOGIN
(
    MemberID INT AUTO_INCREMENT PRIMARY KEY,
    MemberName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    MemberPass VARCHAR(300) NOT NULL,
    Role_Code CHAR(1) NOT NULL DEFAULT 'M'
);
