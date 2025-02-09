CREATE TABLE
  Users (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(60) NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  ) AUTO_INCREMENT = 35247;

CREATE TABLE
  User_remark (
    userId INT UNSIGNED NOT NULL,
    remark VARCHAR(255) NOT NULL,
    --
    PRIMARY KEY (userId),
    FOREIGN KEY (userId) REFERENCES Users (id)
  );

CREATE TABLE
  Messanger (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    messangerName VARCHAR(50) NOT NULL
  );

-- INSERT INTO Messanger (messangerName) VALUES ('Instagram'), ('Telegram');
--
CREATE TABLE
  Site_res (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    siteName VARCHAR(50) NOT NULL
  );

-- INSERT INTO Site_res (siteName) VALUES ('venro.ru'),
-- ('justanotherpanel.com'), ('wiq.ru');
--
CREATE TABLE
  General_setting (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL
  );

-- INSERT INTO General_setting (description) VALUES ('Покупка пакетов'),
-- ('Покупка доп. услуг');
--
CREATE TABLE
  Reject_external (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    externalSetting TEXT NOT NULL,
    status BOOLEAN DEFAULT FALSE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE
  Inst_setting (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(255) NOT NULL,
    sessionId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE
  Just_setting (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    identity VARCHAR(255) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE
  Reset_password (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    userId INT UNSIGNED NOT NULL,
    status BOOLEAN DEFAULT FALSE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE
  Social_nickname (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    userId INT UNSIGNED NOT NULL,
    messangerId INT UNSIGNED NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    instProfileId VARCHAR(255),
    status BOOLEAN DEFAULT TRUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (messangerId) REFERENCES Messanger (id)
  );

CREATE TABLE
  Package_detail (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    price_rub_15 DECIMAL(10, 2) UNSIGNED NOT NULL,
    price_usd_15 DECIMAL(10, 2) UNSIGNED NOT NULL,
    price_rub_30 DECIMAL(10, 2) UNSIGNED NOT NULL,
    price_usd_30 DECIMAL(10, 2) UNSIGNED NOT NULL,
    likes INT UNSIGNED NOT NULL
  );

CREATE TABLE
  Custom_package_detail (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    likes INT UNSIGNED NOT NULL,
    reach INT UNSIGNED NOT NULL,
    saves INT UNSIGNED NOT NULL,
    profileVisits INT UNSIGNED NOT NULL,
    reposts INT UNSIGNED NOT NULL,
    videoViews INT UNSIGNED NOT NULL,
    countPosts INT UNSIGNED NOT NULL,
    price_rub DECIMAL(10, 2) UNSIGNED NOT NULL,
    price_usd DECIMAL(10, 2) UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE
  Package_setting (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    siteId INT UNSIGNED NOT NULL,
    typeService VARCHAR(100) NOT NULL,
    serviceId INT UNSIGNED NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    ratio DECIMAL(6, 3) UNSIGNED NOT NULL,
    cost decimal(10, 5) UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (siteId) REFERENCES Site_res (id)
  );

CREATE TABLE
  Service (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    userId INT UNSIGNED NOT NULL,
    socialNicknameId INT UNSIGNED NOT NULL,
    packageId INT UNSIGNED,
    customPackageId INT UNSIGNED,
    customPackage BOOLEAN DEFAULT FALSE NOT NULL,
    countPosts INT UNSIGNED NOT NULL,
    cost DECIMAL(10, 2) UNSIGNED NOT NULL,
    currency ENUM ('RUB', 'USD') NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    orderId VARCHAR(100) NOT NULL,
    paymentServiceName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (socialNicknameId) REFERENCES Social_nickname (id),
    FOREIGN KEY (packageId) REFERENCES Package_detail (id),
    FOREIGN KEY (customPackageId) REFERENCES Custom_package_detail (id)
  );

CREATE TABLE
  Purchase_package (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    serviceId INT UNSIGNED NOT NULL,
    siteId INT UNSIGNED NOT NULL,
    siteServiceId INT UNSIGNED NOT NULL,
    orderId INT UNSIGNED NOT NULL,
    --
    FOREIGN KEY (serviceId) REFERENCES Service (id),
    FOREIGN KEY (siteId) REFERENCES Site_res (id),
  );

CREATE TABLE
  Custom_package_user (
    customPackageId INT UNSIGNED NOT NULL,
    userId INT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    PRIMARY KEY (customPackageId, userId),
    FOREIGN KEY (customPackageId) REFERENCES Custom_package_detail (id),
    FOREIGN KEY (userId) REFERENCES Users (id)
  );

CREATE TABLE
  Employees (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(20) NOT NULL,
    password VARCHAR(60) NOT NULL,
    role ENUM ('admin', 'manager') DEFAULT ('manager') NOT NULL,
    fullName VARCHAR(30),
    status BOOLEAN DEFAULT TRUE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  );

CREATE TABLE
  Exchange_rate (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    typeRate VARCHAR(20) NOT NULL,
    value decimal(10, 4)
  );

-- INSERT INTO Exchange_rate (typeRate) VALUES ('external'), ('personal');
--
CREATE TABLE
  Extra_service (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    serviceName VARCHAR(50)
  );

-- INSERT INTO Extra_service (serviceName) VALUES ('Подписчики'), 
-- ('Просмотры (Story)'), ('Комментарии AI'), ('Комментарии кастомные');
--
CREATE TABLE
  Extra_service_comment (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    userId INT UNSIGNED NOT NULL,
    socialNicknameId INT UNSIGNED NOT NULL,
    countComments INT UNSIGNED NOT NULL,
    comments TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (socialNicknameId) REFERENCES Social_nickname (id)
  );

CREATE TABLE
  Extra_service_detail (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    extraServiceId INT UNSIGNED NOT NULL,
    price_usd_1k DECIMAL(10, 2) UNSIGNED NOT NULL,
    price_rub_1k DECIMAL(10, 2) UNSIGNED NOT NULL,
    minQuantity INT UNSIGNED NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    --
    FOREIGN KEY (extraServiceId) REFERENCES Extra_service (id)
  );

CREATE TABLE
  Extra_service_setting (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    extraServiceId INT UNSIGNED NOT NULL,
    siteId INT UNSIGNED NOT NULL,
    serviceId INT UNSIGNED NOT NULL,
    status BOOLEAN DEFAULT TRUE NOT NULL,
    cost DECIMAL(10, 5) UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (extraServiceId) REFERENCES Extra_service (id),
    FOREIGN KEY (siteId) REFERENCES Site_res (id)
  );

CREATE TABLE
  Extra (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    userId INT UNSIGNED NOT NULL,
    socialNicknameId INT UNSIGNED NOT NULL,
    extraServiceId INT UNSIGNED NOT NULL,
    count INT UNSIGNED NOT NULL,
    priceRUB DECIMAL(10, 2) UNSIGNED NOT NULL,
    priceUSD DECIMAL(10, 2) UNSIGNED NOT NULL,
    siteServiceInfo TEXT,
    paymentOrderId VARCHAR(100) NOT NULL,
    paymentServiceName VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (userId) REFERENCES Users (id),
    FOREIGN KEY (socialNicknameId) REFERENCES Social_nickname (id),
    FOREIGN KEY (extraServiceId) REFERENCES Extra_service (id)
  );

CREATE TABLE
  Test_service (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    serviceName VARCHAR(50) NOT NULL
  );

-- INSERT INTO Test_service (serviceName) VALUES ('Пакет на пост'),
-- ('Пакет на видео'), ('Подписчики'), ('Просмотры Story'), ('Комментарии');
--
CREATE TABLE
  Test_service_setting (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    testServiceId INT UNSIGNED NOT NULL,
    typeService VARCHAR(100) NOT NULL,
    serviceId INT UNSIGNED NOT NULL,
    siteId INT UNSIGNED NOT NULL,
    count INT UNSIGNED NOT NULL,
    drip BOOLEAN DEFAULT TRUE NOT NULL,
    cost DECIMAL(10, 5) UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (testServiceId) REFERENCES Test_service (id),
    FOREIGN KEY (siteId) REFERENCES Site_res (id)
  );

CREATE TABLE
  Test (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    testServiceId INT UNSIGNED NOT NULL,
    employeeId INT UNSIGNED NOT NULL,
    link varchar(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    --
    FOREIGN KEY (testServiceId) REFERENCES Test_service (id),
    FOREIGN KEY (employeeId) REFERENCES Employees (id)
  );