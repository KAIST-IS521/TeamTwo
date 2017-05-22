#ifndef JSON_H
#define JSON_H

#include <stdlib.h>
#include <stdio.h>
#include <jansson.h>

#include "logger.h"

int json_parse(const char *text, json_t **result);
void json_print(json_t *root);

#endif /* JSON_H */
