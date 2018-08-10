#!/bin/bash
function finish {
   adb shell "iptables -t nat -F"
}
trap finish EXIT
adb shell "iptables -t nat -F"
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 80 -j DNAT --to-destination $1"
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -j DNAT --to-destination $1"
adb shell "iptables -t nat -A POSTROUTING -p tcp --dport 80 -j MASQUERADE"
adb shell "iptables -t nat -A POSTROUTING -p tcp --dport 443 -j MASQUERADE"
read -n1 -r -p "Traffic being redirected to $1. Press any key to stop and clean up device rules ..." key
adb shell "iptables -t nat -F"
