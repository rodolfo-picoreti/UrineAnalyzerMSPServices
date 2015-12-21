
Services.initialize = function (continuation) {
  
  Services.serialHandle = new Serial(function () {
    Services.serialHandle.on('data', function (packet) {
      let id = packet.readUInt8(0)
      let type = Services.type.deserialize(id)

      if (type === 'response') {
        Services.msp.receive(packet.slice(1))
      }
      else if (type === 'request') {
        Services.rpi.receive(packet.slice(1))
      }
    })

    continuation()
  })
  
}

Services.on = function(method, callback) {
  Services.rpi.on(method, callback)
}

Services.call = function(method, args, onSuccess) {
  Services.msp.send(method, args, onSuccess)
}