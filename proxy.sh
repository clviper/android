#!/bin/bash
function finish {
   adb shell "iptables -t nat -F"
   adb reverse --remove-all
}
trap finish EXIT
adb shell "iptables -t nat -F"
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 80 -j DNAT --to-destination 127.0.0.1:8080"
adb shell "iptables -t nat -A OUTPUT -p tcp --dport 443 -j DNAT --to-destination 127.0.0.1:8080"
adb shell "iptables -t nat -A POSTROUTING -p tcp --dport 80 -j MASQUERADE"
adb shell "iptables -t nat -A POSTROUTING -p tcp --dport 443 -j MASQUERADE"
adb reverse tcp:$1 tcp:8080
read -n1 -r -p "Android device traffic being redirected to $1 port on localhost. Press any key to stop and clean up device rules ..." key
adb shell "iptables -t nat -F"
adb reverse --remove-all
