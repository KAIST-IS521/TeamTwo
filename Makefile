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
	ln -s $(PWD)/node-v6.10.3-linux-x86/bin/node /usr/bin/node
	ln -s $(PWD)/node-v6.10.3-linux-x86/bin/npm /usr/bin/npm




.PHONY: all flagUpdater packages
