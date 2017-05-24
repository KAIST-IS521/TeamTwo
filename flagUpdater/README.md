Flag Updater
============

Flag updater for `/var/ctf/shoppingmall.flag`.

# Installation

    # make
    
Dependencies are listed below and should be installed automatically.

 - [GPGME from GnuPG](https://www.gnupg.org/software/gpgme/index.html) (`libgpgme11-dev`)
 - [Open SSL](https://www.openssl.org/) (`libssl-dev`)
 - [Jansson](http://www.digip.org/jansson/) - JSON parser library (`libjansson-dev`)

# Usage

    # sudo build/flagUpdater priv_key.asc

*NOTE:* Root privileges is required to bind port 42 and write to `/var/ctf`.

The program outputs a lot of useful logging to `stdout` which could be piped to
a file. To conveniently do this, use the script `run.sh`, like so:

    # sudo ./run.sh priv_key.asc
    
The logfile is named `flagUpdater.log` and is created in the same directory. The
file is truncated on each run!

# Documentation

The source code, found in `src/`, is divided into encapsulated modules.
Following is a brief explanation of each module.

 - `main.c` - Main entry point of program
 - `gpg.h` - All GPG logic, encapsulating GPGME
 - `sock.h` - All socket logic, developed in earlier activities
 - `file.h` - Module handling all file operations, such as writing to files and creating directories
 - `base64.h` - base64 encoding using OpenSSL library
 - `json.h` - Parsing JSON which wraps Jansson
 - `ip.h` - Parsing of IPs in correct manner using Linux API
 - `logger.h` - Custom logger macros, developed in earlier activities
