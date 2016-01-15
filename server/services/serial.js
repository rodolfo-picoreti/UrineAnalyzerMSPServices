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
    this.onDisconnect = null

    this.port = null
    this.pnpId = 'pci-Texas_Instruments_XDS110__02.02.04.02__with_CMSIS-DAP_00000000-if00'
    this.vendorId = '0x0x8086'
    this.baudrate = 115200
    this.serialHandle = null
    this.connect()  

    Meteor.setInterval(() => {
      if (!this.isConnected()) {
        if (this.serialHandle != null) {
          console.log(`>> Serial: MSP432 connection lost!`)
          
          if (this.onDisconnect != null) {
            this.onDisconnect()
          }

          this.serialHandle = null
        }
        
        this.connect()
      }
    }, 3000)
  }

  connect() {    
    this.port = null
    console.log(`>> Serial: Searching for MSP432...`)
    
    try {
      serialport.list((error, ports) => {
        //console.log(ports)

        if (typeof(ports) === 'undefined') {
          console.log('>> Serial: Unable to find MSP432!')    
        } 
        else {      
          ports = ports.filter((port) => { 
            return (port.pnpId === this.pnpId)
            //return (port.vendorId === this.vendorId)
          })

          if (ports.length === 0) {
            console.log('>> Serial: Unable to find MSP432!')
          }
          else { 
            console.log('>> Serial: MSP432 found')
            this.port = ports[0].comName
            this.serialHandle = new SerialPort(this.port, {
              baudrate: this.baudrate,
              parser: parser
            }, (error) => { 
              if (error) 
                console.log(`>> Serial: ${error} `) 
            })

            this.open()
          }
        }
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  open() {
    this.serialHandle.open(error => {
      if (!error) {
        console.log(`>> Serial: ${this.port} connection successful`)
        if (typeof(this.onOpen) !== 'undefined') {
          this.onOpen()
        }
      }
    })
  }

  on(type, callback) {
    if (type == 'disconnect') {
      this.onDisconnect = callback
    }
    else {
      this.serialHandle.on(type, callback)
    }
  }

  isConnected() {
    if ((this.serialHandle == null) || (!this.serialHandle.isOpen())) {
      return false
    }
    return true
  }

  write(data) {
    if (this.isConnected()) {
      this.serialHandle.write(data)
    }
  }
}
