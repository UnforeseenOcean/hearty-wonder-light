export const defaults= {
  channel: 0, // channel number
  intVref: 1,
  gain: 0,
  powerDown: 0,
  values: 0,
  eeprom: false
}

export class McpChannel{
	static get defaults(){
		return mcpChannelDefaults
	}
	static set defaults( assign){
		return Object.assign( this, assign)
	}
	static make( assign){
		return new McpChannel( assign)
	}
	constructor( assign){
		Object.assign( this, McpChannel.defaults, assign)
	}
}
export default McpChannel

export const makeMcpChannel = McpChannel.make
