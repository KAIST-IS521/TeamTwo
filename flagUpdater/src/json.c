#include "json.h"

/* debug protos */
void print_json_aux(json_t *element, int indent);
void print_json_indent(int indent);
const char *json_plural(int count);
void print_json_object(json_t *element, int indent);
void print_json_array(json_t *element, int indent);
void print_json_string(json_t *element, int indent);
void print_json_integer(json_t *element, int indent);
void print_json_real(json_t *element, int indent);
void print_json_true(json_t *element, int indent);
void print_json_false(json_t *element, int indent);
void print_json_null(json_t *element, int indent);

int json_parse(const char *text, json_t **result)
{
    json_t *root;
    json_error_t err;

    root = json_loads(text, 0, &err);

    if (!root) {
        log_errf("json: on line %d: %s", err.line, err.text);
        return -1;
    }

    *result = root;
    return 0;
}
