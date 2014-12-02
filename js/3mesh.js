
//jQuery(document).ready(function() {
window.onload = function() {
 var r = new X.renderer3D();
 r.container='3mesh';
 r.init();

// create a X.mesh
 var mesh = new X.mesh();
 mesh.file = 'http://localhost/data/ExtractedSurface.obj';

var _camera=r.camera;
console.log("orig, camera position is.."+_camera.position);
r.camera.position = [0,20,0];
 r.add(mesh);
console.log("new, camera position is.."+_camera.position);
 r.render();
}

