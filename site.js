// simple gallery
// (c)copyright 2020 by Gerald Wodni <gerald.wodni@gmail.com>

const imageMagick = require("gm").subClass({imageMagick: true});

module.exports = {
    setup: function( k ) {
        const imageRootDir = "images/galleries"
        const title = process.env.KERN_GALLERY_TITLE;
        const prefixPath = process.env.KERN_GALLERY_PREFIX;
        const ignoreGalleries = process.env.KERN_GALLERY_IGNORE || "";
        const timeout = (process.env.KERN_GALLERY_CACHE_TIMEOUT || 10) * 60 * 1000;

        /* resized images */
        k.static.prefixCache( "/images-thumbnail/", "/images/", function( filepath, cachepath, next ) {
            imageMagick( filepath ).autoOrient().resize( 512, 512 ).write( cachepath, next );
        }, { router: k.router });

        /* view value extender: variables always available to views */
        function vals( req, obj ) {
            return Object.assign( {
                prefixPath: prefixPath,
                ignoreGalleries: ignoreGalleries.split(";"),
                title: title
            }, obj );
        }

        /* get cached tree as promise */
        var treeCache = null;
        function getTree( website ) {
            if( treeCache != null )
                return Promise.resolve( treeCache );

            return new Promise( (fulfill, reject) => {
                k.hierarchy.readHierarchyTree( website, imageRootDir, { prefix: "/" },
                function( err, tree ) {
                    if( err ) return reject( err );
                    fulfill( treeCache = tree );
                    /* invalidate cache after timeout */
                    setTimeout( () => treeCache = null, timeout );
                });
            });
        }

        /* render gallery */
        k.router.get( "/gallery/:name", function( req, res, next ) {
            const gallery = req.requestman.id("name");
            getTree( req.kern.website )
            .then( tree => {
                if( !(gallery in tree.dirs) )
                    return k.httpStatus( req, res, 404 );
                k.jade.render( req, res, "gallery", vals( req, { tree, gallery, files: tree.dirs[gallery].files } ) );
            })
            .catch( next );
        });

        /* no gallery selected, just render home */
        k.router.get( "/", function( req, res, next ) {
            getTree( req.kern.website )
            .then( tree => k.jade.render( req, res, "home", vals( req, { tree: tree }) ) )
            .catch( next );
        });
    }
};
