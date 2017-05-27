#!/bin/bash
set -x
../gen_root_pw.py
pw=$(cat ../rootpw)
#echo "mysql-server mysql-server/root_password password ${pw}" | debconf-set-selections
#echo "mysql-server mysql-server/root_password_again password ${pw}" | debconf-set-selections
#apt-get -y install mysql-server
service mysql restart
mysqladmin -uroot password ${pw}
mysql -uroot -p${pw} < resetTable.sql
mysql -uroot -p${pw} < insertData.sql
