  
Services.rpi.methods.deserialize = function (id, packet) {
  let service = Services.utils.find(Services.rpi.methods.map, 'id', id)
  return {
    method: service.method,
    args: service.deserialize(packet)
  }
}

Services.rpi.methods.map = [
  {
    id: 0x00,
    method: "storeSample",
    deserialize(packet) {
      let result = {
        ph: {
          raw: packet.readUInt16BE(0),
          voltage: packet.readUInt16BE(0)*3.3/16384.0
        },
        na: {
          raw: packet.readUInt16BE(2),
          voltage: packet.readUInt16BE(2)*3.3/16384.0
        },
        cl: {
          raw: packet.readUInt16BE(4),
          voltage: packet.readUInt16BE(4)*3.3/16384.0
        },
        k: {
          raw: packet.readUInt16BE(6),
          voltage: packet.readUInt16BE(6)*3.3/16384.0
        },
        conductivity: {
          raw: packet.readUInt16BE(8),
          voltage: packet.readUInt16BE(8)*3.3/16384.0
        },
        preheater: {
          raw: packet.readUInt16BE(10),
          voltage: packet.readUInt16BE(10)*3.3/16384.0,
          temperature: 0.0037007729*packet.readUInt16BE(10) + 10.2201522894
        },
        heater: {
          raw: packet.readUInt16BE(12),
          voltage: packet.readUInt16BE(12)*3.3/16384.0,
          temperature: 0.0037007729*packet.readUInt16BE(12) + 10.2201522894
        },
        sd1: packet.readUInt16BE(14),
        sd2: packet.readUInt16BE(16),
        //timestamp: packet.readUIntBE(18, 6),
        counter: packet.readUInt32BE(24)
      }   
      return result
    },
    serialize(buffer, offset, args) {
      return 0;
    }
  }
]
