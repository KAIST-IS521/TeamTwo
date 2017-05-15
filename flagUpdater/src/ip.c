#include "ip.h"

bool ip_valid(const char *ip)
{
    int ret;
    struct sockaddr_in sa;

    /* use inet_pton to convert string for ip to binary */
    ret = inet_pton(AF_INET, ip, &(sa.sin_addr));

    /* check if successfully converted */
    return ret != 0;
}
