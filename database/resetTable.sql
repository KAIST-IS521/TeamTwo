DROP DATABASE IF EXISTS shoppingmalldb;
CREATE DATABASE shoppingmalldb;
use shoppingmalldb;

CREATE TABLE  github_users (
    github_id           varchar(32)   NOT NULL ,
    email               varchar(64)   NOT NULL ,
    CONSTRAINT pk_github_users PRIMARY KEY ( github_id )
) engine=InnoDB;


CREATE TABLE  users (
    user_id              varchar(32)   NOT NULL ,
    pw                   varchar(256)  NOT NULL ,
    github_id            varchar(32)   NOT NULL ,
    CONSTRAINT pk_users PRIMARY KEY ( user_id ),
    CONSTRAINT fk_users_github_id FOREIGN KEY ( github_id ) REFERENCES  github_users( github_id )
) engine=InnoDB;


CREATE TABLE  messages (
    user_id              varchar(32)   NOT NULL ,
    msg                  varchar(2048)  NOT NULL ,
    added_time           DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    CONSTRAINT fk_messages_user_id FOREIGN KEY ( user_id ) REFERENCES  users( user_id )
) engine=InnoDB;


CREATE TABLE  products (
    product_id           int  NOT NULL  AUTO_INCREMENT,
    price                varchar(30)   NOT NULL  ,
    name                 varchar(100)  NOT NULL  ,
    imgsrc               varchar(200)  DEFAULT  '/images/default.jpg',
    serial_key                  varchar(200)  NOT NULL  ,
    CONSTRAINT pk_products PRIMARY KEY ( product_id )
) engine=InnoDB;


CREATE TABLE  shopping_cart (
    cart_id              int  NOT NULL  AUTO_INCREMENT,
    user_id              varchar(30)  NOT NULL  ,
    product_id           int  NOT NULL ,
    product_num          int  NOT NULL  ,
    added_time           DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    CONSTRAINT pk_shopping_cart PRIMARY KEY ( cart_id ),
    CONSTRAINT fk_shopping_cart_user_id FOREIGN KEY ( user_id ) REFERENCES  users( user_id ),
    CONSTRAINT fk_shopping_cart_product_id FOREIGN KEY ( product_id ) REFERENCES  products( product_id )
 ) engine=InnoDB;


CREATE TABLE  orders (
    order_id             varchar(64)  NOT NULL  ,
    user_id              varchar(30)  NOT NULL  ,
    bank_account         varchar(32)  NOT NULL  ,
    bank_pw              varchar(32)  NOT NULL  ,
    added_time           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status               varchar(30) NOT NULL DEFAULT 'pending',
    CONSTRAINT fk_orders_user_id FOREIGN KEY ( user_id ) REFERENCES  users( user_id ),
    CONSTRAINT pk_orders_order_id PRIMARY KEY ( order_id )
 ) engine=InnoDB;


CREATE TABLE  order_items (
    order_id             varchar(64)  NOT NULL  ,
    product_id           int  NOT NULL ,
    product_num          int  NOT NULL ,
    CONSTRAINT fk_order_item_product_id FOREIGN KEY ( product_id ) REFERENCES  products( product_id ),
    CONSTRAINT fk_order_item_order_id FOREIGN KEY ( order_id ) REFERENCES orders( order_id )
 ) engine=InnoDB;
