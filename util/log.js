import { performance} from "perf_hooks"

const now= performance.now

export function json(fn, level= "log"){
	const val= Object.assign({ ms: now()}, fn())
	console[level](JSON.stringify(val))
}

export function noop(){
}

export default json
