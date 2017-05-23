pw=is521
all: mysql

mysql:
	sudo apt-get update
	export DEBIAN_FRONTEND=noninteractive
	sudo -E apt-get -q -y install mysql-server
	mysqladmin -u root password $(pw)
	mysql -uroot -p$(pw) < initallizeData.sql

.PHONY: all mysql
