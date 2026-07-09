
const os = require('os');

// function getLocalIp() {
//   const nets = os.networkInterfaces();

//   const wifi = nets['Wi-Fi'];
//   if (wifi) {
//     const ipv4 = wifi.find((net) => net.family === 'IPv4' && !net.internal);
//     if (ipv4) return ipv4.address;
//   }

//   return '127.0.0.1';
// }



console.log(getLocalIp())
 