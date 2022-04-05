/* drop table users Cascade;
drop table experience cascade;
drop table education cascade;
drop table profile cascade;
drop table posts cascade;
drop table comments;
drop table likes; */
	
CREATE TABLE users (
  uid SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL , 
  password VARCHAR,
  avatar VARCHAR,
  date timestamp without time zone NOT NULL
   DEFAULT (current_timestamp AT TIME ZONE 'UTC+1')
);
CREATE TABLE experience (
  eid SERIAL PRIMARY KEY,
  uid INTEGER REFERENCES users(uid),
  title VARCHAR NOT NULL,
  company VARCHAR NOT NULL,
  location VARCHAR,
  from_date DATE,
  to_date DATE,
  current BOOLEAN,
  description TEXT
);

CREATE TABLE education (
  eid SERIAL PRIMARY KEY,
  uid INTEGER REFERENCES users(uid),
  school VARCHAR NOT NULL,
  degree VARCHAR NOT NULL,
  fieldofstudy VARCHAR,
  from_date DATE,
  to_date DATE,
  current BOOLEAN,
  description TEXT
);

CREATE TABLE profile(
  profid SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(uid),
  company VARCHAR,
  website VARCHAR,
  location VARCHAR,
  status VARCHAR NOT NULL,
  skills VARCHAR[],
  bio VARCHAR,
  githubusername VARCHAR,
  experienceid INTEGER REFERENCES experience(eid),
  educationid INTEGER REFERENCES education(eid),
  youtube VARCHAR,
  facebook VARCHAR,
  twitter VARCHAR,
  linkedin VARCHAR,
  instagram VARCHAR,
  date timestamp without time zone NOT NULL
   DEFAULT (current_timestamp AT TIME ZONE 'UTC+1')

);

CREATE TABLE posts (
  pid SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES users(uid),
  text VARCHAR NOT NULL,
  name TEXT NOT NULL,
  avatar VARCHAR,
  likes INTEGER[],
  comments INTEGER[],
  date timestamp without time zone NOT NULL
   DEFAULT (current_timestamp AT TIME ZONE 'UTC+1')
);


CREATE TABLE comments (
  cid SERIAL PRIMARY KEY,
  pid INT REFERENCES posts(pid),
  userid INT REFERENCES users(uid),
  text VARCHAR,
  date timestamp without time zone NOT NULL
   DEFAULT (current_timestamp AT TIME ZONE 'UTC+1')
);

CREATE TABLE likes (
  lid SERIAL PRIMARY KEY,
  userid INT REFERENCES users(uid),
  postid INT REFERENCES posts(pid)
);


