
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
 r.add(mesh);

r.onShowtime = function() {
console.log("renderer's _minX"+r._minX);
console.log("renderer's _maxX"+r._maxX);
console.log("renderer's _minY"+r._minY);
console.log("renderer's _maxY"+r._maxY);
console.log("renderer's _minZ"+r._minZ);
console.log("renderer's _maxZ"+r._maxZ);
console.log("renderer's center"+r._center);


//    r.resetBoundingBox();
//console.log("Camera Focus",r.camera.focus);
r.camera.position = [0,r._maxY,0];
}
 r.render();

}

