import { Device } from "@adamas/device";
import { Debug } from "@adamas/debug";

// let Device = require("@adamas/device")
console.log(process.cwd());

Debug.OnCmdCallback((command) => {
	console.log("COMMAND: ", command);
});

function logXRDeviceData() {
	console.log("GetLeftPosition()        ", Device.GetLeftPosition());
	console.log("GetLeftRotation()        ", Device.GetLeftRotation());
	console.log("GetLeftThumbstick()      ", Device.GetLeftThumbstick());
	console.log("GetLeftSelect()          ", Device.GetLeftSelect());
	console.log("GetLeftActivate()        ", Device.GetLeftActivate());
	console.log("GetLeftTurn()            ", Device.GetLeftTurn());
	console.log("GetLeftSnapTurn()        ", Device.GetLeftSnapTurn());
	console.log("GetLeftMove()            ", Device.GetLeftMove());
	console.log("GetLeftGrabMove()        ", Device.GetLeftGrabMove());
	console.log("GetRightPosition()       ", Device.GetRightPosition());
	console.log("GetRightRotation()       ", Device.GetRightRotation());
	console.log("GetRightThumbstick ()    ", Device.GetRightThumbstick());
	console.log("GetRightSelect()         ", Device.GetRightSelect());
	console.log("GetRightActivate()       ", Device.GetRightActivate());
	console.log("GetRightTurn()           ", Device.GetRightTurn());
	console.log("GetRightSnapTurn()       ", Device.GetRightSnapTurn());
	console.log("GetRightMove()           ", Device.GetRightMove());
	console.log("GetRightGrabMove()       ", Device.GetRightGrabMove());
	console.log("GetHeadPosition()        ", Device.GetHeadPosition());
	console.log("GetHeadRotation()        ", Device.GetHeadRotation());
}

// logXRDeviceData();

setInterval(logXRDeviceData, 20000);
