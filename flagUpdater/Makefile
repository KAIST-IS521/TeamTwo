CC = gcc
CFLAGS = -Wall -std=gnu99
CLIBS = -lgpgme -ljansson -lcrypto -lm -D_FILE_OFFSET_BITS=64

SDIR = src
ODIR = build

SRC = $(wildcard $(SDIR)/*.c)
OBJ = $(patsubst $(SDIR)/%.c, $(ODIR)/%.o, $(SRC))

TARGET = flagUpdater

.PHONY: all debug release clean install

all: install release

$(ODIR):
	mkdir -p $@

$(ODIR)/%.o: $(SDIR)/%.c
	$(CC) $(CFLAGS) $(CLIBS) -c $< -o $@

$(ODIR)/$(TARGET): $(ODIR) $(OBJ)
	$(CC) $(CFLAGS) $(CLIBS) -o $@ $(OBJ)

release: CFLAGS += -O3
release: $(ODIR)/$(TARGET)

debug: CFLAGS += -g -DDEBUG
debug: $(ODIR)/$(TARGET)

install:
	sudo apt-get --assume-yes update
	sudo apt-get --assume-yes install libgpgme11-dev libssl-dev libjansson-dev

clean:
	rm -rf $(ODIR)/*
