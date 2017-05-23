#ifndef FILE_H
#define FILE_H

#include <stdio.h>
#include <stdbool.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>


#include "logger.h"

/* check if file exists */
bool file_exists(const char *filepath);
/* truncate and write to file */
int file_write(const char *path, const char *text);
/* create directory if it does not already exist */
int file_mkdir(const char *path);

#endif /* FILE_H */
