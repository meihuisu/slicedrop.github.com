
window.onload = function() {
 var r = new X.renderer3D();
 r.container='3vol';
 r.init();

// create a X.volume
var volume = new X.volume();
volume.file = "http://localhost/data/tissue.nii"

var _camera=r.camera;
console.log("orig, camera position is.."+_camera.position);
r.camera.position = [0,-300,0];
r.add(volume);
console.log("new, camera position is.."+_camera.position);
 r.render();
}
