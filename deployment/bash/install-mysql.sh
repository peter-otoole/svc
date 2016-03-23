#!/bin/bash

#
# Bash script to install MySQL server on a Ubuntu machine - wrote for 15.10
#
# @author Peter O'Toole peterjotoole@outlook.com
# @created 19/03/2016
#
#


#Turns off ui interaction
export DEBIAN_FRONTEND=noninteractive

MY_SQL_VERSION="mysql-server-5.6"
SQL_ROOT_PASSWORD="ReplaceMe"


sudo apt-get -q -y install "$(MY_SQL_VERSION)"

sudo mysqladmin -u root password "$(SQL_ROOT_PASSWORD)"