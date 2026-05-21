#!/bin/bash

INSTANCE_ID="YOUR_EC2_INSTANCE_ID"

ipv4_address=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query 'Reservations[0].Instances[0].PublicIpAddress' --output text)

file_to_find="../backend/.env.docker"
alreadyUpdate=$(sed -n "4p" ../backend/.env.docker)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo -e " ${GREEN}System Public Ipv4 address ${NC} : ${ipv4_address}"

if [[ "${alreadyUpdate}" == "CLIENT_URL=\"http://${ipv4_address}:31000\"" ]]
then
    echo -e "${YELLOW}${file_to_find} file is already updated to the current host's Ipv4 ${NC}"
else
    if [ -f ${file_to_find} ]
    then
        echo -e "${GREEN}${file_to_find}${NC} found.."
        echo -e "${YELLOW}Configuring env variables in ${NC} ${file_to_find}"
        sleep 7s
        sed -i -e "s|CLIENT_URL.*|CLIENT_URL=\"http://${ipv4_address}:31000\"|g" ${file_to_find}
        echo -e "${GREEN}env variables configured..${NC}"
    else
        echo -e "${RED}ERROR : File not found..${NC}"
    fi
fi