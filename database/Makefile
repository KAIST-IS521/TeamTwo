pw=is521
all: mysql

mysql:
	sudo apt-get update
	echo 'mysql-server mysql-server/root_password password $(pw)' | sudo debconf-set-selections
	echo 'mysql-server mysql-server/root_password_again password $(pw)' | sudo debconf-set-selections
	sudo apt-get -y install mysql-server
	mysql -uroot -p$(pw) < initallizeData.sql

.PHONY: all mysql
