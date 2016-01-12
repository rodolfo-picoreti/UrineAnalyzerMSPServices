let serialport = Meteor.npmRequire("serialport")
let SerialPort = serialport.SerialPort

let buffer = new Buffer(0)

Buffer.prototype.indexOf = function(value, offset) {
  if (typeof(offset) === 'undefined') offset = 0

  for (var i = offset; i < this.length; i++) {
    if (this[i] == value) return i
  }

  return -1
}

function parser(emitter, data) { 
  buffer = Buffer.concat([buffer, data])

  let startByte = buffer.indexOf(0x21)
  while (startByte != -1) {
    let payloadSize = buffer.readUInt8(startByte + 1) 
    let payloadStart = startByte + 2
    let payloadEnd = payloadStart + payloadSize

    /*
     *  If payloadEnd is greater then length then the 
     *  packet did not arrived yet, slice the buffer and return
     */
    if (payloadEnd > buffer.length) {
      buffer = buffer.slice(startByte)
      return
    }

    emitter.emit('data', buffer.slice(payloadStart, payloadEnd))  
    startByte = buffer.indexOf(0x21, payloadEnd)
  }

  /* 
   * If we leave the loop then we consumed the whole buffer
   */
  buffer = Buffer(0)
}

Serial = class Serial {
  
  constructor(onOpen) {
    this.onOpen = onOpen
    this.port = 'undefined'
    this.baudrate = 115200
    this.connect()
  }

  connect() {
    let self = this

    serialport.list(function (error, ports) {
      if (typeof(ports) !== 'undefined') {
        //console.log(ports)
        
        ports = ports.filter(function (port) {
          return (port.pnpId.indexOf('Texas_Instruments') == -1)
        })
        
        if (ports.length !== 0) { 
          console.log('>> Serial: MSP432 found')
          self.port = ports[0].comName
          self.serialHandle = new SerialPort(self.port, {
            baudrate: self.baudrate,
            parser: parser
          })
          
          self.open()
          return;
        }
      }
      self.port = 'undefined'
      console.log('>> Serial: Unable to find MSP432!')
    })  
  }

  open() {
    let self = this
    this.serialHandle.open(function (error) {
      if (error) {
        console.log(`>> Serial: could not open serial port: ${error}`)
      } 
      else {
        console.log(`>> Serial: ${self.port} connection successful`)
        self.onOpen()
      }
    })
  }

  on(type, callback) {
    this.serialHandle.on(type, callback)
  }

  write(data) {
    this.serialHandle.write(data)
  }
}
