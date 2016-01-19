function logger(status, data) {
	console.log(`${status}: ${data.args}`)
}

Meteor.startup(function () {

	Services.initialize(function() {
		Services.call('resetCounter', {}, function(status) {
			// If we succeded then we can start sampling
			if (status == 'success') {
				// We need to store this handle in case the connection with the MSP is lost
				let handler = setInterval(function() {
					if (!Services.isConnected()) {
						// If we lose connection stop executing this periodicly
						clearInterval(handler)
					}
					
					// Send sampling request
					Services.call('sampleOnce', {}, function(status, data) {
						if (status == 'success')  {
							console.log(data.result)
						} else {
							console.log('sampleOnce failed!')
						}
					})		
				}, 10000)			
			} else {
				console.log('resetCounter failed!')
			}
		})
		/*
		Services.call('configureLocks', [ 
			{ id: 2, value: 0 } // Unlock heaters
		], logger)		

		Services.call('configureHeaters', [ 
			{ id: 2, value: 100 }, 
			{ id: 3, value: 110 } 
		], logger)

		Services.call('selectSensor', { id: 2 })

		Services.call('configureValves', [ 
			{ id: 0, value: 0 },
			{ id: 1, value: 1 },
			{ id: 2, value: 0 },	
			{ id: 3, value: 1 },
			{ id: 4, value: 1 } 
		], logger)
		*/
	})
})