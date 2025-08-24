import {S3Client, PutBucketCorsCommand} from '@aws-sdk/client-s3';
import {createPresignedPost} from '@aws-sdk/s3-presigned-post' ;

import  makeGetSignedUrl from "./getSignedUrl";
import  test from "./testFunction";

export default {
    getSignedUrl: makeGetSignedUrl({
        S3Client,
        PutBucketCorsCommand,
        createPresignedPost,
    }),
    test
}