#!/bin/bash
export TZ=Asia/Seoul
sudo ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
