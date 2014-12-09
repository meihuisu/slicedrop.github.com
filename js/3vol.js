
window.onload = function() {
 var r = new X.renderer3D();
 r.container='3vol';
 r.init();

// create a X.volume
var volume = new X.volume();
//volume.file = "http://localhost/data/bone.nii"
//volume.file = "http://localhost/data/mAN261_Cor_60.nii"
volume.file = "https://cirm-dev.misd.isi.edu/data/tissue.nii"

r.add(volume);

r.onShowtime = function() {
    // CREATE Bounding Box
    var res = [volume.bbox[0],volume.bbox[2],volume.bbox[4]];
    var res2 = [volume.bbox[1],volume.bbox[3],volume.bbox[5]];

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
    r.add(box);

    var center = [volume.bbox[0] + (volume.bbox[1]-volume.bbox[0]),
              volume.bbox[2] + (volume.bbox[3]-volume.bbox[2]),
              volume.bbox[4] + (volume.bbox[5]-volume.bbox[4])
              ]

}

var _camera=r.camera;
console.log("orig, camera position is.."+_camera.position);

r.render();

}

