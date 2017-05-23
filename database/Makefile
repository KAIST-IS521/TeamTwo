pw="is521"
all: mysql

mysql:
	sudo apt-get update
	sudo apt-get -y install mysql-server
	mysql -uroot -p$(pw) < initializeData.sql

.PHONY: all mysql