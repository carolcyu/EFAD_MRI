Qualtrics.SurveyEngine.addOnload(function()
{
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons and question content
    qthis.hideNextButton();
    
    // Hide the question text and make the container full screen
    jQuery('.QuestionText, .QuestionBody').hide();
    jQuery('.QuestionOuter').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100vh',
        'z-index': '9999',
        'background': 'black',
        'margin': '0',
        'padding': '0'
    });
    
    // Create display elements
    var displayDiv = document.createElement('div');
    displayDiv.id = 'display_stage';
    displayDiv.style.cssText = 'width: 100%; height: 100vh; padding: 80px 20px 20px 20px; position: relative; z-index: 1000; display: flex; flex-direction: column; justify-content: center; align-items: center;';
    displayDiv.innerHTML = '<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>';
    
    // Insert at the top of the question area
    jQuery('.QuestionOuter').prepend(displayDiv);
    
    // <<< IMPORTANT: Confirm this is the correct URL for your E-FAD task assets >>>
    window.task_github = "https://carolcyu.github.io/STT_MRI/"; 
    
    // Load the experiment
    if (typeof jQuery !== 'undefined') {
        loadExperiment();
    }
    
    function loadExperiment() {
        // Update display
        jQuery('#display_stage').html('<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>');
        
        // Load CSS
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_MRI.css'>").appendTo('head');
        
        // Scripts to load
        var scripts = [
            window.task_github + "jspsych/jspsych.js",
            window.task_github + "jspsych/plugin-image-keyboard-response.js",
            window.task_github + "jspsych/plugin-html-keyboard-response.js"
        ];
        
        loadScripts(0);
        
        function loadScripts(index) {
            if (index >= scripts.length) {
                setTimeout(initExp, 500);
                return;
            }
            
            jQuery.getScript(scripts[index])
                .done(function() {
                    loadScripts(index + 1);
                })
                .fail(function() {
                    jQuery('#display_stage').html('<p style="color: red;">Failed to load experiment scripts. Please refresh the page.</p>');
                });
        }
    }


function initExp(){
    try {
        if (typeof initJsPsych === 'undefined') {
            jQuery('#display_stage').html('<p style="color: red;">Error: jsPsych library not loaded</p>');
            return;
        }
        
        var jsPsych = initJsPsych({
            display_element: 'display_stage',
            on_finish: function() {
                // <<< FIX: Saving data to the correct "EFAD" embedded data field >>>
                var EFAD_data = jsPsych.data.get().json();
                Qualtrics.SurveyEngine.setEmbeddedData("EFAD", EFAD_data);
                
                // Clean up and proceed
                jQuery('#display_stage').remove();
                qthis.clickNextButton();
            }
        }); 
      
      // <<< This is the timeline from your E-FAD index.html file >>>
      var timeline = [];

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

      var MRIstart ={
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>",
        choices: ['5'],
        prompt: "<p> A cross (+) will appear when the task starts. </p>",
        data: {
          task: 'mri_start'
        }
      };
      timeline.push(MRIstart);

      var test_stimuli = [
        {stimulus: window.task_github + 'iaps_neg/1525.jpg'},
        {stimulus: window.task_github + 'iaps_neg/2345_1.jpg'},
        {stimulus: window.task_github + 'iaps_neg/3150.jpg'},
        {stimulus: window.task_github + 'iaps_neg/3170.jpg'},
        {stimulus: window.task_github + 'iaps_neg/7380.jpg'},
        {stimulus: window.task_github + 'iaps_neg/9140.jpg'},
        {stimulus: window.task_github + 'iaps_neg/9184.jpg'},
        {stimulus: window.task_github + 'iaps_neg/9301.jpg'},
        {stimulus: window.task_github + 'iaps_neg/9326.jpg'},
        {stimulus: window.task_github + 'iaps_neg/9611.jpg'},
        {stimulus: window.task_github + 'iaps_neg/9903.jpg'},
        {stimulus: window.task_github + 'iaps_neut/6150.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7001.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7002.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7009.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7026.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7052.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7055.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7080.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7100.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7150.jpg'},
        {stimulus: window.task_github + 'iaps_neut/7705.jpg'},
        {stimulus: window.task_github + 'sdvp/3068.jpg'},
        {stimulus: window.task_github + 'sdvp/6570.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_1.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_2.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_3.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_4.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_5.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_6.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_7.jpg'},
        {stimulus: window.task_github + 'sdvp/SDVPS_8.jpg'},
        {stimulus: window.task_github + 'iaps_pos/1463.jpg'},
        {stimulus: window.task_github + 'iaps_pos/1811.jpg'},
        {stimulus: window.task_github + 'iaps_pos/2071.jpg'},
        {stimulus: window.task_github + 'iaps_pos/2154.jpg'},
        {stimulus: window.task_github + 'iaps_pos/4610.jpg'},
        {stimulus: window.task_github + 'iaps_pos/5480.jpg'},
        {stimulus: window.task_github + 'iaps_pos/5829.jpg'},
        {stimulus: window.task_github + 'iaps_pos/7400.jpg'},
        {stimulus: window.task_github + 'iaps_pos/7492.jpg'},
        {stimulus: window.task_github + 'iaps_pos/8380.jpg'},
        {stimulus: window.task_github + 'iaps_pos/8503.jpg'},
      ];

      var fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        trial_duration: 1000,
        data: {
          task: 'fixation'
        }
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
        response_ends_trial: false, // Let the trial end based on duration
        data: {
          task: 'response'
        }
      };
      
      var test_procedure = {
        timeline: [fixation, test, response],
        timeline_variables: test_stimuli,
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
          return `<p>Your average response time was ${rt}ms.</p>
            <p>Press any key to complete the experiment. Thank you for your time!</p>`;
        }
      };
      timeline.push(debrief_block);

      /* start the experiment */
      jsPsych.run(timeline);
    
    } catch (error) {
        if (document.getElementById('display_stage')) {
            document.getElementById('display_stage').innerHTML = '<p style="color: red;">Error initializing experiment. Please refresh the page.</p>';
        }
    }
}

});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/
});
