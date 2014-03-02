requirejs.config({
  paths: {
    "jquery": '../components/jquery/jquery'
  }
});

require([
    'jquery'
],

function($) {
    ///////////////////////////////////////////////////////////////
    ////////////////////////////GLOBALS////////////////////////////
    ///////////////////////////////////////////////////////////////

    var LOCATION = [];
    LOCATION[0] = 'Avery-100-East_EVENT_MAIL_May_';
    LOCATION[1] = 'Avery-100-West_EVENT_MAIL_May_';
    LOCATION[2] = 'Avery-200_EVENT_MAIL_May_';
    LOCATION[3] = 'Avery-400-South_EVENT_MAIL_May_';
    LOCATION[4] = 'Avery-400-North_EVENT_MAIL_May_';
    LOCATION[5] = 'Avery-400-Lobby_EVENT_MAIL_May_';
    LOCATION[6] = 'Avery-600-Ware_EVENT_MAIL_May_';
    LOCATION[7] = 'Avery-Lawn-South_EVENT_MAIL_May_';

    var LABEL = [];
    LABEL[0] = "Avery 100 East";
    LABEL[1] = "Avery 100 West";
    LABEL[2] = "Avery 200";
    LABEL[3] = "Avery 400 North";//CAMERAS MIS-NAMED!!!!!!!
    LABEL[4] = "Avery 400 South";//CAMERAS MIS-NAMED!!!!!!!
    LABEL[5] = "Avery 400 Lobby";
    LABEL[6] = "Avery 600 Ware";
    LABEL[7] = "Avery Lawn South";

    var IMG_ID = [];
    IMG_ID[0] = 'avery100east';
    IMG_ID[1] = 'avery100west';
    IMG_ID[2] = 'avery200';
    IMG_ID[3] = 'avery400south';
    IMG_ID[4] = 'avery400north';
    IMG_ID[5] = 'avery400lobby';
    IMG_ID[6] = 'avery600ware';
    IMG_ID[7] = 'averyLAWNsouth';

    var HALF_BUFFER_LENGTH = 3;
    var BUFFER_END = [];//indices of last buffer item
    BUFFER_END[0] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[1] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[2] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[3] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[4] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[5] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[6] = HALF_BUFFER_LENGTH-1;
    BUFFER_END[7] = HALF_BUFFER_LENGTH-1;

    var INTERVAL_ID;
    var CURRENT_ITEM;
    var DEFAULT_OFFSET;//offset in minutes to allow image to propagate


    ///////////////////////////////////////////////////////////////
    ///////////////////////////FUNCTIONS///////////////////////////
    ///////////////////////////////////////////////////////////////

    //centers the feed image on the page and makes it visible
    function centerImage(){
        var iw = $('#image').width();
        var ih = $('#image').height();

        var top = 0,
            left = 0;

        if(iw > window.innerWidth){
            var left = -1 * (iw - window.innerWidth) / 2;
        }else{
            if(ih > window.innerHeight){
                console.log('height bigger');
                var top = -1 * (ih - window.innerHeight) / 2;
            }
        }

        $('#image').css({
            top: top,
            left: left,
            opacity: 1
        });

        return true;
    }

    //centers the header on resize
    function centerHeader(){
        $('#header-container').width('').width('100%');
    }

    //window resize function
    function resizeFunc(){
        centerImage(); 
        centerHeader();
    }


    function getNowImageSource(index, offset){
        if(typeof(index) != 'undefined'){
            index = index;
        }else{
            index = LOCATION_INDEX;
        }

        if(typeof(offset) != 'undefined'){
            offset = offset;
        }else{
            offset = DEFAULT_OFFSET;
        }

        var db = 'https://dl.dropboxusercontent.com/u/22910000/eoys2013/';

        var bridge = '__2013_at_';

        var now = new Date();
        var then = new Date(now.getTime() - 60000*offset);
        var date = then.getDate();
        var hour = parseInt( then.getHours() );
        var minute = parseInt(then.getMinutes());

        var ampm = '';

        if(hour < 12){
            ampm = 'AM';
            if(hour < 10){
                if(hour == 0){
                    hour == '12';
                }
                hour = '0' + hour;
            }
        }else{
            ampm = 'PM';
            if(hour > 12){
                hour = hour - 12;
                if(hour < 10){
                    hour = '0' + hour;
                }
            }
        }

        if( parseInt(minute) < 10){
            minute = '0' + minute;
        }
        var src = db + LOCATION[ index ] + date + bridge + hour + minute + ampm + '.jpg';

        return src;

    }

    function cycleImage(index, offset){
        if(typeof(index) != 'undefined'){
            index = index;
        }else{
            index = LOCATION_INDEX;
        }

        if(typeof(offset) != 'undefined'){
            offset = offset;
        }else{
            offset = DEFAULT_OFFSET;
        }
        var src = $('#buffer #location-'+index+' .buffer-item-'+CURRENT_ITEM+' img').attr('src');
        console.log('selector: '+'#buffer #location-'+index+' .buffer-item-'+CURRENT_ITEM+' img');
        $('#image').attr('src', src );

        console.log('src: '+src);

        $('#feed-label > div').text( LABEL[ index ] );

        return src;
    }

    function incrementImageFeed(){
        console.log('incrementImageFeed()');
        LOCATION_INDEX++;
        if(LOCATION_INDEX >= LOCATION.length){
            LOCATION_INDEX = 0;
        }
        CURRENT_ITEM = 0;


        cycleImage();
        centerImage();
    }

    function decrementImageFeed(){
        LOCATION_INDEX--;
        if(LOCATION_INDEX < 0){
            LOCATION_INDEX = LOCATION.length - 1;
        }
        CURRENT_ITEM = 0;
        cycleImage();
        centerImage();
    }
      
    
    
    
    /* BUFFERING */
    //creates #buffer div and loads it with images for each location
    function loadBuffer(){
        console.log('loadBuffer()');
        $('body').append('<div id="buffer"></div>');

        for(var i = 0; i < LOCATION.length; i++){
            $('#buffer').append('<ul id="location-'+i+'"></ul>');

            //for(var j = 0; j < 1; j++){
                var src = getNowImageSource(i, DEFAULT_OFFSET);
                $('#location-'+i).append('<li class="buffer-item-'+'0'+'"><img onerror="imgError(this);" src="'+src+'"><li>');
            //}
        }
    }
    
    function finishBufferLoad(){
        console.log('finishBufferLoad()');
        for(var i = 0; i < LOCATION.length; i++){
            for(var j = 1; j < HALF_BUFFER_LENGTH; j++){
                var src = getNowImageSource(i, DEFAULT_OFFSET+j);
                //only append if not already existing
                if($('#location-'+i+' .buffer-item-'+j).length < 1){
                    $('#location-'+i).append('<li class="buffer-item-'+j+'"><img onerror="imgError(this);" src="'+src+'"><li>');
                }
            }
        }
    }

    /*
    //if the buffer for a particular location has been added to, it resets it
    function reloadBuffer(){
        for(var i = 0; i < LOCATION.length; i++){
            if( BUFFER_END[i] != (HALF_BUFFER_LENGTH-1)){
                $('#location-'+i).html('');
                for(var j = 0; j < HALF_BUFFER_LENGTH; j++){
                    var src = getNowImageSource(i, DEFAULT_OFFSET+j);
                    $('#location-'+i).append('<li class="buffer-item-'+j+'"><img onerror="imgError(this);" src="'+src+'"><li>');
                }
                BUFFER_END[i] = 19;
            }
        }
    }*/

    //adds an additional image to the end of the buffer for the current location
    function incrementBuffer(){
        BUFFER_END[LOCATION_INDEX]++;
        var src = getNowImageSource(LOCATION_INDEX, DEFAULT_OFFSET+BUFFER_END[LOCATION_INDEX]);
        
        $('#location-'+LOCATION_INDEX).append('<li class="buffer-item-'+BUFFER_END[LOCATION_INDEX]+'"><img onerror="imgError(this);" src="'+src+'"><li>');        
        //var buffer_start = BUFFER_END[LOCATION_INDEX]-(2*HALF_BUFFER_LENGTH);
        //if( buffer_start > 0){
        //   $('#location-'+LOCATION_INDEX+' .buffer-item-'+buffer_start).detach(); 
        //}
    }
/*
    function decrementBuffer(){
        BUFFER_END[LOCATION_INDEX]--;
        var buffer_start = BUFFER_END[LOCATION_INDEX]-(2*HALF_BUFFER_LENGTH);
        if( buffer_start > 0){
            var src = getNowImageSource(LOCATION_INDEX, DEFAULT_OFFSET+buffer_start);
            $('#location-'+LOCATION_INDEX).append('<li class="buffer-item-'+buffer_start+'"><img onerror="imgError(this);" src="'+src+'"><li>');        
            $('#location-'+LOCATION_INDEX+' .buffer-item-'+BUFFER_END[LOCATION_INDEX]).detach(); 
        }
    }
*/

    /* INDEX */
    //async gets index.ejs content and replaces #main html with it
    function showIndex(event){
        event.preventDefault();

        var that = this;

        $.get('eoys2013/index', function(data) {
            $('body').addClass('index');
            $('#main').html(data);

            clearInterval(INTERVAL_ID);

            for(var i = 0; i < IMG_ID.length; i++){
                $('#'+IMG_ID[i]).attr( 'src', getNowImageSource(i) );
            }

            $('.feed-nav').each(function(){
                if( ($(this).width() / $(this).height() ) < ( 1280 / 800 )){
                    $(this).height( $(this).width()*800/1280 );
                }
            });

            $('.feed-nav').click(loadFeed);

            $(that).unbind('click').text('About').bind('click', aboutScrollFunc);
        });
    } 

    //scrolls down to the about content on the index page
    function aboutScrollFunc(event){
        event.preventDefault();
        $('html, body').animate({scrollTop:$('#about').position().top}, 'slow');
    }

    //loads the feed after clicking on a feed from the index page
    function loadFeed(event){
        event.preventDefault();

        console.log('clicked!');

        var feedId = $(this).attr('id');

        switch(feedId){
            case 'avery100east':
                LOCATION_INDEX = 0;
                break;
            case 'avery100west':
                LOCATION_INDEX = 1;
                break;
            case 'avery200':
                LOCATION_INDEX = 2;
                break;
            case 'avery400south':
                LOCATION_INDEX = 3;
                break;
            case 'avery400north':
                LOCATION_INDEX = 4;
                break;
            case 'avery400lobby':
                LOCATION_INDEX = 5;
                break;
            case 'avery600ware':
                LOCATION_INDEX = 6;
                break;
            case 'averyLAWNsouth':
                LOCATION_INDEX = 7;
                break;
            default:
                LOCATION_INDEX = 0;
                break;
        }

        $('body').removeClass('index');

        $('#main').html('<div id="prev"></div><div id="next"></div><div id="feed-label"><div></div></div><img id="image" src="">');

        CURRENT_ITEM = 0;
        initFeed();
        centerImage();
    }

    function scrollFunc(event){
        clearInterval(INTERVAL_ID);
        var delta = event.wheelDelta;
        delta = parseInt(delta);

        console.log('delta: '+ delta);
        console.log('CURRENT_ITEM: '+ CURRENT_ITEM);
        console.log('DEFAULT_OFFSET: '+ DEFAULT_OFFSET);

        if(delta < 0){//go backwards in time

            CURRENT_ITEM++;
            var selector = '#buffer #location-'+LOCATION_INDEX+' .buffer-item-'+CURRENT_ITEM+' img';
            var src = $(selector).attr('src');
            console.log('selector: '+selector);
            $('#image').attr('src', src);
            incrementBuffer();

        }else{
            if(CURRENT_ITEM > 0){

                CURRENT_ITEM--;
                var selector = '#buffer #location-'+LOCATION_INDEX+' .buffer-item-'+CURRENT_ITEM+' img';
                var src = $(selector).attr('src');
                console.log('selector: '+selector);
                $('#image').attr('src', src);
                //decrementBuffer();
            }
        }
    }

    /* INIT */
    function initFeed(){
        DEFAULT_OFFSET = 3;
        CURRENT_ITEM = 0;

        $('#image').attr('src', getNowImageSource() );
        $('#feed-label > div').text( LABEL[ LOCATION_INDEX ] );

        $('#next').unbind('click').click(function(){
            incrementImageFeed();
        });

        $('#prev').unbind('click').click(function(){
            decrementImageFeed();
        });

        $('#index-nav').unbind('click').text('Feeds').bind('click', showIndex);

        //start the refresh timer
        INTERVAL_ID = setInterval(function(){
            $('#image').attr('src', getNowImageSource() );
        }, 60000);//cycle each minute
    }


    ///////////////////////////////////////////////////////////////
    ////////////////////////////SCRIPTS////////////////////////////
    ///////////////////////////////////////////////////////////////

    
    //randomly choose first location
    var LOCATION_INDEX = Math.floor(Math.random()*LOCATION.length);
    initFeed();
    loadBuffer();

    $(window).resize(resizeFunc);

    $(window).load(function(){
        centerImage();
        setTimeout(function(){
            finishBufferLoad();
        }, 500);
        setTimeout(function(){
            $('#preloader').remove();
        }, 1500);//10 seconds hard coded
    });

    window.onload = function(){
        //adding the event listerner for Mozilla
        if(window.addEventListener){
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        }

        //for IE/OPERA/chrome/safari etc
        document.onmousewheel = scrollFunc;
    }

});














