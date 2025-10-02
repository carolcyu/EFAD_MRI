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

    //--- Script Loading ---//
    function loadScripts(urls, callback) {
        var loadedCount = 0;
        function checkLoad() {
            loadedCount++;
            if (loadedCount === urls.length) {
                callback();
            }
        }
        urls.forEach(function(url) {
            jQuery.getScript(url)
                .done(function() {
                    console.log('Successfully loaded script:', url);
                    checkLoad();
                })
                .fail(function(jqxhr, settings, exception) {
                    console.error('Failed to load script:', url, exception);
                    jQuery('#display_stage').html(
                        '<h3>Error</h3>' +
                        '<p>Could not load a required file for the experiment.</p>' +
                        '<p><b>File:</b> ' + url + '</p>' +
                        '<p>Please check the file path and your internet connection, then refresh the page.</p>'
                    );
                });
        });
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
    loadScripts(scripts_to_load, initExp);


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
                {stimulus: 'sdvp/SDVPS_4.jpg'}, {stimulus: 'sdvp/SDVPS_5.jpg'}, {stimulus: 'sdvp/SDVPS_6.jpg'},
                {stimulus: 'sdvp/SDVPS_7.jpg'}, {stimulus: 'sdvp/SDVPS_8.jpg'}, {stimulus: 'iaps_pos/1463.jpg'},
                {stimulus: 'iaps_pos/1811.jpg'}, {stimulus: 'iaps_pos/2071.jpg'}, {stimulus: 'iaps_pos/2154.jpg'},
                {stimulus: 'iaps_pos/4610.jpg'}, {stimulus: 'iaps_pos/5480.jpg'}, {stimulus: 'iaps_pos/5829.jpg'},
                {stimulus: 'iaps_pos/7400.jpg'}, {stimulus: 'iaps_pos/7492.jpg'}, {stimulus: 'iaps_pos/8380.jpg'},
                {stimulus: 'iaps_pos/8503.jpg'}
            ];
            test_stimuli.forEach(function(item) {
                all_images.push(window.task_github + item.stimulus);
            });

            var preload = {
                type: jsPsychPreload,
                images: all_images,
                message: 'Loading images, please wait...'
            };
            timeline.push(preload);

            // --- The rest of your E-FAD Experiment Timeline --- //
            var welcome = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "Welcome to another Image Rating Task! </p> <p>Press any button for instructions. </p>"
            };
            timeline.push(welcome);

            var instructions = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "<p>In this task, an image will appear on the screen.</p> <p>Using the response pad, please rate <strong>HOW PLEASANT an image is</strong>, as quickly as you can. If the image is...</p><p><strong>Very unpleasant</strong>, press the button 1</p><p><strong>Unpleasant</strong>, press the button 2</p><p><strong>Pleasant</strong>, press the button 3</p><p><strong>Very pleasant</strong>, press the button 4.</p><p> <img src='" + window.task_github + "img/response_key.png' alt='Key'></div></p><p>Press any button to continue.</p>",
                post_trial_gap: 1000,
            };
            timeline.push(instructions);

            var questions = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "<p>If you have questions or concerns, please signal to the examiner. </p> <p>If not, press any button to continue. </p>"
            };
            timeline.push(questions);

            var MRIstart = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>",
                choices: ['5'],
                prompt: "<p> A cross (+) will appear when the task starts. </p>",
                data: { task: 'mri_start' }
            };
            timeline.push(MRIstart);

            var fixation = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: '<div style="font-size:60px;">+</div>',
                choices: "NO_KEYS",
                trial_duration: 1000,
                data: { task: 'fixation' }
            };

            var test = {
                type: jsPsychImageKeyboardResponse,
                stimulus: jsPsych.timelineVariable('stimulus'),
                choices: "NO_KEYS",
                trial_duration: 2000,
                stimulus_height: 650,
                maintain_aspect_ration: true,
            };

            var response = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: "<p>How would you rate this image? </p>",
                choices: ['1', '2', '3', '4'],
                trial_duration: 3000,
                response_ends_trial: false,
                data: { task: 'response' }
            };

            var test_procedure = {
                timeline: [fixation, test, response],
                timeline_variables: test_stimuli.map(item => ({ stimulus: window.task_github + item.stimulus })),
                repetitions: 1,
                randomize_order: false,
                post_trial_gap: 500,
            };
            timeline.push(test_procedure);

            var debrief_block = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: function() {
                    var trials = jsPsych.data.get().filter({task: 'response'});
                    var rt = Math.round(trials.select('rt').mean());
                    return `<p>Your average response time was ${rt}ms.</p><p>Press any key to complete the experiment. Thank you for your time!</p>`;
                }
            };
            timeline.push(debrief_block);

            // This command starts the experiment
            jsPsych.run(timeline);

        } catch (error) {
            console.error('Error initializing experiment:', error);
            jQuery('#display_stage').html('<p style="color: red;">A critical error occurred while initializing the experiment. Please contact the study administrator.</p>');
        }
    }
});

Qualtrics.SurveyEngine.addOnReady(function() { /* ... */ });
Qualtrics.SurveyEngine.addOnUnload(function() { /* ... */ });
