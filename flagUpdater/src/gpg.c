#include "gpg.h"

int gpg_find_key(const char *name, char **key)
{
    int ret;
    FTS *ftsp;
    FTSENT *p;
    int fts_options = FTS_COMFOLLOW | FTS_LOGICAL | FTS_NOCHDIR;
    char *paths[2] = { GPG_KEYS_DIR, 0 };

    /* append ".pub" to key name */
    /* NOTE: strlen does not include null char */
    int filename_len = strlen(name) + strlen(".pub") + 1;
    char filename[filename_len];
    /* NOTE: sprintf automatically adds trailing null char */
    sprintf(filename, "%s.pub", name);

    /* open directory */
    errno = 0;
    ftsp = fts_open(paths, fts_options, NULL);
    if (ftsp == NULL) {
        log_perr("fts_open");
        return -1;
    }

    /* TODO: check if dir exists */

    /* read file by file */
    ret = EGPG_UNKNOWN;
    while ((p = fts_read(ftsp)) != NULL) {
        /* check for error */
        if (p->fts_info == FTS_ERR) {
            perror("fts_read");
            exit(EXIT_FAILURE);
        }
        /* continue if anything else than file */
        else if (p->fts_info != FTS_F) {
            continue;
        }

        /* find correct key by filename */
        if (strncmp(filename, p->fts_name, strlen(filename)) == 0) {
            log_infof("found key %s", name);

            ret = 0;
            break;
        }
    }

    /* clean up */
    fts_close(ftsp);

    return ret;
}
