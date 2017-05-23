#include "time.h"

char *time_now()
{
    time_t t;
    struct tm tm;
    char buf[256] = { '\0' };

    /* get time */
    t = time(NULL);
    tm = *localtime(&t);

    sprintf(buf, "%d-%d-%d %02d:%02d:%02d",
            tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday,
            tm.tm_hour, tm.tm_min, tm.tm_sec);

    return strdup(buf);
}
