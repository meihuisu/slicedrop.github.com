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

// channel panel javascript
jQuery(function() {

  jQuery('#redChannel').button();
  jQuery('#redChannel').unbind('mouseenter').unbind('mouseleave');
  jQuery('#redChannel').click(function() {
    jQuery('#greenChannel').removeClass('ui-state-active');
    jQuery('#blueChannel').removeClass('ui-state-active');
    jQuery('#redChannel').addClass('ui-state-active');
    changeChannel(0,[1,0,0]);
  });
  
  jQuery('#greenChannel').button();
  jQuery('#greenChannel').unbind('mouseenter').unbind('mouseleave');
  jQuery('#greenChannel').click(function() {
    jQuery('#redChannel').removeClass('ui-state-active');
    jQuery('#blueChannel').removeClass('ui-state-active');
    jQuery('#greenChannel').addClass('ui-state-active');
    changeChannel(1,[0,1,0]);
  });
  
  jQuery('#blueChannel').button();
  jQuery('#blueChannel').unbind('mouseenter').unbind('mouseleave');
  jQuery('#blueChannel').click(function() {
    jQuery('#redChannel').removeClass('ui-state-active');
    jQuery('#greenChannel').removeClass('ui-state-active');
    jQuery('#blueChannel').addClass('ui-state-active');
    changeChannel(2,[0,0,1]);
  });

  jQuery('#channellevel-btn').button();
  jQuery('#channellevel-btn').bind('mouseenter').bind('mouseleave');
  jQuery('#channellevel-btn').click(function() {
    var _w=jQuery('#channellevel-btn').attr('value');
    var _i= parseInt(_w)-1;
    updateChannel(_i,[0.4,1,1]);
    $(this).css({'background':'#0064cd'});
  });

  jQuery('#channels').buttonset();

  jQuery('#channellevel').slider({
    // connect to x.controller.js
    slide: channelLevelValue
  });
  jQuery('#channellevel').width(100);
  
});
