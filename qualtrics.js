Qualtrics.SurveyEngine.addOnload(function()
{
    var qthis = this;
    qthis.hideNextButton();

    // Full screen setup
    jQuery('.QuestionText, .QuestionBody').hide();
    jQuery('.QuestionOuter').css({
        'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%',
        'height': '100vh', 'z-index': '9999', 'background': 'black',
        'margin': '0', 'padding': '0'
    });

    // Display stage
    var displayDiv = document.createElement('div');
    displayDiv.id = 'display_stage';
    displayDiv.innerHTML = '<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>';
    jQuery('.QuestionOuter').prepend(displayDiv);

    // Set the GitHub repository URL
    window.task_github = "https://carolcyu.github.io/EFAD_MRI/";

    //--- SCRIPT LOADING (NEW, MORE RELIABLE METHOD) ---//
    function loadScript(src, onLoad, onError) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.onload = onLoad;
        script.onerror = function() {
            onError(src);
        };
        document.head.appendChild(script);
    }

    function loadScriptsSequentially(urls, finalCallback) {
        var index = 0;
        function loadNext() {
            if (index < urls.length) {
                console.log('Loading script:', urls[index]);
                loadScript(urls[index], function() {
                    index++;
                    loadNext();
                }, function(failedUrl) {
                    console.error('Failed to load script:', failedUrl);
                    jQuery('#display_stage').html(
                        '<h3>Error</h3>' +
                        '<p>Could not load a required file for the experiment.</p>' +
                        '<p><b>File:</b> ' + failedUrl + '</p>' +
                        '<p>Please check the file path and your internet connection, then refresh the page.</p>'
                    );
                });
            } else {
                finalCallback();
            }
        }
        loadNext();
    }
    
    // List of scripts to load for the E-FAD task
    var scripts_to_load = [
        window.task_github + "jspsych/jspsych.js",
        window.task_github + "jspsych/plugin-html-keyboard-response.js",
        window.task_github + "jspsych/plugin-image-keyboard-response.js",
        window.task_github + "jspsych/plugin-preload.js"
    ];

    // Load CSS files
    jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
    jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_MRI.css'>").appendTo('head');

    // Start loading scripts, and call initExp when done
    loadScriptsSequentially(scripts_to_load, initExp);


    //--- Experiment Initialization ---//
    function initExp() {
        try {
            var jsPsych = initJsPsych({
                display_element: 'display_stage',
                on_finish: function() {
                    var EFAD_data = jsPsych.data.get().json();
                    Qualtrics.SurveyEngine.setEmbeddedData("EFAD", EFAD_data);
                    jQuery('#display_stage').remove();
                    qthis.clickNextButton();
                }
            });

            var timeline = [];

            // Preload all images before the task starts
            var all_images = [window.task_github + 'img/response_key.png'];
            var test_stimuli = [
                {stimulus: 'iaps_neg/1525.jpg'}, {stimulus: 'iaps_neg/2345_1.jpg'}, {stimulus: 'iaps_neg/3150.jpg'},
                {stimulus: 'iaps_neg/3170.jpg'}, {stimulus: 'iaps_neg/7380.jpg'}, {stimulus: 'iaps_neg/9140.jpg'},
                {stimulus: 'iaps_neg/9184.jpg'}, {stimulus: 'iaps_neg/9301.jpg'}, {stimulus: 'iaps_neg/9326.jpg'},
                {stimulus: 'iaps_neg/9611.jpg'}, {stimulus: 'iaps_neg/9903.jpg'}, {stimulus: 'iaps_neut/6150.jpg'},
                {stimulus: 'iaps_neut/7001.jpg'}, {stimulus: 'iaps_neut/7002.jpg'}, {stimulus: 'iaps_neut/7009.jpg'},
                {stimulus: 'iaps_neut/7026.jpg'}, {stimulus: 'iaps_neut/7052.jpg'}, {stimulus: 'iaps_neut/7055.jpg'},
                {stimulus: 'iaps_neut/7080.jpg'}, {stimulus: 'iaps_neut/7100.jpg'}, {stimulus: 'iaps_neut/7150.jpg'},
                {stimulus: 'iaps_neut/7705.jpg'}, {stimulus: 'sdvp/3068.jpg'}, {stimulus: 'sdvp/6570.jpg'},
                {stimulus: 'sdvp/SDVPS_1.jpg'}, {stimulus: 'sdvp/SDVPS_2.jpg'}, {stimulus: 'sdvp/SDVPS_3.jpg'},
                {stimulus: 'sd
