DROP TABLE IF EXISTS country;

CREATE TABLE country(
    id SERIAL PRIMARY KEY NOT NULL,
    country VARCHAR(255) NOT NULL,
    totalConfirmedCases VARCHAR(255) NOT NULL,
    totalDeathsCases VARCHAR(255) NOT NULL,
    totalRecoveredCases VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL
);
