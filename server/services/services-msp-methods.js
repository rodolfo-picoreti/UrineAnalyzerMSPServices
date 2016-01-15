Services.msp.methods.serialize = function (method, args, buffer, offset) {
  try {
    let service = Services.utils.find(Services.msp.methods.map, 'method', method) 
    service.validateArgs(args)
    return service.serialize(args, buffer, offset)
  }
  catch (error) {
    throw new Error(`Msp methods serialize throwed: ${error}`)
  }
}

Services.msp.methods.deserialize = function (id, packet) {
  try {
    let service = Services.utils.find(Services.msp.methods.map, 'id', id)
    return { args: service.deserialize(packet) }   
  }
  catch (error) {
    throw new Error(`Msp methods deserialize throwed: ${error}`)
  }
}

function validateArray(args) {
  if (!args) throw `@${this.method} - args undefined`
  
  args.forEach((obj) => {
    if (this.validIds.indexOf(obj.id) == -1) {
      throw `@${this.method} - invalid id: ${obj.id}`
    }
  })
}

Services.msp.methods.map = [
  {
    id: 0x00,
    method: 'configureLocks',
    validateArgs: validateArray,
    validIds: [
      0, // SERVICE_LOCK_MOTORS
      1, // SERVICE_LOCK_VALVES
      2, // SERVICE_LOCK_HEATERS
      3  // SERVICE_LOCK_SENSOR_SELECT
    ],
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)
     
      let i = 0;
      args.forEach(function (obj) {
        buffer.writeUInt8(obj.id, offset + 1 + 2*i)
        buffer.writeUInt8(obj.value, offset + 2 + 2*i)
        ++i;
      })

      return 1 + 2*i
    },
    deserialize(payload) {
      let args = []
      
      for (let i = 0; i < payload.length; i += 2) {
        args.push({
          id: payload.readUInt8(i),
          value: payload.readUInt8(i+1)
        })
      }

      return args
    }
  },  
  {
    id: 0x01,
    method: 'startSampling',
    validateArgs(args) {
      if (args.samplingTime < 0) {
        throw `@${this.method} - invalid sampling time: ${samplingTime}`
      }
    },
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)
      buffer.writeUInt16BE(args.samplingTime, offset+1)
      return 3
    },
    deserialize(payload) {
      let samplingTime = payload.readUInt16BE(0)
      return { samplingTime }
    }
  },
  {
    id: 0x02,
    method: 'stopSampling',
    validateArgs() { 
    },
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)
      return 1
    },
    deserialize(payload) {
      return {}
    }
  },
  {
    id: 0x03,
    method: 'selectSensor',
    validateArgs(args) {
      if (this.validIds.indexOf(args.id) == -1)
        throw `@${this.method} - invalid sensor id: ${args.id}`
    },
    validIds: [
      0, // SENSOR_PH
      1, // SENSOR_NA
      2, // SENSOR_CL
      3, // SENSOR_K
      4  // SENSOR_CONDUCTIVIT
    ],
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)
      buffer.writeUInt8(args.id, offset + 1)
      return 2
    },
    deserialize(payload) {
      let id = payload.readUInt8(0)
      return { id }
    }
  },
  {
    id: 0x10,
    method: 'configureValves',
    validateArgs: validateArray,
    validIds: [
      0,  // VALVE_PROBE_LOWER
      1,  // VALVE_PROBE_UPPER
      2,  // VALVE_WASH
      3,  // VALVE_SLOPE_REAGENT
      4   // VALVE_CAL_REAGENT
    ],
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)

      let i = 0;
      args.forEach(function (obj) {
        buffer.writeUInt8(obj.id, offset + 1 + 2*i)
        buffer.writeUInt8(obj.value, offset + 2 + 2*i)
        ++i;
      })

      return 1 + 2*i
    },
    deserialize(payload) {
      let args = []
      
      for (let i = 0; i < payload.length; i += 2) {
        args.push({
          id: payload.readUInt8(i),
          value: payload.readUInt8(i+1)
        })
      }

      return args
    }
  },
  {
    id: 0x11,
    method: 'configurePumps',
    validateArgs: validateArray,
    validIds: [
      0, // PWM_REAGENT_PUMP
      1  // PWM_SAMPLE_WASTE_PUMP
    ],
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)

      let i = 0;
      args.forEach(function (obj) {
        buffer.writeUInt8(obj.id, offset + 1 + 3*i)
        buffer.writeUInt16BE(obj.value, offset + 2 + 3*i)
        ++i;
      })

      return 1 + i*3
    },
    deserialize(payload) {
      let args = []
      
      for (let i = 0; i < payload.length; i += 3) {
        args.push({
          id: payload.readUInt8(i),
          value: payload.readUInt16BE(i+1)
        })
      }

      return args
    }
  },
  {
    id: 0x12,
    method: 'configureHeaters',
    validateArgs: validateArray,
    validIds: [
      2, // PWM_PREHEATER
      3  // PWM_INTHEATER
    ],
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id, offset)

      let i = 0;
      args.forEach(function (obj) {
        buffer.writeUInt8(obj.id, offset + 1 + 3*i)
        buffer.writeUInt16BE(obj.value, offset + 2 + 3*i)
        ++i;
      })

      return 1 + i*3
    },
    deserialize(payload) {
      let args = []
      
      for (let i = 0; i < payload.length; i += 3) {
        args.push({
          id: payload.readUInt8(i),
          value: payload.readUInt16BE(i+1)
        })
      }

      return args
    }
  },
  {
    id: 0x13,
    method: 'configureSDLeds',
    validateArgs() {

    },
    serialize(args, buffer, offset) {
      buffer.writeUInt8(this.id)
      return 1
    },
    deserialize(payload) {
      return { }
    }
  }
]
