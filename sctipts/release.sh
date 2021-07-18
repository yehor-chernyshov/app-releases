#!/bin/bash

#USAGE ./release.sh -e 'ENV' -t 'TAG' -b 'BRANCH' -c 'COMMIT_HASH' -u 'URL' -k 'KEY' -p 'PROJECT' 
# Defined values 
URL=
KEY=
PROJECT=
ENV=

while getopts e:t:b:c:u:k:p: flag
do
    case "${flag}" in
        e) env=${OPTARG};;
        t) tag=${OPTARG};;
        b) branch=${OPTARG};;
        c) commit=${OPTARG};;
        u) url=${OPTARG};;
        k) key=${OPTARG};;
        p) project=${OPTARG};;
    esac
done

env=${env:-$ENV}
url=${url:-$URL}
key=${key:-$KEY}
project=${project:-$PROJECT}

if [ -x "$(command -v git)" ]; then
    COMMIT=$(git rev-parse HEAD)
    BRANCH=$(git branch --show-current)
    TAG=$(git describe --abbrev=0 --tags)
    commit=${commit:-$COMMIT}
    branch=${branch:-$BRANCH}
    tag=${tag:-$TAG}
fi

if [ -z "$env" ]; then
    echo "ENV is not defined."
    exit 1;
fi

if [[ -z $tag && -z $branch && -z $commit ]]; then
    echo "TAG or BRANCH or COMMIT should be defined."
    exit 1;
fi
if [ -z "$url" ]; then
    echo "URL is not defined."
    exit 1;
fi
if [ -z "$key" ]; then
    echo "AUTH KEY is not defined."
    exit 1;
fi
if [ -z "$project" ]; then
    echo "PROJECT is not defined."
    exit 1;
fi

printf -v DATA_RAW '{"projectName":"%s","env":"%s"' $project $env

if [ -n "$tag" ]; then
    printf -v TAG ',"tag":"%s"' $tag
    DATA_RAW+=$TAG
fi

if [ -n "$branch" ]; then
    printf -v BRANCH ',"branch":"%s"' $branch
    DATA_RAW+=$BRANCH
fi

if [ -n "$commit" ]; then
    printf -v COMMIT_HASH ',"commitHash":"%s"' $commit
    DATA_RAW+=$COMMIT_HASH
fi

DATA_RAW+='}'

curl --location --request POST "${URL}" \
--header "Authorization: ${KEY}" \
--header 'Content-Type: application/json' \
--data-raw "$DATA_RAW"