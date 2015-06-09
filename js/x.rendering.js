/*

    .----.                    _..._                                                     .-'''-.
   / .--./    .---.        .-'_..._''.                          _______                '   _    \
  ' '         |   |.--.  .' .'      '.\     __.....__           \  ___ `'.           /   /` '.   \_________   _...._
  \ \         |   ||__| / .'            .-''         '.    ,.--. ' |--.\  \         .   |     \  '\        |.'      '-.
   `.`'--.    |   |.--.. '             /     .-''"'-.  `. //    \| |    \  ' .-,.--.|   '      |  '\        .'```'.    '.
     `'-. `.  |   ||  || |            /     /________\   \\\    /| |     |  '|  .-. \    \     / /  \      |       \     \
         `. \ |   ||  || |            |                  | `'--' | |     |  || |  | |`.   ` ..' /    |     |        |    |
           \ '|   ||  |. '            \    .-------------' ,.--. | |     ' .'| |  | |   '-...-'`     |      \      /    .
            | |   ||  | \ '.          .\    '-.____...---.//    \| |___.' /' | |  '-                 |     |\`'-.-'   .'
            | |   ||__|  '. `._____.-'/ `.             .' \\    /_______.'/  | |                     |     | '-....-'`
           / /'---'        `-.______ /    `''-...... -'    `'--'\_______|/   | |                    .'     '.
     /...-'.'                       `                                        |_|                  '-----------'
    /--...-'

    Slice:Drop - Instantly view scientific and medical imaging data in 3D.

     http://slicedrop.com

    Copyright (c) 2012 The Slice:Drop and X Toolkit Developers <dev@goXTK.com>

    Slice:Drop is licensed under the MIT License:
      http://www.opensource.org/licenses/mit-license.php

    CREDITS: http://slicedrop.com/LICENSE

*/

function isArray(o) {
  return Object.prototype.toString.call(o) == "[object Array]";
}
function isFile(o) {
  return Object.prototype.toString.call(o) == "[object File]";
}

function initializeRenderers(){

  if (ren3d) {
    // do this only once
    return;
  }

  _webgl_supported = true;

  try {

    // create the XTK renderers
    ren3d = new X.renderer3D();
    ren3d.container = '3d';
    ren3d.init();
// stackoverflow.com/question/17462936/xtk-flickering-in-overlay-mesh
// resolve multiple mesh transparent object being rendered causing flickering
// effect
    ren3d.config.ORDERING_ENABLED=false;

    ren3d.interactor.onTouchStart = ren3d.interactor.onMouseDown = onTouchStart3D;
    ren3d.interactor.onTouchEnd = ren3d.interactor.onMouseUp = onTouchEnd3D;
    ren3d.interactor.onMouseWheel = function(e) {

      if (RT.linked) {

        clearTimeout(RT._updater);
        RT._updater = setTimeout(RT.pushCamera.bind(this, 'ren3d'), 150);

      }

    };

    // webgl is enabled
    window.console.log('WebGL supported.');

    jQuery(document.body).addClass('webgl_enabled');

  } catch (Error) {

    window.console.log('WebGL *not* supported.');

    _webgl_supported = false;

    // delete the created 3d canvas
    jQuery('#3d').empty();

    jQuery(document.body).addClass('webgl_disabled');
    jQuery(document.body).removeClass('webgl_enabled');

  }


   sliceAx = new X.renderer2D();
   sliceAx.container = 'sliceAx';
   sliceAx.orientation = 'AXIAL';
   sliceAx.init();
   // observe the on touch thingie to enlarge
   sliceAx.interactor.onTouchStart = sliceAx.interactor.onMouseDown = onTouchStartAx;
   sliceAx.interactor.onTouchEnd = sliceAx.interactor.onMouseUp = onTouchEndAx;
   sliceAx.onSliceNavigation = onSliceNavigation;

   sliceSag = new X.renderer2D();
   sliceSag.container = 'sliceSag';
   sliceSag.orientation = 'SAGITTAL';
   sliceSag.init();
   // observe the on touch thingie to enlarge
   sliceSag.interactor.onTouchStart = sliceSag.interactor.onMouseDown = onTouchStartSag;
   sliceSag.interactor.onTouchEnd = sliceSag.interactor.onMouseUp = onTouchEndSag;
   sliceSag.onSliceNavigation = onSliceNavigation;

   sliceCor = new X.renderer2D();
   sliceCor.container = 'sliceCor';

   if (!_webgl_supported) {

     sliceCor.container = '3d';

     // move the green slider to the 3d view
     var el1 = jQuery('#3d');
     el1.prepend('<span/>'); // drop a marker in place
     var tag1 = jQuery(el1.children()[0]);
     tag1.replaceWith(jQuery('#green_slider'));

   } else {

     sliceCor.container = 'sliceCor';

   }
   sliceCor.orientation = 'CORONAL';
   sliceCor.init();

   // observe the on touch thingie to enlarge
   sliceCor.interactor.onTouchStart = sliceCor.interactor.onMouseDown = onTouchStartCor;
   sliceCor.interactor.onTouchEnd = sliceCor.interactor.onMouseUp = onTouchEndCor;
   sliceCor.onSliceNavigation = onSliceNavigation;

   if (!_webgl_supported) {

     // now our ren3d is sliceZ
     ren3d = sliceCor;

   }

  ren3d.onShowtime = function() {

    var processingDiv = document.getElementById('processing');
    processingDiv.style.visibility = 'hidden';
    if (_data.volume.file.length > 0) {

       if(_tiff) setupChannels(volume);

      // show any volume also in 2d
       sliceAx.add(volume);
       sliceSag.add(volume);
       // don't add it again if webgl is not supported
       if (_webgl_supported){sliceCor.add(volume);}
       sliceAx.render();
       sliceSag.render();
       sliceCor.render();

     //MEI  set camera position, [0, _y, 0]
     //     if user did not specify

/* the bounding box
       var RASDims = [volume.bbox[1] - volume.bbox[0] + 1, volume.bbox[3] - volume.bbox[2] + 1, volume.bbox[5] - volume.bbox[4] + 1];
window.console.log("RASdimension is .."+RASDims);
*/
       var _y=volume.bbox[3] - volume.bbox[2] + 1;
       if(ren3d_camera_position == null) {
           ren3d.camera.position = [ 0, _y, 0];
           ren3d.render();
       }
    } else {
         // only mesh is there.. 
         if (_data.mesh.file.length > 0) {
             if(ren3d_camera_position != null) {
                 ren3d.camera.position = ren3d_camera_position;
                 ren3d.render();
             }
         }
    }

    //ren3d.resetBoundingBox();

    setupUi();
    configurator();

//MEI    window.console.timeEnd('ShowTime');

  };


  //
  // LINK THE RENDERERS
  //
  // link the 2d renderers to the 3d one by setting the onScroll
  // method. this means, once you scroll in 2d, it upates 3d as well
  var _updateThreeDSag = function() {

    if (_data.volume.file.length > 0) {

      jQuery('#red_slider').slider("option", "value",volume.indexX);
      // jQuery('#red_slider').slider("option", "value",volume.indexY);
      // jQuery('#green_slider').slider("option", "value",volume.indexZ);

      if (RT.linked) {

        clearTimeout(RT._updater);
        RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexX', volume.indexX), 150);

      }

    }

  };
  var _updateThreeDAx = function() {

    if (_data.volume.file.length > 0) {

      jQuery('#blue_slider').slider("option", "value",volume.indexZ);

      if (RT.linked) {

        clearTimeout(RT._updater);
        RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexZ', volume.indexZ), 150);

      }

    }

  };
  var _updateThreeDCor = function() {

    if (_data.volume.file.length > 0) {

      jQuery('#green_slider').slider("option", "value",volume.indexY);

      if (RT.linked) {

        clearTimeout(RT._updater);
        RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexY', volume.indexY), 150);

      }

    }

  };

  sliceAx.onScroll = _updateThreeDAx;
  sliceSag.onScroll = _updateThreeDSag;
  sliceCor.onScroll = _updateThreeDCor;

  var _updateWLSlider = function() {

    jQuery('#windowlevel-volume').dragslider("option", "values", [volume.windowLow, volume.windowHigh]);

    if (RT.linked) {

      clearTimeout(RT._updater);
      RT._updater = setTimeout(RT.pushVolume.bind(RT, 'windowLow', volume.windowLow), 150);
      clearTimeout(RT._updater2);
      RT._updater2 = setTimeout(RT.pushVolume.bind(RT, 'windowHigh', volume.windowHigh), 150);

    }

  };

  sliceAx.onWindowLevel = _updateWLSlider;
  sliceSag.onWindowLevel = _updateWLSlider;
  sliceCor.onWindowLevel = _updateWLSlider;

};

function createData() {


  // we support here max. 1 of the following
  //
  // volume (.nrrd,.mgz,.mgh)
  // labelmap (.nrrd,.mgz,.mgh)
  // colortable (.txt,.lut)
  // mesh (.stl,.vtk,.fsm,.smoothwm,.inflated,.sphere,.pial,.orig,.obj)
  // scalars (.crv)
  // fibers (.trk)

  //
  // the data holder for the scene
  // includes the file object, file data and valid extensions for each object
  _data = {
   'volume': {
     'file': [],
     'filedata': [],
     'extensions': ['NRRD', 'MGZ', 'MGH', 'NII', 'TIF', 'TIFF', 'GZ', 'DCM', 'DICOM']
   },
   'labelmap': {
     'file': [],
     'filedata': [],
     'extensions': ['NRRD', 'MGZ', 'MGH']
   },
   'colortable': {
     'file': [],
     'filedata': [],
     'extensions': ['TXT', 'LUT']
   },
   'mesh': {
     'file': [],
     'filedata': [],
     'extensions': ['STL', 'VTK', 'FSM', 'SMOOTHWM', 'INFLATED', 'SPHERE',
                    'PIAL', 'ORIG', 'OBJ']
   },
   'scalars': {
     'file': [],
     'filedata': [],
     'extensions': ['CRV', 'LABEL']
   },
   'fibers': {
     'file': [],
     'filedata': [],
     'extensions': ['TRK']
   },
  };

}

/* MEI, this is for managing TIF multi-channels volume data, this
   is assuming that there is just 1 volume */
var _tiff=false;
var _channels=0; // how many channels are there.
var _channelIdx=-1; // which channel is being used
var _rgb=false;
function setupChannels(v) {
    if(!_tiff) return;
    _channels=X.parserTIFF.prototype.isTiffMultiChannel(v);
    if(_channels == 3) { 
      _rgb=X.parserTIFF.prototype.isTiffRGB(v);
    }
}   
function hasChannel() { return _channelIdx; }
function setChannel(v) { _channelIdx=v; }
function hasChannels() { return _channels; } 
function setTIFF() { _tiff=true; }
function hasRGB() { return _rgb; }

/*MEI*/var remote=true;
/*MEI*/var remote_data_location = 'https://cirm-dev.misd.isi.edu/data/';
// var remote_data_location = 'http://localhost/data/';

// Reading files using the HTML5 FileReader.
// if 'files' is a list of 'type File' 
// or use xmlhttprequest 
// if 'files' is an array list of {name:'file', size:0 }
//
function read(files) {

  createData();

  // show share button
//MEI  $('#share').show();

  var array_files;
  if( isArray(files) ) {
      array_files = files;
      remote=true;
  } else {
      array_files= new Array();
      for ( var j = 0; j < files.length; j++) {
          array_files.push( { 'name': files[j].name, 'size':files[j].size });
      }
  }

  for ( var i = 0; i < files.length; i++) {

   var f = files[i];
   if (remote) {
      f=array_files[i];
   }

   var _fileName = f.name;
   var _fileExtension = _fileName.split('.').pop().toUpperCase();

   // check for files with no extension
   if (_fileExtension == _fileName.toUpperCase()) {

     // this must be dicom
     _fileExtension = 'DCM';

   }

   // check which type of file it is
   if (_data['volume']['extensions'].indexOf(_fileExtension) >= 0) {

     _data['volume']['file'].push(f);

// SPECIAL CASE: MEI, need to grab this from meta data in the future
     if(_fileExtension === "TIF" || _fileExtension === "TIFF") {
// grab this from somewhere..  window.console.log("found TIF file");
         setTIFF();
     }

   } else if (_data['colortable']['extensions'].indexOf(_fileExtension) >= 0) {

     // this is a color table
     _data['colortable']['file'].push(f);

   } else if (_data['mesh']['extensions'].indexOf(_fileExtension) >= 0) {

     // this is a mesh
     _data['mesh']['file'].push(f);

   } else if (_data['scalars']['extensions'].indexOf(_fileExtension) >= 0) {

     // this is a scalars file
     _data['scalars']['file'].push(f);

   } else if (_data['fibers']['extensions'].indexOf(_fileExtension) >= 0) {

     // this is a fibers file
     _data['fibers']['file'].push(f);

   }

  }

//MEI
  pre_setupUi();

  var _types = Object.keys(_data);

  // number of total files
  var _numberOfFiles = files.length;
  var _numberRead = 0;

  //
  // the HTML5 File Reader callbacks
  //

  // setup callback for errors during reading
  var errorHandler = function(e) {

   console.log('Error:' + e.target.error.code);

  };

  // setup callback after reading
  var loadHandler = function(type, file) {

   return function(e) {

     // reading complete
     var data = e.target.result;

     // might have multiple files associated
     // attach the filedata to the right one
     _data[type]['filedata'][_data[type]['file'].indexOf(file)] = data;

     _numberRead++;
     if (_numberRead == _numberOfFiles) {

       // all done, start the parsing
       parse(_data);

     }

   };
  };


  //
  // start reading
  //
  _types.forEach(function(v) {

   if (_data[v]['file'].length > 0) {

     _data[v]['file'].forEach(function(u) {

     // either FILE type or json object type(myfile)
       if ( isFile(u) ) {
           var reader = new FileReader();

           reader.onerror = errorHandler;
           reader.onload = (loadHandler)(v,u); // bind the current type

           // start reading this file
           reader.readAsArrayBuffer(u);
       } else {
//MEI
           var myfile=u.name;
           var _file = remote_data_location + myfile;
           if (myfile.substring(0,4) == 'http') {
               // external url detected
              _file = myfile;
           }

	   var http_request= new XMLHttpRequest();
           http_request.onprogress = function (evt) {
               if(evt.lengthComputable) {
                   var _loaded=evt.loaded;
                   var _total=evt.total;
                   var pComplete = (evt.loaded / evt.total)*100;
                   if (pComplete > 90) {
                       $('#loading-progress-bar').progressbar( {value:pComplete} );
                       $('#loading-progress-bar > div').css('background','green') ;
                   } else {
                       $('#loading-progress-bar').progressbar( {value:pComplete}
 );
                       $('#loading-progress-bar > div ').css('background','red') ;
                   }
               }
           }
           http_request.onreadystatechange = function() {
              if (this.readyState == 4) {
                if (this.status == 200) {
//window.console.timeEnd('httpRequestTime');
                  var remote_data=http_request.response;
                  var len=remote_data.byteLength;
                  _data[v]['filedata'][_data[v]['file'].indexOf(u)] = remote_data;
                  _data[v]['file'][_data[v]['file'].indexOf(u)].size = len;

                  _numberRead++;
                  if (_numberRead == _numberOfFiles) {

//window.console.time('parseRemoteTime');
                      var loadingDiv = document.getElementById('loading');
                      loadingDiv.style.display = 'none';
                      var processingDiv = document.getElementById('processing');
                      processingDiv.style.visibility = 'visible';
                      parse(_data);
//MEI                 window.console.timeEnd('parseRemoteTime');
                  }
                } else {
                  if (this.status == 404) {
                     throw new Error("File does not exist! "+_file);
                  } else {
//MEI, reset it
                    $('#loading-progress-bar > div').css('background','red');
                  }
                }
              }
           }
           http_request.open('GET', _file, true);
           http_request.responseType='arraybuffer';
//MEI      window.console.time('httpRequestTime');
           http_request.send(null);
      }
    });
   }
  });

};

//
// Parse file data and setup X.objects
//
function parse(data) {

  // initialize renderers
  initializeRenderers();

  // check for special case if a volume, a labelmap and a colortable was dropped
  if (data['volume']['file'].length == 2 && data['colortable']['file'].length == 1) {

    // we assume the smaller volume is a labelmap
    var _smaller_volume = data['volume']['file'][0];
    var _smaller_data = data['volume']['filedata'][0];
    if (_smaller_volume.size < data['volume']['file'][1]) {

      // this is the smaller volume so configure it as a labelmap
      data['labelmap']['file'].push(_smaller_volume);
      data['labelmap']['filedata'].push(_smaller_data);
      data['volume']['file'].shift();
      data['volume']['filedata'].shift();

    } else {
      // we swap them and configure the second one as a labelmap
      _smaller_volume = data['volume']['file'][1];
      _smaller_data = data['volume']['filedata'][1];
      data['labelmap']['file'].push(_smaller_volume);
      data['labelmap']['filedata'].push(_smaller_data);
      data['volume']['file'].pop();
      data['volume']['filedata'].pop();

    }

  }

//MEI, can only be 1
//   if (data['volume']['file'].length > 0) {
   if (data['volume']['file'].length == 1) {

   // we have a volume
   volume = new X.volume();
   volume.file = data['volume']['file'].map(function(v) {

     return v.name;

   });
   volume.filedata = data['volume']['filedata'];
   var colortableParent = volume;

   if (data['labelmap']['file'].length > 0) {

     // we have a label map
     volume.labelmap.file = data['labelmap']['file'].map(function(v) {

       return v.name;

     });
     volume.labelmap.filedata = data['labelmap']['filedata'];
     colortableParent = volume.labelmap;

   }

   // add callbacks for computing
   volume.onComputing = function(direction) {
//window.console.log("---> onComputing.."+direction);
    var processingDiv = document.getElementById('processing');
    processingDiv.style.visibility = 'visible';
   }

   volume.onComputingProgress = function(value) {
//window.console.log("---> onComputingProgress.."+value);
   }

   volume.onComputingEnd = function(direction) {
//window.console.log("---> onComputingEnd.."+direction);
    var processingDiv = document.getElementById('processing');
    processingDiv.style.visibility = 'hidden';
   }

   if (data['colortable']['file'].length > 0) {

     // we have a color table
     colortableParent.colortable.file = data['colortable']['file'].map(function(v) {

       return v.name;

     });
     colortableParent.colortable.filedata = data['colortable']['filedata'];

   }

   // add the volume
   ren3d.add(volume);

   } else {
     if (data['volume']['file'].length > 1) {
       throw new Error("Can not specify more than 1 volume data");
     }
  }

/*
 what can we have
  1 mesh
  n mesh
  1 mesh + 1 mesh_scalars
  n mesh + n mesh_scalars
  final default mesh is meshs[0]
*/
  meshs=[];
  mesh=null;
  if (data['mesh']['file'].length > 0) {

   // we have a mesh
   meshfile = data['mesh']['file'].map(function(v) {
     return v.name;
   });
   meshfiledata = data['mesh']['filedata'];
   // we have scalars
   if (data['scalars']['file'].length > 0) {
     // bad...
     if (data['mesh']['file'].length != data['scalars']['file'].length) {
         alertify.confirm("number of mesh files does not match number of scalars files!!");
     }
     meshscalarsfile = data['scalars']['file'].map(function(v) {
       return v.name;
     });
     meshscalarsfiledata = data['scalars']['filedata'];
   }

   for ( var i = 0; i < data['mesh']['file'].length; i++) {
     mesh = new X.mesh();
     mesh.file=meshfile[i];
     mesh.filedata=meshfiledata[i]
     if (data['scalars']['file'].length > 0) {
       mesh.scalars.file=meshscalarsfile[i];
       mesh.scalars.filedata = meshscalarsfiledata[i];
// assign some color, [0..1]
       } else { 
         if(i>0) { 
           var o=(1 / data['mesh']['file'].length) * i;
           var skip= (i+1) %3;
           var offset=(Math.floor(o * 100))/100;
           switch (skip) {
             case 0:
               mesh.color = [offset, 0, 0];
               break;        
             case 1:
               mesh.color = [offset, 0, offset];
               break;        
             case 2:
               mesh.color = [0, 0, offset];
               break;        
           }
           } else {
               mesh.color = [1, 1, 1];
         }
     }
     mesh.opacity=1.0;

     // add the mesh
     ren3d.add(mesh);
     meshs.push(mesh);
   }
   mesh=meshs[0];
  }

  if (data['fibers']['file'].length > 0) {

   // we have fibers
   fibers = new X.fibers();
   fibers.file = data['fibers']['file'].map(function(v) {

     return v.name;

   });
   fibers.filedata = data['fibers']['filedata'];

   // add the fibers
   ren3d.add(fibers);

  }

//MEI
  if(ren3d_camera_position != null) {
    ren3d.camera.position = ren3d_camera_position;
  }

  ren3d.render();

};

function onSliceNavigation() {


  jQuery('#red_slider').slider("option", "value",volume.indexX);

  jQuery('#green_slider').slider("option", "value",volume.indexY);

  jQuery('#blue_slider').slider("option", "value",volume.indexZ);


};

//
// Interaction callbacks
//
function onTouchStartAx() {

  onTouchStart('sliceAx');

};

function onTouchStartSag() {

  onTouchStart('sliceSag');

};

function onTouchStartCor() {

  onTouchStart('sliceCor');

};

function onTouchStart3D() {

  onTouchStart('ren3d');

}

function onTouchEndAx() {

  onTouchEnd('sliceAx','Ax');

};

function onTouchEndSag() {

  onTouchEnd('sliceSag','Sag');

};

function onTouchEndCor() {

  onTouchEnd('sliceCor','Cor');

};

function onTouchEnd3D() {

  onTouchEnd('ren3d','3d');

}

function onTouchStart(renderer) {

  log('Touch start');

  _touch_started = Date.now();

  if (RT.linked) {
    clearInterval(RT._updater);
    RT._updater = setInterval(RT.pushCamera.bind(this, renderer), 150);
  }

}

function onTouchEnd(rend,container) {

  if (RT.linked){
    clearInterval(RT._updater);
  }

  _touch_ended = Date.now();

  if (typeof _touch_started == 'undefined') {
    _touch_started = _touch_ended;
  }

  if (_touch_ended - _touch_started < 200) {

    var _old_2d_content = eval('_current_' + container + '_content');
    eval('var cont = '+rend+'.container');

    showLarge(jQuery(cont), _old_2d_content);

    if (RT.linked) {

      RT._updater = setInterval(RT.pushUI.bind(RT, rend, container), 150);

    }

  }

};

