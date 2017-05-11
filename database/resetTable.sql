drop table orders; 
drop table shopping_cart; 
drop table products; 
drop table users;

CREATE TABLE  users ( 
	user_id              varchar(32)   NOT NULL  ,
	pw	             varchar(256)  NOT NULL ,
	CONSTRAINT pk_users PRIMARY KEY ( user_id )
) engine=InnoDB;


CREATE TABLE  products ( 
	product_id           int  NOT NULL  AUTO_INCREMENT,
	price	             varchar(30)  NOT NULL  ,
	name                 varchar(100)  NOT NULL  ,
	imgsrc               varchar(200)  DEFAULT  '/images/default.jpg',
	CONSTRAINT pk_products PRIMARY KEY ( product_id )
) engine=InnoDB;


CREATE TABLE  shopping_cart ( 
	user_id              varchar(30)  NOT NULL  ,
	product_id           int NOT NULL , 
	product_num          int  NOT NULL  ,    
	CONSTRAINT fk_shopping_cart_user_id FOREIGN KEY ( user_id ) REFERENCES  users( user_id ),
	CONSTRAINT fk_shopping_cart_product_id FOREIGN KEY ( product_id ) REFERENCES  products( product_id )
 ) engine=InnoDB;

CREATE TABLE  orders ( 
	order_id 			 int  NOT NULL  AUTO_INCREMENT, 
	user_id              varchar(30)  NOT NULL  ,
	product_id           int NOT NULL , 
	product_num          int  NOT NULL  ,    
	CONSTRAINT fk_orders_user_id FOREIGN KEY ( user_id ) REFERENCES  users( user_id ),
	CONSTRAINT fk_orders_product_id FOREIGN KEY ( product_id ) REFERENCES  products( product_id ),
	CONSTRAINT pk_orders_order_id PRIMARY KEY ( order_id )
 ) engine=InnoDB;
