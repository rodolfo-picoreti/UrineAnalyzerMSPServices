Services.msp.callbacks = []

/* Send service request to MSP */
Services.msp.send = function (method, args, onResponse) {
  let buffer = new Buffer(64)

  buffer.writeUInt8(0x21, 0) // start of packet
  // Second byte is reserved for the payload size
  let size = 2
  size += Services.type.serialize('request', buffer, size)
  size += Services.msp.methods.serialize(method, args, buffer, size)
  buffer.writeUInt8(size - 2, 1)
  
  Services.serialHandle.write(buffer.slice(0, size))
  Services.msp.callbacks.push({ method, args, onResponse })
}

/* Parse the MSP response to a previous service request */
Services.msp.receive = function (packet) {
  let id = packet.readUInt8(0)
  let status = Services.status.deserialize(packet.readUInt8(1))

  if (Services.msp.callbacks.length === 0) {
    throw 'Services MSP: callback error!'
  }

  /*
  let args
  if (status == 'success') {
    args = Services.msp.methods.deserialize(id, packet.slice(2))
  }
  */

  let callback = Services.msp.callbacks.shift()
  if (callback.onResponse) {
    callback.onResponse(status, { method: callback.method, args: callback.args })
  }
}
