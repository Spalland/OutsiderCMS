angular.module('bucketService', [])

.service('Bucket', function() {
    var bucket = "images.outsider"  ;

    var setBucket = function(newBucket) {
        bucket = newBucket;
    }

    var getBucket = function(){
        return bucket;
    }

    return {
        set : setBucket,
        get : getBucket
    };
});