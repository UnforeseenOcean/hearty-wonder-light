import Defer from "p-defer"
import { createConnection} from "net"
import err from "./util/err"
import log from "./util/log"

export async function createHeartyConnection(){
	const
	  d= Defer(),
	  socket= createConnection(4567, "heartypatch.local", d.resolve)
	socket.once( "error", d.reject)
	return d.promise
}

export const defaults= {
	_port: 4567,
	_host: "heartypatch.local",
	createHeartyConnection,
	data: function(){
		return []
	}

}
export class HeartyPatch{
	static get defaults(){
		return defaults
	}
	static set defaults( assign){
		Object.assign( defaults, assign)
		return defaults
	}
	constructor(opts){
		const _defaults= opts&& opts.defaults!== undefined? opts.defaults: defaults
		Object.assign( {}, _defaults, opts)
		if( this.data instanceof Function){
			this.data= this.data()
		}
		this.next= Defer()
		this.queue= []
		this.heartyListener= this.heartyListener.bind()
	}
	async connect(){
		if( this.socket){
			log(()=> ({ "warn": "HeartyPatch#connect when already connected"}))
			return this
		}
		this.socket= await createHeartyConnection()
		this.socket.on("data", this.heartyListener)
		return this
	}
	async *[Symbol.asyncIterator](){
		while( true){
			while( this.queue.length){
				yield this.queue.shift()
			}
			var next= this.next.promise
			this.next= Defer();
			await next
		}
	}
	heartyListener( buffer){
		log(()=> ({ state: "data", len: buffer.length }))
		if( this.remainder){
			log(()=> ({ state: "remainder", remainder: this.remainder.length, buffer: this.buffer.length}))
			buffer= Buffer.concat([ this.remainder, buffer])
		}
		this.remainder= buffer
		const {packets, pos}= parsePackets( remainder)
		if( pos=== this.remainder.length){
			delete this.remainder
		}else{
			log(()=> ({ state: "remaining", pos, batch: this.remainder.length, left: this.remainder.length- pos }))
			this.remainder= this.remainder.splice( pos)
		}
		log(()=> ({ state: "queue", count: this.packets.length }))
		this.queue.push( ...packets)
		this.next.resolve()
	}
	static parsePackets( buffer, pos= 0){
		const packets= []
		let size= 54
		while( buffer.length>= pos+ size){
			//for( let i= 0; i<= 64; ++i){
			//	const a= buffer.readUInt8( i+ pos)
			//	if(a === 10){
			//		log(()=> ({a: 10, i, pos, n: i+pos, fa: buffer.readUInt8( i+ pos+ 1)}))
			//	}
			//}

			log(()=> ({ "state": "read-packet", pos}))
			const packet= this.parsePacket( buffer, pos)
			log(()=> ({packet}))
			packets.push( packet)
			if( packet.endByte!= 54){
				log(()=> ({ "unexpected": "packet-end", endByte: packet.endByte}))
			}
			pos+= packet.endByte+ 1
			log(()=> ({ state: "iter", buflen: buffer.length, pos, size, n: pos+size }))
			log(()=> ({}))
		}
		return {packets, pos}
	}
	static parseRToR( raw){
		if( raw=== 0){
			return 0.0
		}
		return 60000.0 / rtor_value;
	}
	static parsePacket( buffer , offset= 0){
		const
		  startA= buffer.readUInt8( offset),
		  startFA= buffer.readUInt8( 1+ offset)
		if( startA!== 0xA){
			throw err(`Bad start byte '${startA}', expected 10`);
		}
		if( startFA!== 0xFA){
			throw err(`Bad start byte 2 '${startFA}', expected 250`);
		}

		let endByte= 0
		for( let i= 18; i< buffer.length; ++i){
			if( buffer.readUInt8( i+ offset)=== 0xB){
				endByte= i
				break
			}
		}
		let samples= new Array(8)
		for( let i= 0; i< 8; ++i){
			const sampleOffset= (i* 4)+ 16+ offset
			samples[ i]= buffer.readInt32LE( sampleOffset)
		}
		const packet= {
		  payloadSize: buffer.readUInt16LE( 2),
		  version: buffer.readUInt8( 4),
		  seq: buffer.readUInt32LE( 5),
		  timestamp: buffer.readUInt32LE( 9), // have not verified
		  rToR: ( this.parseRToR|| this.constructor.parseRToR)( buffer.readUIntLE( 12)),
		  samples,
		  endByte // trying to grok data format
		}
		return packet
	}
}
export default HeartyPatch
