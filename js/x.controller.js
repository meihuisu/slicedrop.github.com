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

/**
 * Setup all UI elements once the loading was completed.
 */
function setupUi() {

  // VOLUME
  if (_data.volume.file.length > 0) {

    // update threshold slider
    jQuery('#threshold-volume').dragslider("option", "max", volume.max);
    jQuery('#threshold-volume').dragslider("option", "min", volume.min);
    jQuery('#threshold-volume').dragslider("option", "values",
        [volume.min, volume.max]);

    // update window/level slider
    jQuery('#windowlevel-volume').dragslider("option", "max", volume.max);
    jQuery('#windowlevel-volume').dragslider("option", "min", volume.min);
    jQuery('#windowlevel-volume').dragslider("option", "values",
        [volume.min, volume.max]);

    volume.windowHigh = volume.max;

    // update 3d opacity
    jQuery('#opacity-volume').slider("option", "value", 20);
    volume.opacity = 0.2; // re-propagate
    volume.modified();

    // update 2d slice sliders
    var dim = volume.range;

    // ax
    jQuery("#blue_slider").slider("option", "disabled", false);
    jQuery("#blue_slider").slider("option", "min", 0);
    jQuery("#blue_slider").slider("option", "max", dim[2] - 1);
    jQuery("#blue_slider").slider("option", "value", volume.indexZ);

    // sag
    jQuery("#red_slider").slider("option", "disabled", false);
    jQuery("#red_slider").slider("option", "min", 0);
    jQuery("#red_slider").slider("option", "max", dim[0] - 1);
    jQuery("#red_slider").slider("option", "value", volume.indexX);

    // cor
    jQuery("#green_slider").slider("option", "disabled", false);
    jQuery("#green_slider").slider("option", "min", 0);
    jQuery("#green_slider").slider("option", "max", dim[1] - 1);
    jQuery("#green_slider").slider("option", "value", volume.indexY);


    jQuery('#volume .menu').removeClass('menuDisabled');

  } else {

    // no volume
    jQuery('#volume .menu').addClass('menuDisabled');
    jQuery("#blue_slider").slider("option", "disabled", true);
    jQuery("#red_slider").slider("option", "disabled", true);
    jQuery("#green_slider").slider("option", "disabled", true);

  }

  // CHANNEL
  if (_data.volume.file.length > 0 && hasChannels()>1 ) {
  // has rgb channels
    if(hasRGB()) {
      jQuery('#greenChannel').show();
      jQuery('#blueChannel').show();
      jQuery('#redChannel').show();
      jQuery("#channellevel").slider("option", "disabled", true);
      jQuery('#channellevel-label').hide();
      jQuery('#channellevel').hide();
      jQuery('#channellevel-btn').hide();
      } else {
        jQuery('#greenChannel').hide();
        jQuery('#blueChannel').hide();
        jQuery('#redChannel').hide();
        jQuery('#channellevel-label').show();
        jQuery('#channellevel').show();
        jQuery('#channellevel-btn').show();
        jQuery('#channellevel').slider("option", "disabled", false);
    }

    jQuery('#channel .menu').removeClass('menuDisabled');

  } else {
    jQuery('#channel .menu').addClass('menuDisabled');
  }

  // LABELMAP
  if (_data.labelmap.file.length > 0) {

    jQuery('#labelmapSwitch').show();

    jQuery('#opacity-labelmap').slider("option", "value", 40);
    volume.labelmap.opacity = 0.4; // re-propagate


  } else {

    // no labelmap
    jQuery('#labelmapSwitch').hide();

  }


  // MESH
  if (_data.mesh.file.length > 0) {

    jQuery('#opacity-mesh').slider("option", "value", 100);

// initialized in x.rendering already
//   mesh.color = [1, 1, 1];
//   mesh.opacity = 1.0; // re-propagate

   for ( var i = 0; i < meshs.length; i++) {
     var _mesh = meshs[i];
     var n=_mesh.file;
     var nn=n.split('/').pop().substring(0,3).toLowerCase();
     var nnn='<option value='+i+'>'+nn+'</option>';
     jQuery('#mesh-selector').append(nnn);
   }

    jQuery('#mesh .menu').removeClass('menuDisabled');

  } else {

    // no mesh
    jQuery('#mesh .menu').addClass('menuDisabled');

  }

  // SCALARS
  if (_data.scalars.file.length > 0) {

    // Not sure how multiple scalars can be handled ???
    var i=_data.scalars.file.length-1;
    var n=_data.scalars.file[i].name;
    var nn=n.split('/').pop().substring(0,12).toLowerCase();
    var nnn='<option value='+i+'>'+nn+'</option>';

    jQuery("#scalars-selector").append(nnn);

    jQuery("#threshold-scalars").dragslider("option", "disabled", false);
    jQuery("#threshold-scalars").dragslider("option", "min",
        mesh.scalars.min * 100);
    jQuery("#threshold-scalars").dragslider("option", "max",
        mesh.scalars.max * 100);
    jQuery("#threshold-scalars").dragslider("option", "values",
        [mesh.scalars.min * 100, mesh.scalars.max * 100]);

    // disable meshColor setting..
    var p = document.getElementById("meshColor");
    p.disabled = true;

    // init to the default scalar min color #00ff00 
    hex='#00ff00';
    jQuery('#scalarsMinColor').miniColors("value", hex);

    // init to the default scalar max color #ff0000
    hex='#ff0000';
    jQuery('#scalarsMaxColor').miniColors("value", hex);

  } else {
    if (mesh) { // init the default meshColor to the current mesh
      var _meshColor = ((1 << 24) + (mesh.color[0] * 255 << 16) +
          (mesh.color[1] * 255 << 8) + mesh.color[2] * 255)
          .toString(16).substr(1);
      jQuery('#meshColor').miniColors("value", _meshColor);
    }
  }

  // FIBERS
  if (_data.fibers.file.length > 0) {

    jQuery('#fibers .menu').removeClass('menuDisabled');

    jQuery("#threshold-fibers").dragslider("option", "min", fibers.scalars.min);
    jQuery("#threshold-fibers").dragslider("option", "max", fibers.scalars.max);
    jQuery("#threshold-fibers").dragslider("option", "values",
        [fibers.scalars.min, fibers.scalars.max]);

  } else {

    // no fibers
    jQuery('#fibers .menu').addClass('menuDisabled');

  }

  // store the renderer layout
  _current_3d_content = ren3d;
  _current_Ax_content = sliceAx;
  _current_Sag_content = sliceSag;
  _current_Cor_content = sliceCor;


  if (!_webgl_supported) {
  }

//MEI
  // initialize_sharing();

}

/**
 * Reset UI elements if volume data got changed
 */
function resetUi() {

  // VOLUME
  if (_data.volume.file.length > 0) {

    // update threshold slider
    jQuery('#threshold-volume').dragslider("option", "max", volume.max);
    jQuery('#threshold-volume').dragslider("option", "min", volume.min);
    jQuery('#threshold-volume').dragslider("option", "values",
        [volume.min, volume.max]);

    // update window/level slider
    jQuery('#windowlevel-volume').dragslider("option", "max", volume.max);
    jQuery('#windowlevel-volume').dragslider("option", "min", volume.min);
    jQuery('#windowlevel-volume').dragslider("option", "values",
        [volume.min, volume.max]);
    volume.windowHigh = volume.max;
  }
}

/**
 * Pre_Setup all UI elements for case when some files are not there
 */
function pre_setupUi() {
  // VOLUME
  // no volume to start with
  jQuery('#volume .menu').addClass('menuDisabled');

  // CHANNEL
  if (_data.volume.file.length > 0 && hasChannels()< 2) {
     // no channel
     jQuery('#channel .menu').addClass('menuDisabled');
  }

  // LABELMAP
  if (_data.labelmap.file.length == 0) {
    // no labelmap
    jQuery('#labelmapSwitch').hide();
  }

  // MESH
  if (_data.mesh.file.length ==0) {
    // no mesh
    jQuery('#mesh .menu').addClass('menuDisabled');
  }

  // SCALARS
  if (_data.scalars.file.length == 0) {

    var p = document.getElementById("scalars-selector");
    p.isabled = true;

    jQuery("#threshold-scalars").dragslider("option", "disabled", true);

    p = document.getElementById("scalarsMinColor");
    p.disabled = true;

    p = document.getElementById("scalarsMaxColor");
    p.disabled = true;
  }

  // FIBERS
  if (_data.fibers.file.length == 0) {
    // no fibers
    jQuery('#fibers .menu').addClass('menuDisabled');
  }
}

//http://stackoverflow.com/questions/11871077/proper-way-to-detect-webgl-support
function webgl_detect()
{
  if (!!window.WebGLRenderingContext) {
    var canvas = document.createElement("canvas"),
         names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
       context = false;

    for(var i=0;i<4;i++) {
      try {
        context = canvas.getContext(names[i]);
        if (context && typeof context.getParameter == "function") {
          // WebGL is enabled
          return true;
        }
      } catch(e) {}
    }
    // WebGL is supported, but disabled
    return false;
  }

  // WebGL not supported
  return false;
}

function volumerenderingOnOff(bool) {

  if (!volume) {
    return;
  }

  if (bool) {
// no need to initialize it
//    volume.lowerThreshold = (volume.min + (volume.max/10));
  }

  volume.volumeRendering = bool;

  if (RT.linked) {
    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'volumeRendering', volume.volumeRendering), 150);
  }


}

function thresholdVolume(event, ui) {

  if (!volume) {
    return;
  }

  volume.lowerThreshold = ui.values[0];
  volume.upperThreshold = ui.values[1];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'lowerThreshold', volume.lowerThreshold), 150);
    clearTimeout(RT._updater2);
    RT._updater2 = setTimeout(RT.pushVolume.bind(RT, 'upperThreshold', volume.upperThreshold), 150);

  }


}

function windowLevelVolume(event, ui) {

  if (!volume) {
    return;
  }

  volume.windowLow = ui.values[0];
  volume.windowHigh = ui.values[1];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'windowLow', volume.windowLow), 150);
    clearTimeout(RT._updater2);
    RT._updater2 = setTimeout(RT.pushVolume.bind(RT, 'windowHigh', volume.windowHigh), 150);

  }


}

function opacity3dVolume(event, ui) {

  if (!volume) {
    return;
  }

  volume.opacity = ui.value / 100;

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'opacity', volume.opacity), 150);

  }


}

function volumeslicingSag(event, ui) {

  if (!volume) {
    return;
  }

//???MEI  var cache=volume._volumeRenderingCache;
  volume.indexX = Math
      .floor(jQuery('#red_slider').slider("option", "value"));

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexY', volume.indexX), 150);

  }

}

function volumeslicingAx(event, ui) {

  if (!volume) {
    return;
  }

  volume.indexZ = Math.floor(jQuery('#blue_slider').slider("option", "value"));

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexX', volume.indexZ), 150);

  }

}

function volumeslicingCor(event, ui) {

  if (!volume) {
    return;
  }

  volume.indexY = Math.floor(jQuery('#green_slider').slider("option", "value"));

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'indexPA', volume.indexY), 150);

  }

}

//http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRGB(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var _rgb= result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    return _rgb;
}

function RGBTohex(rgb) {
   var r=Math.floor(rgb[0] * 255);
   var g=Math.floor(rgb[1] * 255);
   var b=Math.floor(rgb[2] * 255);
   var _hex = '#' + (r==0?'00':r.toString(16))+
               (g==0?'00':g.toString(16))+ (b==0?'00':b.toString(16));
   return _hex;
}

function fgColorVolume(hex, rgb) {

  if (!volume) {
    return;
  }


  volume.maxColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'maxColor', volume.maxColor), 150);

  }

}

function bgColorVolume(hex, rgb) {

  if (!volume) {
    return;
  }

  volume.minColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushVolume.bind(RT, 'minColor', volume.minColor), 150);

  }

}

//
// CHANNEL
//

function changeChannel(channel,color) {

  if (!volume) {
    return;
  }

  // if same channel, no need to do anything
  if( channel == hasChannel()) {
    return;
  }

  setChannel(channel);

  // need to abandon old one since volume data got updated
  volume.volumeRenderingCache = [];

  var _indexX=volume.indexX;
  var _indexY=volume.indexY;
  var _indexZ=volume.indexZ;
  var _indexXold=volume._indexXold;
  var _indexYold=volume._indexYold;
  var _indexZold=volume._indexZold;

  X.parserTIFF.prototype.resetChannel(volume, channel);
  volume.maxColor=color;

  volume.sliceInfoChanged(0);
  volume.sliceInfoChanged(1);
  volume.sliceInfoChanged(2);

  volume.indexX=_indexX;
  volume.indexY=_indexY;
  volume.indexZ=_indexZ;
  volume.indexXold=_indexXold;
  volume.indexYold=_indexYold;
  volume.indexZold=_indexZold;

  resetUi();
  volume.modified();

  sliceAx.update(volume);
  sliceSag.update(volume);
  sliceCor.update(volume);
}

function updateChannel(channel,color) {

  if (!volume) {
    return;
  }

  changeChannel(channel,color);

}

function channelLevelValue(event, ui) {

   if (!volume) {
     return;
   }

  // ui.value range form 0-100,
   var _t = hasChannels();

   var _value = Math.round(1+(_t-1) * ((ui.value) / 100));

   var _w=jQuery('#channellevel-btn').attr('value');
   var _s=_value.toString();

   if(_w == _s) {
     //window.console.log(" no change..");
     } else {
         var btn=document.getElementById("channellevel-btn");
         btn.value=_s;
         jQuery('#channellevel-btn').css({'background':'white'})
   }
}

//
// LABELMAP
//
function opacityLabelmap(event, ui) {

  if (!volume) {
    return;
  }

  volume.labelmap.opacity = ui.value / 100;

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushLabelmap.bind(RT, 'opacity', volume.labelmap.opacity), 150);

  }

}

function toggleLabelmapVisibility() {

  if (!volume) {
    return;
  }

  volume.labelmap.visible = !volume.labelmap.visible;

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushLabelmap.bind(RT, 'visible', volume.labelmap.visible), 150);

  }

}

//
// MESH
//
function toggleMeshVisibility() {

  if (!mesh) {
    return;
  }

  mesh.visible = !mesh.visible;

  if (RT.linked) {
    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushMesh.bind(RT, 'visible', mesh.visible), 150);
  }

}

// grab which mesh id
// update mesh
// reset the eyeball
// reset the meshColor
// reset the opacity
function toggleMeshSelector() {

  if (!mesh) {
    return;
  }

  var i=jQuery("#mesh-selector").val();

  // new mesh
  mesh=meshs[i];

// eye
  if(mesh.visible) {
      $('#meshvisibility').addClass('show-icon');
      $('#meshvisibility').removeClass('hide-icon');
  } else {
      $('#meshvisibility').addClass('hide-icon');
      $('#meshvisibility').removeClass('show-icon');
  }

// opacity
  jQuery('#opacity-mesh').slider("option", "value", mesh.opacity * 100);

// meshColor
  var _hex=RGBTohex(mesh.color);
  jQuery('#meshColor').miniColors("value", _hex);
}

function meshColor(hex, rgb) {

  if (!mesh) {
    return;
  }

  mesh.color = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushMesh.bind(RT, 'color', mesh.color), 150);

  }
}

function opacityMesh(event, ui) {

  if (!mesh) {
    return;
  }

  mesh.opacity = ui.value / 100;

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushMesh.bind(RT, 'opacity', mesh.opacity), 150);

  }
}

function thresholdScalars(event, ui) {

  if (!mesh) {
    return;
  }

  mesh.scalars.lowerThreshold = ui.values[0] / 100;
  mesh.scalars.upperThreshold = ui.values[1] / 100;

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushScalars.bind(RT, 'lowerThreshold', mesh.scalars.lowerThreshold), 150);
    clearTimeout(RT._updater2);
    RT._updater2 = setTimeout(RT.pushScalars.bind(RT, 'upperThreshold', mesh.scalars.upperThreshold), 150);

  }

}

function scalarsMinColor(hex, rgb) {

  if (!mesh) {
    return;
  }
  mesh.scalars.minColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushScalars.bind(RT, 'minColor', mesh.scalars.minColor), 150);

  }

}

function scalarsMaxColor(hex, rgb) {

  if (!mesh) {
    return;
  }

  mesh.scalars.maxColor = [rgb.r / 255, rgb.g / 255, rgb.b / 255];

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushScalars.bind(RT, 'maxColor', mesh.scalars.maxColor), 150);

  }

}

//
// Fibers
//
function toggleFibersVisibility() {

  if (!fibers) {
    return;
  }

  fibers.visible = !fibers.visible;

  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushFibers.bind(RT, 'visible', fibers.visible), 150);

  }


}

function thresholdFibers(event, ui) {

  if (!fibers) {
    return;
  }

  fibers.scalars.lowerThreshold = ui.values[0];
  fibers.scalars.upperThreshold = ui.values[1];
  if (RT.linked) {

    clearTimeout(RT._updater);
    RT._updater = setTimeout(RT.pushFibersScalars.bind(RT, 'lowerThreshold', fibers.scalars.lowerThreshold), 150);
    clearTimeout(RT._updater2);
    RT._updater2 = setTimeout(RT.pushFibersScalars.bind(RT, 'upperThreshold', fibers.scalars.upperThreshold), 150);

  }

}
