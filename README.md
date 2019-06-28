IMAGE UPLOADER AND CROPPER

This a simple image uploader and image cropper built with Node.js and MySQL.

Steps To Run:

1. Download the project
2. Change Directory (cd) to the folder where you have downloaded the project.
3. Run following command (npm install) to install the dependencies.
4. Open the connect.js file located in the middleware folder.
5. Change the username, password, host and port in connect.js file to your mysql server's configurations.
6. Run the following two commands in MySQL gui or terminal to create database and table:
  
  a) CREATE SCHEMA `db_imgupload` DEFAULT CHARACTER SET utf8 ;

  b) CREATE TABLE `db_imgupload`.`img_details` (
      `sr_id` MEDIUMINT(10) NOT NULL AUTO_INCREMENT,
      `img_name` VARCHAR(500) NULL,
      `prep_datetime` DATETIME NULL,
      `mod_datetime` DATETIME NULL,
      `cancel_datetime` DATETIME NULL,
      PRIMARY KEY (`sr_id`));
 
 7. That's it now run nodemon index in your terminal and head over to localhost:3000 to see the project running.


Build With:
1. Node.js
2. Express.js
3. Handlebars
4. MySQL
5. Bootstrap
6. Jquery
7. Croppie
