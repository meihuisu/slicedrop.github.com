
window.onload = function() {
 var r = new X.renderer3D();
 r.container='3vol';
 r.init();

// create a X.volume
var volume = new X.volume();

volume.file = "http://localhost/data/CP060CCMB_transformed.nii";

//volume.file = "http://localhost/data/CP060CCMB_Ctgf_control_Bone.transformed.nii.gz";
//volume.file = "http://localhost/data/mAN261_Transverse.nii.gz";
//volume.file = "http://localhost/data/hs01_10jun10.transformed.nii";
//volume.file = "http://localhost/data/JI211CCMB_Control_P0_Hard_Tissue.transformed.nii";

//volume.file = "http://localhost/data/hs01_10jun10.transformed.nii";
//volume.file = "http://localhost/data/yc03_11nov11.transformed.nii";
//volume.file = "http://localhost/data/sr04_26apr11.transformed.nii";

//volume.file = "http://localhost/data/bone.nii";
//volume.file = "http://localhost/data/mAN261_Cor_60.nii";
//volume.file = "http://localhost/data/tissue.nii";
//volume.file = "http://localhost/data/daniel.nii";
//volume.file = "http://localhost/data/yc03_11nov11.transformed.nii";
//volume.file = "http://localhost/data/bigendian.nii";

window.console.log("Processing..."+volume.file);

r.add(volume);

r.onShowtime = function() {
    // CREATE Bounding Box
    var res = [volume.bbox[0],volume.bbox[2],volume.bbox[4]];
    var res2 = [volume.bbox[1],volume.bbox[3],volume.bbox[5]];

console.log("bb res is --"+res);
console.log("bb res is --"+res2);

var RASDims = [volume.bbox[1] - volume.bbox[0] + 1, volume.bbox[3] - volume.bbox[2] + 1, volume.bbox[5] - volume.bbox[4] + 1];

console.log("dims is --"+RASDims);

var _ndim=volume.dimensions;
console.log("dim after showtime"+_ndim);

    box = new X.object();
    box.points = new X.triplets(72);
    box.normals = new X.triplets(72);
    box.type = 'LINES';
    box.points.add(res2[0], res[1], res2[2]);
    box.points.add(res[0], res[1], res2[2]);
    box.points.add(res2[0], res2[1], res2[2]);
    box.points.add(res[0], res2[1], res2[2]);
    box.points.add(res2[0], res[1], res[2]);
    box.points.add(res[0], res[1], res[2]);
    box.points.add(res2[0], res2[1], res[2]);
    box.points.add(res[0], res2[1], res[2]);
    box.points.add(res2[0], res[1], res2[2]);
    box.points.add(res2[0], res[1], res[2]);
    box.points.add(res[0], res[1], res2[2]);
    box.points.add(res[0], res[1], res[2]);
    box.points.add(res2[0], res2[1], res2[2]);
    box.points.add(res2[0], res2[1], res[2]);
    box.points.add(res[0], res2[1], res2[2]);
    box.points.add(res[0], res2[1], res[2]);
    box.points.add(res2[0], res2[1], res2[2]);
    box.points.add(res2[0], res[1], res2[2]);
    box.points.add(res[0], res2[1], res2[2]);
    box.points.add(res[0], res[1], res2[2]);
    box.points.add(res[0], res2[1], res[2]);
    box.points.add(res[0], res[1], res[2]);
    box.points.add(res2[0], res2[1], res[2]);
    box.points.add(res2[0], res[1], res[2]);
    for ( var i = 0; i < 24; ++i) {
      box.normals.add(0, 0, 0);
    }
    console.log("color"+box.color);
    
    r.add(box);

    var center = [volume.bbox[0] + (volume.bbox[1]-volume.bbox[0]),
              volume.bbox[2] + (volume.bbox[3]-volume.bbox[2]),
              volume.bbox[4] + (volume.bbox[5]-volume.bbox[4])
              ]

//    r.camera.position=[0,_ndim[1],0];
    r.camera.position=[0,RASDims[1],0];
    r._bgColor=[1, 1, 1];
    box.color=[0,0,0];
var _children=volume.children;
/* should be three of them */
volume._borders=false;
var _x=volume._slicesX;
_x._borders=false;
_x._color=[0,0,0];
    r.render();
}

var _camera=r.camera;
console.log("orig, camera position is.."+_camera.position);

r.render();

}

