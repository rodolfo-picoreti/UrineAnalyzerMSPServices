
Services.initialize = function (continuation) {
  
  let onOpen = function () {
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
  }

  Services.serialHandle = new Serial(onOpen)
  
}

Services.isConnected = function() {
  return Services.serialHandle.isConnected()
}

Services.on = function(method, callback) {
  Services.rpi.on(method, callback)
}

Services.call = function(method, args, onSuccess) {
  Services.msp.send(method, args, onSuccess)
}