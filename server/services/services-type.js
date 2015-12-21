Services.type.serialize = function (description, buffer, offset) {
  let type = Services.utils.find(Services.type.map, 'description', description)
  buffer.writeUInt8(type.id, offset)
  return 1
}

Services.type.deserialize = function (id) {
  let type = Services.utils.find(Services.type.map, 'id', id)
  return type.description
}

Services.type.map = [
  { id: 0x00, description: 'request' },
  { id: 0x01, description: 'response' }
]
