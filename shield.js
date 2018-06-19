import * as i2c from "i2c-bus"
import { promisify} from "util"

const openI2c= promisify( i2c.open)

export const defaults= {
	busNumber: 0,
	busOptions: null,
	i2c: async function(){
		return openI2c( this.busNumber, this.busOptions)
	},
	pcaAddress: 0x60,
	mcpAddress: 0x40,
	tmpAddress: 0x4C
}

function promisize( fns, o){
	for( const fn of fns){
		// indeed promisified methods still pass through `this`:
		// https://mobile.twitter.com/rektide/status/1008862753535164416
		obj[ fn]= promisify( obj[ fn])
	}
}
const promisizeI2c= promisize.bind(undefined, ["i2cFuncs", "scan", "deviceId", "i2cRead", "i2cWrite"])

async function validateI2c( i2c){
	const funs= await i2c.i2cFuncs()
	if( !funs.i2c){
		throw new Error( "Unexpected non-i2c bus")
	}
	return i2c
}

function err(msg, o){
	const err= new Error( msg)
	Object.assign( err, o)
	return err
}

export class HPLedShield{
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
		// warning: we will concretize this i2c member when it resolves!!
		this.i2c= i2c.call( opts) // get bus
		  .then( promisizeI2c) // promisify
		  .then( validateI2c) // this isn't a smbus right?
		  .then( this.loadDevices.bind(this))
		  .then( i2c=> this.i2c= i2c) // bus is now ready; concretize assignment
	}

	async loadDevices(){
		await verify()
		const devices= ["pca", "mcp", "tmp"].map(device=> {
			// scan it down first
			const
			  addr= `${device}Address`,
			  [device]= await this.i2c.scan( addr, addr)
			if( !device){
				throw err(`could not scan device ${device}`, {device})
			}
			// retrieve info
			const id= `${device}Id`,
			this[ id]= await this.i2c.deviceId( address),
		})
		return Promise.all( devices).then(()=> return this)
	}
	async verify(){
		// have we a bus?
		await validateI2c( this.i2c)
		// have all devices report to us
		// effect: re-sets our device id's.
		await this.loadDevice()
		return this
	}

	// methods assume bus is ready.

	begin(){
		
	}
}
export default HPLedShield
