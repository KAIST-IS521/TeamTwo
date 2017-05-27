all: packages database webServer flagUpdater

packages:
	./set_timezone.sh
	apt-get -yy update
	apt-get install -yy python-pip
	apt-get install -yy unzip
	pip install requests
	pip install beautifulsoup4
	pip install colorlog
	wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-x86.tar.xz
	xz -d node-v6.10.3-linux-x86.tar.xz
	tar -xvf node-v6.10.3-linux-x86.tar
	rm -f /usr/bin/node
	ln -s $(PWD)/node-v6.10.3-linux-x86/bin/node /usr/bin/node
	rm -f /usr/bin/npm
	ln -s $(PWD)/node-v6.10.3-linux-x86/bin/npm /usr/bin/npm

database:
	$(MAKE) -C database

webServer:
	$(MAKE) -C webServer

flagUpdater:
	$(MAKE) -C flagUpdater

.PHONY: all packages database webServer flagUpdater
