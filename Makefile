all: packages database webServer flagUpdater

packages:
	./set_timezone.sh
	sudo apt-get -yy update
	sudo apt-get install -yy python-pip
	sudo pip install requests
	sudo pip install colorlog
	wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-x86.tar.xz
	xz -d node-v6.10.3-linux-x86.tar.xz
	tar -xvf node-v6.10.3-linux-x86.tar
	sudo ln -s $(PWD)/node-v6.10.3-linux-x86/bin/node /usr/bin/node
	sudo ln -s $(PWD)/node-v6.10.3-linux-x86/bin/npm /usr/bin/npm

database:
	$(MAKE) -C database

webServer:
	$(MAKE) -C webServer

flagUpdater:
	$(MAKE) -C flagUpdater

.PHONY: all packages database webServer flagUpdater
