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

function loadFile(file) {

  // Remove trailing slash so we can detect extension
  if (file.slice(-1) === "/") {
      file = file.slice(0, -1);
  }

//  var _file = 'http://x.babymri.org/?' + file;
//MEI
  var _file = file;

  if (file.substring(0,4) == 'http') {
    // external url detected
//MEI    window.console.log('Using external data url: ' + file);
    _file = file;
  }

// MEI window.console.log("in example loadFile url is -- "+_file);

  // now switch to the viewer
  switchToViewer();

  // init renderers
  initializeRenderers();
  createData();

  var _fileExtension = file.split('.').pop().toUpperCase();

  mesh=null;
  meshs=[];
  // check which type of file it is
  if (_data['volume']['extensions'].indexOf(_fileExtension) >= 0) {

    // it's a volume
    volume = new X.volume();
    volume.file = _file;
    _data.volume.file = [volume.file];
    ren3d.add(volume);

  } else if (_data['mesh']['extensions'].indexOf(_fileExtension) >= 0) {

    // it's a mesh
    mesh = new X.mesh();
    mesh.file = _file;
    _data.mesh.file = [mesh.file];
    ren3d.add(mesh);
    meshs.push(mesh);

  } else if (_data['fibers']['extensions'].indexOf(_fileExtension) >= 0) {

    // it's a fibers thingie
    fibers = new X.fibers();
    fibers.file = _file;
    _data.fibers.file = [fibers.file];
    ren3d.add(fibers);

  } else {

    throw new Error('Unsupported file type!');

  }

//MEI from jquery.frontpage.js
  if(ren3d_camera_position != null) {
    ren3d.camera.position = ren3d_camera_position;
  }

  ren3d.render();

  configurator = function() {

    // all files were loaded so re-attach the filedata so the
    // dropbox sharing can work
      if (_data.volume.file.length > 0) {

        _data.volume.filedata = [volume.filedata];

      }
      if (_data.mesh.file.length > 0) {

        _data.mesh.filedata = [mesh.filedata];

      }
      if (_data.fibers.file.length > 0) {

        _data.fibers.filedata = [fibers.filedata];

      }

      // show the dropbox icon
//MEI      $('#share').show();

  };

/* It looks like this is called from case like this,
..index.html?http://localhost/data/lefthemisphere.smoothwm
   and so needs to explicitly remove the 'loading file' progress
   bar here.
*/
   var loadingDiv = document.getElementById('loading');
   loadingDiv.style.display = 'none';

}
