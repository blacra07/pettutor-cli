let lightblue = require('bean-sdk');
let util = require('util');

let sdk = lightblue.sdk()

let DEVICES = [
    "4ba6b960a8ca441a8ad184d99a8a7e38"
]

sdk.on('discover', (scannedDevice)=> {
    // We now have a `ScannedDevice` object, found in src/lightblue/devices.js
    if (!DEVICES.includes(scannedDevice.getAddress())) {
        console.log("skipping " + scannedDevice.getName())
        return
    }
    console.log("connecting to " + scannedDevice.getName())

    sdk.connectScannedDevice(scannedDevice, (err, bean)=> {
        // We now have a `LightBlueDevice` object (named bean), found in src/lightblue/devices.js
        if (err) {
            console.log(`Bean connection failed: ${err}`)
            return
        }
        bean.lookupServices((err)=> {
            // The bean is now ready to be used, you can either call the methods available
            // on the `LightBlueDevice` class, or grab the individual services objects which
            // provide their own API, for example: bean.getDeviceInformationService().

            bean.sendSerial(new Buffer('CMD-FEED'), (err, resp) => {
                if (err) {
                    console.log('ERR FEEDING - ' + err)
                    return
                }
                console.log('FED - ' + util.inspect(resp))
            })
            if (err) {
                console.log(`Service lookup FAILED: ${err}`)
                return
            }
        })
    })
})

sdk.startScanning(10, true)
