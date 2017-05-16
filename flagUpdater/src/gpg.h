#ifndef GPG_H
#define GPG_H

#include <stdlib.h>
#include <fts.h>
#include <string.h>

#include "logger.h"

#define EGPG_UNKNOWN (1)

#define GPG_KEYS_DIR "./keys"

int gpg_find_key(const char *name, char **key);

#endif /* GPG_H */
