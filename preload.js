
const { shell } = require('electron')
const exec = require('child_process').exec

window.openItem = function (fullPath) {
	let pathList = fullPath.split('\n')
	pathList.forEach(v => {
		shell.openPath(v);
	})
}

window.runBat = function (cmdStr) {
	let workerProcess
	let cmdList = cmdStr.split('\n')
	cmdList.forEach(element => {
		workerProcess = exec(element)
	});

	workerProcess.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	// 打印错误的后台可执行程序输出
	workerProcess.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
	});

	// 退出之后的输出
	workerProcess.on('close', function (code) {
		console.log('out code：' + code);
		utools.outPlugin()
	})
}