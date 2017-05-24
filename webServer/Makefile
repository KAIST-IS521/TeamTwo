all: npm_install import_keys

npm_install:
	npm install
	mkdir -p tmp

import_keys:
	wget https://github.com/KAIST-IS521/2017-Spring/archive/master.zip
	unzip master.zip
	sudo gpg --import 2017-Spring-master/students/*.pub

.PHONY: all npm_install import_keys
