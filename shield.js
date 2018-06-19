import * as i2c from "i2c-bus"
import { promisify} from "util"

const openI2c= promisify( i2c.open)

export const defaults= {
	busNumber: 0,
	busOptions: null,
	i2c: async function(){
		return openI2c( this.busNumber, this.busOptions)
	}
}

function promisize( fns, o){
	for( const fn of fns){
		// indeed promisified methods still pass through `this`:
		// https://mobile.twitter.com/rektide/status/1008862753535164416
		obj[ fn]= promisify( obj[ fn])
	}
}
const promisizeI2c= promisize.bind(undefined, ["i2cFuncs", "scan", "deviceId", "i2cRead", "i2cWrite"])

export class Shield{
	static get defaults(){
		return defaults
	}
	static set defaults( assign){
		Object.assign( defaults, assign)
		return defaults
	}
	constructor( opts){
		const _defaults= opts&& opts.defaults!== undefined? opts.defaults|| defaults
		const opts= Object.assign( {}, _defaults, opts)
		this.i2c= i2c.call( opts) // get bus
		  .then( promisizeI2c) // promisify
		  .then( i2c=> this.i2c= i2c) // bus is now ready; concretize assignment
	}

	// methods assume bus is ready.

	verify(){
		
	}

	begin(){
		
	}
}
