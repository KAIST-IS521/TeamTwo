CC = gcc
CFLAGS = -Wall -std=gnu99

SDIR = src
ODIR = build

SRC = $(wildcard $(SDIR)/*.c)
OBJ = $(patsubst $(SDIR)/%.c, $(ODIR)/%.o, $(SRC))

TARGET = flagUpdater

.PHONY: all debug release clean

all: release

$(ODIR):
	mkdir -p $@

$(ODIR)/%.o: $(SDIR)/%.c
	$(CC) $(CFLAGS) -c $< -o $@

$(ODIR)/$(TARGET): $(ODIR) $(OBJ)
	$(CC) $(CFLAGS) -o $@ $(OBJ)

release: CFLAGS += -O3
release: $(ODIR)/$(TARGET)

debug: CFLAGS += -g -DDEBUG
debug: $(ODIR)/$(TARGET)

clean:
	rm -rf $(ODIR)/*
