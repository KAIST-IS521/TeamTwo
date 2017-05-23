#include "file.h"

bool file_exists(const char *filepath)
{
    return access(filepath, F_OK) == 0;
}

int file_write(const char *path, const char *text)
{
    int ret = 0, len;
    FILE *fp;

    len = strlen(text);

    /* open file pointer */
    fp = fopen(path, "w");
    if (!fp) {
        log_perr(path);
        return -1;
    }

    /* write to file) */
    fputs(text, fp);

    /* add new line */
    if (len > 1 && text[len - 1] != '\n') {
        fputs("\n", fp);
    }

    /* close file pointer */
    if (fclose(fp)) {
        log_perr(path);
        return -1;
    }

    return ret;
}

int file_mkdir(const char *path)
{
    int ret;

    ret = mkdir(path, 0700);
    if (ret < 0) {
        log_perr("mkdir");
        return -1;
    }

    return 0;
}
