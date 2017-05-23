#ifndef JSON_H
#define JSON_H

#include <stdlib.h>
#include <stdio.h>
#include <jansson.h>

#include "logger.h"

int json_parse(const char *text, json_t **result);

#endif /* JSON_H */
