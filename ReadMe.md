# Simple Gallery

This gallery is built upon [kern.js](https://github.com/GeraldWodni/kern.js).
It is made for easy use with docker.

## Docker instructions:
1. Build [kern.js docker image](https://github.com/GeraldWodni/kern.js/blob/master/Dockerfile)
2. Run docker with the following mounts:
3. Mount or just load this repository under `/usr/src/app/websites/gallery`
4. Mount image files in subfolders under `/usr/src/app/websites/gallery/images/galleries`
5. Set environment variable `KERN_STATIC_HOST` to `gallery`

## Environment variables
#### KERN\_GALLERY\_TITLE
Title to be displayed as `h1` and page-`title`

#### KERN\_GALLERY\_PREFIX
Prefix path under which this gallery is accessed. i.e. `/trips/korea/gsl`.
Defaults to `/`.

#### KERN\_GALLERY\_CACHE\_TIMEOUT
Cache is invalidated after this amount of seconds (new images will be visible when uploaded)
Defaults to `600` seconds i.e. 10 minutes.
