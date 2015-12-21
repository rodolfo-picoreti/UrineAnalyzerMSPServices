# configureLocks([ { id, value } ... ])
    args: (array of objects with id and value)
        id: lock id
            0: SERVICE_LOCK_MOTORS
            1: SERVICE_LOCK_VALVES
            2: SERVICE_LOCK_HEATERS
            3: SERVICE_LOCK_SENSOR_SELECT
            
        value: lock state
            0: unlocked / manual
            1: locked / automatic
    usage:
        // Put motors on automatic and valves on manual mode
        Services.call('configureLocks', [
            { id: 0, value: 1 },
            { id: 1, value: 0 }
        ]) 
        
# startSampling({ samplingTime })
    
    args:
	    samplingTime: Sampling time in milliseconds

	usage:
		// Request samples every 1s
		Services.call('startSampling', { samplingTime: 1000 }) 

# stopSampling({ })
	usage:
		Services.call('stopSampling') 
		
# selectSensor({ id })
    
	id: Id of the sensor to be selected
		0: SENSOR_PH
		1: SENSOR_NA
		2: SENSOR_CL
		3: SENSOR_K
		4: SENSOR_CONDUCTIVITY

	usage:
	    // Select Na sensor
		Services.call('selectSensor', { id: 1 }) 

# configureValves([ { id, value } ... ])
    args: (array of objects with id and value)
        id: valve id
            0: VALVE_PROBE_LOWER
            1: VALVE_PROBE_UPPER
            2: VALVE_WASH
            3: VALVE_SLOPE_REAGENT
            4: VALVE_CAL_REAGENT
        
        value: valve state
            0: off
            1: on
    usage:
        // Turn wash valve on and slope valve off
        Services.call('configureValves', [
            { id: 2, value: 1 },
            { id: 3, value: 0 }
        ]) 

# configurePumps([ { id, value } ... ])
    args: (array of objects with id and value)
        id: pump id
            0: PWM_REAGENT_PUMP
            1: PWM_SAMPLE_WASTE_PUMP
        
        value: duty cycle 
            Integer from 0 to 301
    usage:
        // Turn reagent and sample pumps with 33% (100/301) 
        // and 17% (50/301) duty cycle values respectively
        Services.call('configurePumps', [
            { id: 0, value: 100 },
            { id: 1, value: 50 }
        ]) 

# configureHeaters([ { id, value } ... ])
    args: (array of objects with id and value)
        id: heater id
            2: PWM_PREHEATER
            3: PWM_INTHEATER
        
        value: duty cycle 
            Integer from 0 to 301
    usage:
        // Turn pre heater and heater with 33% (100/301) 
        // and 17% (50/301) duty cycle values respectively
        Services.call('configureHeaters', [
            { id: 2, value: 100 },
            { id: 3, value: 50 }
        ]) 
        