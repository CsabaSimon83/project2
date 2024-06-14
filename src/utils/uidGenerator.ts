import {randomUUID} from "crypto";

export default ():string => {
    return randomUUID().toString()
}