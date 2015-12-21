Services.status.serialize = function (description, buffer, offset) {
  let status = Services.utils.find(Services.status.map, 'description', description)
  buffer.writeUInt8(status.id, offset)
  return 1
}

Services.status.deserialize = function (id) {
  let status = Services.utils.find(Services.status.map, 'id', id)
  return status.description
}

Services.status.map = [
  { id: 0x00, description: 'success' },
  { id: 0x01, description: 'invalid service' },
  { id: 0x02, description: 'invalid length' },
  { id: 0x03, description: 'invalid arg' },
  { id: 0x04, description: 'busy' },
  { id: 0xFF, description: 'service not implemented'}
]