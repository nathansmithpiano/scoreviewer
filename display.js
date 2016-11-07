
var devicesArray = new Array();
addDevices();
var lpWidth;
var lpHeight;
var lcWidth; // viewport
var lcHeight; // viewport
var laWidth; //these have issues (can't detect non-matched total size), better to just use viewport size.
var laHeight; //these have issues (can't detect non-matched total size), better to just use viewport size.
var laDiag;
var lpRatio;
var lpPpi;
var lcPpi;
var lePpi;
var vpW;
var vpH;

//also, the labels and tables are lousy now, think more functionally on next update.
//these have data discrepency versus array and excel, maybe fix? maybe not important since total size is only used in calculations and not resizing?
var deviceHeight; //total screen size, sent to tHeight
var deviceWidth; //total screen size, sent to tWidth, d

//Some things only need to be created once, others both times
function createTestPanel() {
    
    //Unique to createTestPanel()
    lpRatio = window.devicePixelRatio || 1;
    $("#pRatio").text(lpRatio);
    
    lcPpi = getDPI();
    $("#cPpi").text(lcPpi);
    
    updateTestPanel();
    
}

//things that should be updated upon resize or rotate
function updateTestPanel() {
    
    //var lcWidth = $(window).width();
    lcWidth = $.windowWidth( "layout" ); //using jquery.documentsize
    $("#cWidth").text(lcWidth);
    
    //var lcHeight = $(window).height();
    lcHeight = $.windowHeight( "layout" );
    $("#cHeight").text(lcHeight);
    
    lpWidth = lcWidth * lpRatio;
    $("#pWidth").text(lpWidth);
    
    lpHeight = lcHeight * lpRatio;
    $("#pHeight").text(lpHeight);
    
    // laWidth = "";
    // laHeight = "";
    // laDiag = "";
    
    // lePpi = "";
    
    //viewport physical width and height
    Number.prototype.round = function(places) {
        return +(Math.round(this + "e+" + places)  + "e-" + places);
    }
    
    if (lpPpi) //not nil
    {
    
        vpW = (lpWidth / lpPpi).round(1);
        $("#vpWidth").text(vpW);
        
        vpH = (lpHeight / lpPpi).round(1);
        $("#vpHeight").text(vpH);
        
        // laWidth = (deviceWidth / lpPpi).round(1);
        // $("#aWidth").text(laWidth);
        
        // laHeight = (deviceHeight / lpPpi).round(1);
        // $("#aHeight").text(laHeight);
    }
}

function getDPI()
{
    ($("body").append("<div id=\x22testdiv\x22 style=\x22height: 1in; left: -100%; position: absolute; top: -100%; width: 1in;\x22></div>"));

    var dpi_x = document.getElementById('testdiv').offsetWidth * lpRatio;
    var dpi_y = document.getElementById('testdiv').offsetHeight * lpRatio;
    if (dpi_x != dpi_y)
    {
        alert("display.js: dpi_x and dpi_y do not match");
    }
    $("#testdiv").remove();
    
    return dpi_x;
}

function matchDevice()
{
    
}

//something is wrong with this, it works when starting in portrait mode but not when starting in landscape or when starting in one and switching to the other...
function configDevice()
{
    alert("This will config your device.  Begin in portrait mode.  If you are using a mobile device, please ensure that you have disabled orientation lock.  To work correctly, you must be able to change from portrait to landscape mode.\n\nIf you are not using a mobile device, please disregard this message.");
    
    //using all the calls in jquery.documentsize, probably unnecessary
    var tempWidth1 = $.windowWidth( "layout" );
    var tempWidth2 = $.windowWidth( "layout" );
    var tempWidth3 = $.documentWidth();
    var tempWidth4;
    var tempWidth5;
    var tempWidth6;
    var checkWidth;
    var checkHeight;
    var scrollBarWidth = 0;
    
    //accounts for scroll bars, if present, and alerts client
    if ($("body").height() > $(window).height()) {
        scrollBarWidth = $.scrollbarWidth();
        tempWidth1 += scrollBarWidth;
        tempWidth2 += scrollBarWidth;
        tempWidth3 += scrollBarWidth;
        alert("Has scroll bars");
    }
    
    alert("Step 2: Please rotate your device and hit \x22OK\x22.  If you're not on a mobile device, please disregard this message and hit OK.\n\nPlease do not rotate the device a second time before test is complete.");
    
    //delay to allow device to rotate and re-create content
    //note: need somehow to prevent user from rotating screen during this delay
    var configDelay = function()
    {
        tempWidth4 = $.windowWidth( "layout" );
        tempWidth5 = $.windowWidth( "layout" );
        tempWidth6 = $.documentWidth();
        
        //accounts for scroll bars, if present, and alerts client
        if ($("body").height() > $(window).height()) 
        {
            scrollBarWidth = $.scrollbarWidth();
            tempWidth1 += scrollBarWidth;
            tempWidth2 += scrollBarWidth;
            tempWidth3 += scrollBarWidth;
            alert("Has scroll bars");
        }
    
        //if the jquery.documentsize things went awry
        if (tempWidth1 != tempWidth2 || tempWidth1 != tempWidth3 || tempWidth2 != tempWidth3 ) 
        {
            alert("Code 0123, please inform developer.")
        }
        if (tempWidth4 != tempWidth5 || tempWidth5 != tempWidth6 || tempWidth4 != tempWidth6 ) 
        {
            alert("Code 0124, please inform developer.")
        }
        
        //restructures in portrait mode
        if (tempWidth1 > tempWidth4) 
        {
            checkWidth = tempWidth4;
            checkHeight = tempWidth1;
        }else{
            checkWidth = tempWidth1;
            checkHeight = tempWidth4;
        }
        
        deviceWidth = checkWidth;
        deviceHeight = checkHeight;
        $("#testInfoMessage").text(deviceWidth + " wide, " + deviceHeight + " high");
        alert("Test complete");
        findMatches();
    };
    
    setTimeout(configDelay, 2000);
    
    //now has accurate width and height
        //can match width and height with pRatio and cPpi
    
    
    
    
}

function findMatches()
{
    var foundMatch = false;
    devicesArray.forEach(function(device, index) {
        if (!foundMatch)
        {
            if ((deviceWidth == device.cWidth) || (deviceWidth == device.cHeight))
            {
                //$("#testInfoMessage").append("<br />" + "Possible match: " + device.dName);
                
                if ((deviceHeight == device.cWidth) || (deviceHeight == device.cHeight))
                {
                    if (lpRatio == device.pRatio)
                    {
                        if (lcPpi == device.cPpi)
                        {
                            $("#testInfoMessage").append("<br />" + "Possible match: " + device.dName);
                            lpPpi = device.pPpi;
                            foundMatch = true;
                            createRemainingDisplayInfo();
                        }
                    }
                    
                }
            }
        }
        
    });
    
    if (!foundMatch)
    {
        if (lpRatio == 1)
        {
            $("#testInfoMessage").append("<br />" + "Unknown TV or monitor");
            lpPpi = 96; //default
            createRemainingDisplayInfo();
        }else{
            $("#testInfoMessage").append("<br />" + "Unknown device");
        }
        
    }
}

function createRemainingDisplayInfo()
{
    $("#tWidth").text(deviceWidth);
    $("#tHeight").text(deviceHeight);
    $("#pPpi").text(lpPpi);
    
    //round
    Number.prototype.round = function(places) {
        return +(Math.round(this + "e+" + places)  + "e-" + places);
    }
    
    lePpi = (lpPpi / lpRatio).round(0);
    $("#pPpi").text(lePpi);
        
    $("#ePpi").text(lpPpi);
    
    updateTestPanel();
    
    // vpW = (lpWidth / lpPpi).round(1);
    // $("#vpWidth").text(vpW);
    
    // vpH = (lpHeight / lpPpi).round(1);
    // $("#vpHeight").text(vpH);
    
    
    
}


function addDevice(a, b, c, d, e, f, g, h, i, j, k, l)
{
    var newDevice = {
                        dName: a,
                        pWidth: b,
                        pHeight: c,
                        cWidth: d,
                        cHeight: e,
                        aWidth: f,
                        aHeight: g,
                        aDiag: h,
                        pRatio: i,
                        pPpi: j,
                        cPpi: k,
                        ePpi: l
    };
    
    //search for duplicate (build later)
    
    devicesArray.push(newDevice);
}

function addDevices()
{
    addDevice("Amazon Kindle Fire",600,1024,600,1024,3.59,6.13,7.1,1,167,96,167);
    addDevice("Amazon Kindle Fire HD 7",800,1280,480,800,3.7,5.93,6.99,1.5,216,144,144);
    addDevice("Amazon Kindle Fire HD 8.9",1200,1920,800,1280,4.72,7.56,8.91,1.5,254,144,169);
    addDevice("Apple iPad 1 or 2",768,1024,768,1024,5.82,7.76,9.7,1,132,96,132);
    addDevice("Apple iPad 3 or 4 or Air or Air2",1536,2048,768,1024,5.82,7.76,9.7,2,264,192,132);
    addDevice("Apple iPad mini",768,1024,768,1024,4.71,6.28,7.85,1,163,96,163);
    addDevice("Apple iPad mini 2 or 3",1536,2048,768,1024,4.71,6.28,7.85,2,326,192,163);
    addDevice("Apple iPad Pro",2048,2732,1024,1366,7.73,10.31,12.89,2,265,192,133);
    addDevice("Apple iPhone 3",320,480,320,480,1.96,2.94,3.53,1,163,96,163);
    addDevice("Apple iPhone 4",640,960,320,480,1.96,2.94,3.53,2,326,192,163);
    addDevice("Apple iPhone 5",640,1136,320,568,1.96,3.48,3.99,2,326,192,163);
    addDevice("Apple iPhone 6 Plus or 6s Plus",1080,1920,414,736,2.69,4.79,5.49,3,401,249,134);
    addDevice("Apple iPhone 6 or 6s",750,1334,375,667,2.3,4.09,4.69,2,326,192,163);
    addDevice("Apple iPhone 7",750,1334,375,667,2.3,4.09,4.69,2,326,192,163);
    addDevice("Apple iPod Touch",640,1136,320,568,1.96,3.48,3.99,2,326,192,163);
    addDevice("Asus Nexus 7 (v1)",800,1280,604,966,3.7,5.93,6.99,1.3,216,127,166);
    addDevice("Asus Nexus 7 (v2)",1200,1920,600,960,3.72,5.94,7.01,2,323,192,162);
    addDevice("Blackberry Classic",720,720,390,390,2.45,2.45,3.46,1.8,294,177,163);
    addDevice("Blackberry Leap",720,1280,390,695,2.45,4.35,4.99,2,294,177,147);
    addDevice("Blackberry Passport",1440,1440,504,504,3.18,3.18,4.5,3,453,274,151);
    addDevice("Blackberry Playbook",600,1024,600,1024,3.55,6.06,7.02,1,169,96,169);
    addDevice("Blackberry Q10",720,720,346,346,2.2,2.2,3.11,2,328,192,164);
    addDevice("Blackberry Torch 9800",360,480,360,480,1.93,2.57,3.21,1,187,96,187);
    addDevice("Blackberry Z10",768,1280,384,640,2.16,3.61,4.21,2,355,192,178);
    addDevice("Blackberry Z30",720,1280,360,640,2.44,4.34,4.98,2,295,192,148);
    addDevice("HTC 8X",720,1280,320,480,2.11,3.75,4.3,3,341,288,114);
    addDevice("HTC Evo 3D",540,960,360,640,2.11,3.75,4.3,1.5,256,144,171);
    addDevice("HTC Nexus 9",1538,2048,768,1024,5.47,7.29,9.11,2,281,192,141);
    addDevice("HTC One",1080,1920,360,640,2.31,4.1,4.71,3,468,288,156);
    addDevice("Lenovo K900",1080,1920,360,640,2.69,4.79,5.49,3,401,288,134);
    addDevice("LG G Pad 8.3",1200,1920,600,960,4.4,7.03,8.29,2,273,192,137);
    addDevice("LG G3",1440,2560,360,640,2.68,4.76,5.46,4,538,384,135);
    addDevice("LG G4",1440,2560,360,640,2.68,4.76,5.46,4,538,384,135);
    addDevice("LG G5",1440,2560,360,640,2.68,4.76,5.46,4,538,384,135);
    addDevice("LG Nexus 4",768,1280,384,640,2.4,4,4.66,2,320,192,160);
    addDevice("LG Nexus 5",1080,1920,360,640,2.43,4.31,4.95,3,445,288,148);
    addDevice("LG Optimus G",768,1280,384,640,2.42,4.03,4.7,2,318,192,159);
    addDevice("Microsoft Lumia 1020",768,1280,320,480,2.31,3.86,4.5,2.4,332,220,138);
    addDevice("Microsoft Lumia 1520",1080,1920,432,768,2.94,5.23,6,2.5,367,240,147);
    addDevice("Microsoft Lumia 620",480,800,320,480,1.9,3.17,3.7,1.5,252,144,168);
    addDevice("Microsoft Lumia 830",720,1280,320,480,2.45,4.35,4.99,2,294,192,147);
    addDevice("Microsoft Lumia 900",480,800,320,480,2.21,3.69,4.3,1.5,217,144,145);
    addDevice("Microsoft Lumia 920",768,1280,320,480,2.31,3.86,4.5,2.4,332,220,138);
    addDevice("Microsoft Lumia 925",768,1280,320,480,2.31,3.86,4.5,2.4,332,220,138);
    addDevice("Microsoft Surface",768,1366,768,1366,5.19,9.23,10.59,1,148,96,148);
    addDevice("Microsoft Surface Pro",1080,1920,720,1280,5.22,9.28,10.65,1.5,207,144,138);
    addDevice("Microsoft Surface Pro 2",1080,1920,720,1280,5.22,9.28,10.65,1.5,207,144,138);
    addDevice("Microsoft Surface Pro 3",1440,2160,1024,1440,6.67,10,12.02,1.5,216,144,144);
    addDevice("Motorola Nexus 6",1440,2560,412,690,2.92,5.19,5.96,3.5,493,336,141);
    addDevice("Pantech Vega No. 6",1080,1920,360,640,2.9,5.15,5.91,3,373,288,124);
    addDevice("Samsung Galaxy Nexus",720,1200,360,600,2.28,3.8,4.43,2,316,192,158);
    addDevice("Samsung Galaxy Note",800,1280,400,640,2.81,4.49,5.3,2,285,192,143);
    addDevice("Samsung Galaxy Note 2",720,1280,360,640,2.7,4.79,5.5,2,267,192,134);
    addDevice("Samsung Galaxy Note 3",1080,1920,360,640,2.8,4.97,5.7,3,386,288,129);
    addDevice("Samsung Galaxy Note 4",1440,2560,360,640,2.8,4.97,5.7,4,515,384,129);
    addDevice("Samsung Galaxy S",480,800,320,533,2.06,3.43,4,1.5,233,144,155);
    addDevice("Samsung Galaxy S2",480,800,320,533,2.21,3.69,4.3,1.5,217,144,145);
    addDevice("Samsung Galaxy S3",720,1280,360,640,2.35,4.18,4.8,2,306,192,153);
    addDevice("Samsung Galaxy S3 mini",480,800,320,533,2.06,3.43,4,1.5,233,144,155);
    addDevice("Samsung Galaxy S4",1080,1920,360,640,2.45,4.35,4.99,3,441,288,147);
    addDevice("Samsung Galaxy S4 mini",540,960,360,640,2.11,3.75,4.3,1.5,256,144,171);
    addDevice("Samsung Galaxy S5",1080,1920,360,640,2.45,4.35,4.99,3,441,288,147);
    addDevice("Samsung Galaxy S6",1440,2560,360,640,2.5,4.44,5.1,4,577,384,144);
    addDevice("Samsung Galaxy S7 or S7 edge",1440,2560,360,640,2.7,4.79,5.5,4,534,384,134);
    addDevice("Samsung Galaxy Tab (8.9 inch)",800,1280,800,1280,4.71,7.53,8.88,1,170,96,170);
    addDevice("Samsung Galaxy Tab 2 (7 inch)",600,1024,600,1024,3.53,6.02,6.98,1,170,96,170);
    addDevice("Samsung Galaxy Tab 2 10 inch",800,1280,800,1280,5.37,8.59,10.13,1,149,96,149);
    addDevice("Samsung Galaxy Tab 3 10 inch",800,1280,800,1280,5.37,8.59,10.13,1,149,96,149);
    addDevice("Samsung Nexus 10",1600,2560,800,1280,5.33,8.53,10.06,2,300,192,150);
    addDevice("Sony Xperia P",540,960,360,640,1.96,3.49,4,1.5,275,144,183);
    addDevice("Sony Xperia S",720,1280,360,640,2.11,3.74,4.29,2,342,192,171);
    addDevice("Sony Xperia Z",1080,1920,360,640,2.44,4.33,4.97,3,443,288,148);
    addDevice("Sony Xperia Z3",1080,1920,360,598,2.55,4.53,5.2,3,424,288,141);
    addDevice("Xiaomi Mi 3",1080,1920,360,640,2.45,4.35,4.99,3,441,288,147);
    addDevice("Xiaomi Mi 4",1080,1920,360,640,2.45,4.35,4.99,3,441,288,147);
    addDevice("ZTE Grand S",1080,1920,360,640,2.45,4.35,4.99,3,441,288,147);
    addDevice("ZTE Open (Firefox OS)",480,720,320,480,2.91,4.36,5.24,1.5,165,144,110);
}