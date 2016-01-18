function logger(status, data) {
	console.log(`${status}: ${data.args}`)
}

Meteor.startup(function () {

	Services.initialize(function() {

		Services.call('resetCounter', {}, function(status) {
			if (status == 'success') {
				let handler = setInterval(function() {
					if (!Services.isConnected()) {
						clearInterval(handler)
					}
					
					Services.call('sampleOnce', {}, function(status, data) {
						console.log(status)
						console.log(data.result)
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