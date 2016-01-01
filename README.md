# Nodescan

![](pics/the_matrix.gif)

[![npm](https://img.shields.io/npm/v/nodescan.svg)](https://github.com/walchko/nodescan)
[![npm](https://img.shields.io/npm/l/nodescan.svg)](https://github.com/walchko/nodescan)
[![Travis](https://img.shields.io/travis/walchko/nodescan.svg)](https://travis-ci.org/walchko/nodescan)

[![NPM](https://nodei.co/npm/nodescan.png)](https://nodei.co/npm/nodescan/)


**still in development**

## Install

    npm install -g

## Usage

## Setup

For RPi, install this in `/etc/systemd/system/`.

    [Service]
    ExecStart=/usr/local/bin/nodescan
    Restart=always
    StandardOutput=syslog
    StandardError=syslog
    SyslogIdentifier=nodescan
    User=pi
    Group=pi
    Environment=NODE_ENV=production

    [Install]
    WantedBy=multi-user.target


## Change Log 

| Version | Date     | Comments |
|---------|----------|----------|
| 0.1.0   | 1 Jan 16 | Initial commit |



