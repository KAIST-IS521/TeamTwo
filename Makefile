all: packages flagUpdater

flagUpdater:
	$(MAKE) -C flagUpdater

packages:
	sudo apt-get install -yy python-pip
	sudo pip install requests
	sudo pip install colorlog
	wget https://nodejs.org/dist/v6.10.3/node-v6.10.3-linux-x86.tar.xz
	xz -d node-v6.10.3-linux-x86.tar.xz
	tar -xvf node-v6.10.3-linux-x86.tar
	ln -s /usr/bin/node $(pwd)/node-v6.10.3-linux-x86/bin/node
	ln -s /usr/bin/npm $(pwd)/node-v6.10.3-linux-x86/bin/npm




.PHONY: all flagUpdater packages
