import * as i2c from "i2c-bus"
import { promisify} from "util"

import { makeMcpChannel } from "./mcp-channel"

const openI2c= promisify( i2c.open)

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

export function makeMcpChannels(){
	return [
	  this._makeMcpChannel(),
	  this._makeMcpChannel(),
	  this._makeMcpChannel(),
	  this._makeMcpChannel()
	]
}

// defaults starting with _ are expected to only be used during the constructor, although they are saved on the HPLedShield
export const defaults= {
  _busNumber: 0,
  _busOptions: null,
  i2c: async function(){
  	return openI2c( this.busNumber, this.busOptions)
  },
  pcaAddress: 0x60,
  mcpAddress: 0x40,
  tmpAddress: 0x4C,
  _makeMcpChannel: makeMcpChannel,
  mcp: makeMcpChannels,
  mcpEp: makeMcpChannels
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
		if( this.mcp instanceof Function){
			this.mcp= this.mcp()
		}
		if( this.mcpEp instanceof Function){
			this.mcpEp= this.mcpEp()
		}

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

	async begin(){
		await this.getStatus()
		await this.resetMode()
		await this.fastWriteMcp()
		await this.wakePca()
	}
	async getStatus( mcpAddr= this.mcpAddr){
		const
		  mcpStatus= Buffer.alloc( 24),
		  bytesRead= await this.i2c.i2cRead( mcpAddr, 24, mcpStatus)
		if( bytesRead!== 24){
			throw err(`Unexpected ${bytesRead} bytes read from mcpStatus, expected 24`, {bytesRead, expected: 24, device: "mcp", read: "status"})
		}
		const
		  deviceId = buffer.readInt8( 0),
		  hiByte= buffer.read( 1),
		  loByte= buffer.read( 2),
	      isEEPROM= (deviceId & 0B00001000) >> 3,
    	  channel= (deviceId & 0B00110000) >> 4
		  mcpChannel= this[ isEEPROM]? this.mcpEp: this.mcp][ channel],
		mcpChannel.intVref=( hiByte & 0B10000000) >> 7
		mcpChannel.gain=( hiByte & 0B00010000) >> 4
		mcpChannel.powerDown=( hiByte & 0B01100000) >> 5
		mcpChannel.values=(( hiByte & 0B00001111) <<8)+ loByte
	}
	resetMode(){
		for(  channel= 0; i<= 3; ++i){
			const mcpChannel= this.mcp[ channel]
			mcpChannel.intVref= 1 // internal 2.048V reference
			mcpChannel.gain= 0 // x1
			mcpChannel.powerDown= 0 // regular running mode
		}
	}
	async fastWriteMcp( mcpAddr= this.mcpAddr){
		const buffer= Buffer.alloc( 8)
		let offset= 0;
		for( let i= 0; i< 4; ++i){
			const mcpChannel= this.mcp[ i]
			buffer.writeInt16BE( mcpChannel.values, offset)
			offset+= 2
		}
		return this.i2c.i2cWrite( mcpAddr, 8, buffer)
	}
	static get bufWakePca(){
		return Buffer.from([ 0x0, 0B00100001])
	}
	async wakePca( mcpAddr= this.mcpAddr){
		return this.i2c.i2cWrite( mcpAddr, 2, this.constructor.bufWakePca)
	}
	static get senseRMcp(){
	}
	async setCurrent( r, g, b, mcpAddr= this.mcpAddr){
		const _values= [r, g, b]
		for( let channel= 0; i<= 2; ++i){
			let value= _values[ channel]
			if( isNaN( value)){
				throw err(`Non-number '${value}' on channel ${channel}`, {value, channel});
			}
			if( val< 0){
				throw err(`Unexpected value ${value} was < 0`, {value, channel})
			}
			if( val> 255){
				throw err(`Unexpected value ${value} was > 255`, {value, channel})
			}
			this.mcp[ i+ 1].values= Number.parseInt(value * this.constructor.senseRMcp * 20)
		}
		return this.fastWriteMcp( mcpAddr)
	}
}
export default HPLedShield
