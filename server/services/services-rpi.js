Services.rpi.callbacks = { }

Services.rpi.on = function(method, callback) {
  Services.rpi.callbacks[method] = callback
}

Services.rpi.receive = function (packet) {
  let id = packet.readUInt8(0) // method id
  let { method, args } = Services.rpi.methods.deserialize(id, packet.slice(1))
  let callback = Services.rpi.callbacks[method]
  if (callback) {
    callback(args)
  }
}