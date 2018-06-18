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
		this.i2c= i2c.call( opts).then(
		this.i2c.then( i2c=> this.i2c= i2c) // bus is now ready
	}

	// methods assume bus is ready.

	verify(){
		
	}

	begin(){
		
	}
}

export function 
